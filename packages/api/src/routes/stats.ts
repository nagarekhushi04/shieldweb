import { Router } from 'express';
import Threat from '../models/Threat';
import User from '../models/User';

const router = Router();

router.get('/global', async (req, res) => {
    try {
        const totalThreats = await Threat.countDocuments();
        const verifiedThreats = await Threat.countDocuments({ verified: true });
        const totalReporters = (await Threat.distinct('reportedBy.walletAddress')).length;
        
        const startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);
        const threatsToday = await Threat.countDocuments({ createdAt: { $gte: startOfToday } });
        
        const topThreatTypes = await Threat.aggregate([
            { $group: { _id: "$threatType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ totalThreats, verifiedThreats, totalReporters, threatsBlockedToday: threatsToday, topThreatTypes });
    } catch (err) {
        res.status(500).json({ error: "Error" });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ verifiedReports: -1 }).limit(10);
        
        const formatted = users.map((user, index) => ({
            rank: index + 1,
            walletAddress: user.walletAddress,
            totalReports: user.totalReports || 0,
            verifiedReports: user.verifiedReports || 0,
            shw3Earned: user.totalRewardsEarned || 0,
            badge: index === 0 ? 'Legend' : index < 3 ? 'Elite' : 'Defender'
        }));

        res.json(formatted);
    } catch {
        res.status(500).json({ error: "Error" });
    }
});

export default router;
