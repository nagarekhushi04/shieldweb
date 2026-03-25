import mongoose from 'mongoose';
import { createClient } from 'redis';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const redisStatus = { status: 'connecting' };
export const mongoStatus = { status: 'connecting' };

class MockRedisClient {
    store = new Map<string, string>();
    on(event: string, cb: any) {}
    async connect() { return Promise.resolve(); }
    async get(key: string) { return this.store.get(key) || null; }
    async setEx(key: string, ttl: number, val: string) {
        this.store.set(key, val);
        setTimeout(() => this.store.delete(key), ttl * 1000);
    }
    async del(key: string) { this.store.delete(key); }
}

export const redisClient = process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379'
    ? createClient({ url: process.env.REDIS_URL })
    : new MockRedisClient() as any;

export async function connectDB() {
    try {
        if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
            redisClient.on('error', (err: any) => { console.error('Redis error', err); redisStatus.status = 'error'; });
            redisClient.on('connect', () => { console.log('Redis connected'); redisStatus.status = 'connected'; });
            await redisClient.connect().catch(console.error);
        } else {
            console.log('Using in-memory Mock Redis');
            redisStatus.status = 'connected (mock)';
        }
    } catch(err) {
        console.error(err);
    }

    try {
        let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shieldweb3';
        
        await mongoose.connect(uri);
        console.log('MongoDB connected to ' + uri);
        mongoStatus.status = 'connected';
    } catch (err) {
        console.error('MongoDB error', err);
        mongoStatus.status = 'error';
    }
}
