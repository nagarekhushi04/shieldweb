import { createClient } from 'redis';

export const redisStatus = { status: 'connecting', latency: 0, hitRate: 100 };
export const mongoStatus = { status: 'disabled', latency: 0 };

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

    // MongoDB is completely disabled
    console.log('MongoDB functionality stripped entirely. Running fully without DB.');
    mongoStatus.status = 'disabled';
    mongoStatus.latency = 0;
}
