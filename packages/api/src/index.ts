import express from 'express';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import threatRoutes from './routes/threats';
import reportRoutes from './routes/reports';
import rewardRoutes from './routes/rewards';
import statsRoutes from './routes/stats';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
let redisStatus = 'connecting';
redisClient.on('error', (err) => { console.error('Redis error', err); redisStatus = 'error'; });
redisClient.on('connect', () => { console.log('Redis connected'); redisStatus = 'connected'; });
redisClient.connect().catch(console.error);

let mongoStatus = 'connecting';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldweb3')
    .then(() => { console.log('MongoDB connected'); mongoStatus = 'connected'; })
    .catch(err => { console.error('MongoDB error', err); mongoStatus = 'error'; });

app.use('/api/auth', authRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/stats', statsRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mongodb: mongoStatus,
        redis: redisStatus
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
