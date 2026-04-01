import mongoose from 'mongoose';
import { createClient } from 'redis';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const redisStatus = { status: 'connecting', latency: 0, hitRate: 100 };
export const mongoStatus = { status: 'connecting', latency: 0 };

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

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB() {
    try {
        if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
            const start = Date.now();
            redisClient.on('error', (err: any) => { console.error('Redis error', err); redisStatus.status = 'error'; });
            redisClient.on('connect', () => { 
                console.log('Redis connected'); 
                redisStatus.status = 'connected';
                redisStatus.latency = Date.now() - start;
            });
            await redisClient.connect().catch(console.error);
        } else {
            console.log('Using in-memory Mock Redis');
            redisStatus.status = 'connected (mock)';
            redisStatus.latency = 0;
        }
    } catch(err) {
        console.error(err);
    }

    try {
        let uri = process.env.MONGODB_URI;
        
        const start = Date.now();
        // Fallback to MongoMemoryServer if no URI is provided or if connection fails
        try {
            if (uri) {
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
                console.log('MongoDB connected to ' + uri);
                mongoStatus.status = 'connected';
                mongoStatus.latency = Date.now() - start;
                return;
            }
        } catch (initialErr) {
            console.warn('Initial MongoDB connection failed, falling back to MemoryServer');
        }

        console.log('Starting MongoMemoryServer...');
        mongoMemoryServer = await MongoMemoryServer.create();
        uri = mongoMemoryServer.getUri();
        await mongoose.connect(uri);
        console.log('MongoDB connected to In-Memory Server: ' + uri);
        mongoStatus.status = 'connected (memory)';
        mongoStatus.latency = Date.now() - start;
    } catch (err) {
        console.error('Final MongoDB error', err);
        mongoStatus.status = 'error';
        mongoStatus.latency = -1;
    }
}
