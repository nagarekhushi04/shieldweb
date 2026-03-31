import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ALGORITHM = 'HS256' as const;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('❌ CRITICAL: JWT_SECRET must be at least 32 characters in production');
    } else {
        console.warn('⚠️ WARNING: JWT_SECRET is weak. Use at least 32 characters for production.');
    }
}

export function issueToken(payload: { walletAddress: string; userId: string; isAdmin: boolean }): string {
    return jwt.sign(
        { ...payload, iat: Math.floor(Date.now() / 1000) },
        JWT_SECRET || 'dev_secret_key_that_is_long_enough_for_now',
        { algorithm: JWT_ALGORITHM, expiresIn: '24h', issuer: 'shieldweb3' }
    );
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET || 'dev_secret_key_that_is_long_enough_for_now', {
            algorithms: [JWT_ALGORITHM],
            issuer: 'shieldweb3'
        });
        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired, please reconnect wallet' });
        }
        return res.status(401).json({ error: 'Invalid or malformed token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    next();
};
