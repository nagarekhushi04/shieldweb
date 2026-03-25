import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import threatRoutes from './routes/threats';
import reportRoutes from './routes/reports';
import rewardRoutes from './routes/rewards';
import statsRoutes from './routes/stats';

import { connectDB, redisStatus, mongoStatus } from './db';

dotenv.config();

connectDB();

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
        mongodb: mongoStatus.status,
        redis: redisStatus.status
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
