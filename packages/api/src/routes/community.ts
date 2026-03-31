import { Router } from 'express';
import { getISOWeek, getYear } from 'date-fns';
import { requireAuth, AuthRequest } from '../middleware/auth';
import Threat from '../models/Threat';
import User from '../models/User';
import Contribution from '../models/Contribution';
import { redisClient } from '../db';

const router = Router();

// GET /api/community/contributors — top public profiles
router.get('/contributors', async (req, res) => {
    try {
        const topUsers = await User.find({})
            .sort({ verifiedReports: -1, shw3Balance: -1 })
            .limit(10)
            .select('walletAddress totalReports verifiedReports shw3Balance createdAt');
            
        const contributors = topUsers.map(u => ({
            walletAddress: `${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}`,
            totalReports: u.totalReports,
            verifiedReports: u.verifiedReports,
            shw3Earned: Number(u.shw3Balance).toFixed(2),
            joinedAt: u.createdAt,
            badge: u.verifiedReports > 50 ? 'Guardian' : (u.verifiedReports > 10 ? 'Sentinel' : 'Reporter')
        }));
        
        res.json(contributors);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/community/feed — public threat activity feed
router.get('/feed', async (req, res) => {
    try {
        const { cursor } = req.query;
        const query: any = {};
        if (cursor) query.createdAt = { $lt: new Date(cursor as string) };
        
        const feed = await Threat.find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .select('domain threatType severity verified createdAt');
            
        res.json({
            feed,
            nextCursor: feed.length > 0 ? feed[feed.length - 1].createdAt : null
        });
    } catch {
        res.status(500).json({ error: 'Feed unavailable' });
    }
});

// POST /api/community/vote/:threatId — one vote per wallet
router.post('/vote/:threatId', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { vote } = req.body;
        const { threatId } = req.params;
        const wallet = req.user.walletAddress;
        
        if (!['up', 'down'].includes(vote)) return res.status(400).json({ error: 'Invalid vote' });
        
        const voteKey = `vote:${threatId}:${wallet}`;
        const alreadyVoted = await redisClient.get(voteKey);
        if (alreadyVoted) return res.status(403).json({ error: 'Already voted on this threat' });
        
        const update = vote === 'up' ? { upvotes: 1 } : { downvotes: 1 };
        const threat = await Threat.findByIdAndUpdate(threatId, { $inc: update }, { new: true });
        
        if (!threat) return res.status(404).json({ error: 'Threat not found' });
        
        // Single vote per user (permanent in Redis for simplicity)
        await redisClient.set(voteKey, vote);
        
        // Record contribution
        await Contribution.create({
            contributorWallet: wallet,
            type: 'vote',
            referenceId: threatId,
            points: 1,
            weekNumber: getISOWeek(new Date()),
            year: getYear(new Date())
        });
        
        res.json({ success: true, threat });
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

// GET /api/community/leaderboard/weekly
router.get('/leaderboard/weekly', async (req, res) => {
    try {
        const week = getISOWeek(new Date());
        const year = getYear(new Date());
        const cacheKey = `leaderboard:weekly:${year}:${week}`;
        
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));
        
        const leaderboard = await Contribution.aggregate([
            { $match: { year, weekNumber: week } },
            { $group: {
                _id: '$contributorWallet',
                points: { $sum: '$points' },
                reports: { $sum: { $cond: [{ $eq: ['$type', 'report'] }, 1, 0] } }
            }},
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);
        
        // Calculate seconds until next Monday for caching
        const now = new Date();
        const nextMonday = new Date();
        nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
        nextMonday.setHours(0, 0, 0, 0);
        const ttl = Math.floor((nextMonday.getTime() - now.getTime()) / 1000);
        
        await redisClient.setEx(cacheKey, Math.max(ttl, 60), JSON.stringify(leaderboard));
        res.json(leaderboard);
    } catch {
        res.status(500).json({ error: 'Leaderboard unavailable' });
    }
});

// POST /api/community/comment/:threatId
router.post('/comment/:threatId', requireAuth, async (req: AuthRequest, res) => {
    try {
        const { comment } = req.body;
        const { threatId } = req.params;
        const wallet = req.user.walletAddress;
        
        if (!comment || comment.length > 280) return res.status(400).json({ error: 'Valid comment (max 280 chars) required' });
        
        const newComment = {
            walletAddress: wallet,
            content: comment,
            timestamp: new Date()
        };
        
        const threat = await Threat.findByIdAndUpdate(threatId, 
            { $push: { comments: newComment } },
            { new: true }
        );
        
        if (!threat) return res.status(404).json({ error: 'Threat not found' });
        
        await Contribution.create({
            contributorWallet: wallet,
            type: 'comment',
            referenceId: threatId,
            points: 2,
            weekNumber: getISOWeek(new Date()),
            year: getYear(new Date())
        });
        
        res.json({ comments: threat.comments });
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

export default router;
