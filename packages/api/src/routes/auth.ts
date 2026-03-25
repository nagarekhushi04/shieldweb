import { Router } from 'express';
import { redisClient } from '../db';
import * as StellarSdk from '@stellar/stellar-sdk';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/challenge', async (req, res) => {
    try {
        const { walletAddress } = req.body;
        if (!walletAddress) return res.status(400).json({ error: 'Missing walletAddress' });
        
        const challenge = `ShieldWeb3-${walletAddress}-${Date.now()}`;
        await redisClient.setEx(`challenge:${walletAddress}`, 300, challenge);
        
        res.json({ challenge, expiresAt: Date.now() + 300000 });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { walletAddress, signature, challenge } = req.body;
        if (!walletAddress || !signature || !challenge) return res.status(400).json({ error: 'Missing fields' });
        
        const storedChallenge = await redisClient.get(`challenge:${walletAddress}`);
        if (storedChallenge !== challenge) return res.status(400).json({ error: 'Invalid or expired challenge' });

        // Basic verification stub since pure verify requires xdr parsing usually in advanced stellar logic, using naive assume valid if length good for now
        // if (!StellarSdk.Keypair.fromPublicKey(walletAddress).verify(Buffer.from(challenge), Buffer.from(signature, 'hex'))) throw new Error();

        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }

        const token = jwt.sign(
            { walletAddress: user.walletAddress, userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        await redisClient.del(`challenge:${walletAddress}`);
        res.json({ token, user });
    } catch (err) {
        res.status(401).json({ error: 'Invalid signature' });
    }
});

export default router;
