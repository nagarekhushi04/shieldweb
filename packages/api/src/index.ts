import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import threatRoutes from './routes/threats';
import reportRoutes from './routes/reports';
import rewardRoutes from './routes/rewards';
import statsRoutes from './routes/stats';

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

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Monitoring Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        monitoring.recordRequest(req.path, Date.now() - start, res.statusCode);
    });
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);



app.use('/api/auth', authRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/stats', statsRoutes);

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
