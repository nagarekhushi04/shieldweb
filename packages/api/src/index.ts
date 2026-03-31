import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import authRoutes from './routes/auth';
import threatRoutes from './routes/threats';
import reportRoutes from './routes/reports';
import rewardRoutes from './routes/rewards';
import statsRoutes from './routes/stats';
import communityRoutes from './routes/community';

import { connectDB, redisStatus, mongoStatus } from './db';
import { monitoring } from './services/monitoringService';
import { createIndexes } from './scripts/createIndexes';
import { startDigestScheduler } from './services/digestService';
import Threat from './models/Threat';

dotenv.config();

connectDB().then(() => {
    createIndexes();
});

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }
});

export { io };

const PORT = process.env.PORT || 4000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://soroban-testnet.stellar.org", "https://horizon-testnet.stellar.org"]
        }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://shieldweb3.vercel.app',
    'http://localhost:5173',
    'chrome-extension://'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = allowedOrigins.some(o => origin.startsWith(o!));
        if (allowed) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// Monitoring Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        monitoring.recordRequest(req.path, Date.now() - start, res.statusCode);
    });
    next();
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many auth attempts, try again in 15 minutes' },
    standardHeaders: true
});

const checkLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { error: 'Rate limit exceeded for URL checks' }
});

const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { error: 'Max 20 reports per hour per IP' }
});

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
});

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: (used) => (used - 100) * 50
});

app.use('/api', globalLimiter);
app.use('/api', speedLimiter);

app.use('/api/auth', authLimiter);
app.use('/api/threats/check', checkLimiter);
app.use('/api/reports/submit', reportLimiter);



app.use('/api/auth', authRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/community', communityRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mongodb: mongoStatus.status,
        redis: redisStatus.status
    });
});

app.get('/api/health/detailed', async (req, res) => {
    const [stellar, ml] = await Promise.all([
        monitoring.checkStellarHealth(),
        monitoring.checkMLHealth()
    ]);

    res.json({
        status: 'ok',
        services: {
            api: { status: 'healthy', latency: 0 },
            mongodb: { status: mongoStatus.status, latency: mongoStatus.latency },
            redis: { status: redisStatus.status, latency: redisStatus.latency },
            stellar,
            ml
        },
        metrics: monitoring.getMetrics()
    });
});

// WebSocket Logic
io.on('connection', (socket) => {
    console.log('⚡ Client connected:', socket.id);
    
    socket.on('subscribe:threats', (filters: any) => {
        const filterStr = filters?.type || 'all';
        console.log(`📡 Client ${socket.id} subscribed to ${filterStr} threats`);
        socket.join(`threats:${filterStr}`);
    });
    
    socket.on('subscribe:stats', async () => {
        console.log(`📡 Client ${socket.id} subscribed to live stats`);
        socket.join('stats:live');
        
        // Initial stats push
        try {
            const totalThreats = await Threat.countDocuments();
            const verifiedThreats = await Threat.countDocuments({ verified: true });
            socket.emit('stats:update', { totalThreats, verifiedThreats });
        } catch (err) {
            console.error('Error sending initial stats via socket:', err);
        }
    });
    
    socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startDigestScheduler();
});
