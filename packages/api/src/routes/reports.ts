import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import Threat from '../models/Threat';
import User from '../models/User';
import { hashUrl, reportThreatOnChain, mintRewardTokens } from '../services/stellarService';
import { scoreUrl } from '../services/mlService';
import { io } from '../index';
import { validate, reportSchema } from '../validators';
import { getISOWeek, getYear } from 'date-fns';
import Contribution from '../models/Contribution';

const router = Router();

// Validation is now handled by the validate(reportSchema) middleware


router.post('/submit', requireAuth, validate(reportSchema), async (req: AuthRequest, res) => {
    try {
        const validated = req.body;
        const domain = new URL(validated.url).hostname;
        const hash = hashUrl(validated.url);
        
        const mlRes = await scoreUrl(validated.url);
        
        let threat = await Threat.findOne({ urlHash: hash });
        if (!threat) {
            threat = new Threat({
                urlHash: hash,
                originalUrl: validated.url,
                domain,
                threatType: validated.threatType,
                severity: validated.severity,
                mlScore: mlRes.score,
                reportedBy: [{ walletAddress: req.user.walletAddress }]
            });
        } else {
            threat.reportedBy.push({ walletAddress: req.user.walletAddress, timestamp: new Date() });
            threat.upvotes += 1;
        }
        await threat.save();

        const txHash = await reportThreatOnChain('SECRET_PLACEHOLDER', hash, validated.threatType, validated.severity);
        if (txHash) {
            threat.onChainTxHash = txHash;
            threat.onChain = true;
            await threat.save();
        }

        await User.updateOne({ walletAddress: req.user.walletAddress }, { $inc: { totalReports: 1 } });

        // Emit to all subscribers
        io.to('threats:all').emit('threat:new', {
            domain: threat.domain,
            threatType: threat.threatType,
            severity: threat.severity,
            mlScore: threat.mlScore,
            timestamp: new Date().toISOString()
        });

        // Emit to high-severity channel if severity >= 3
        if (threat.severity >= 3) {
            io.to('threats:high-severity').emit('threat:critical', {
                domain: threat.domain,
                threatType: threat.threatType,
                severity: threat.severity,
                message: `CRITICAL: ${threat.domain} flagged as ${threat.threatType}`
            });
        }

        // Emit updated stats every 5 new threats
        const totalCount = await Threat.countDocuments();
        if (totalCount % 5 === 0) {
            const verifiedCount = await Threat.countDocuments({ verified: true });
            io.to('stats:live').emit('stats:update', { totalThreats: totalCount, verifiedThreats: verifiedCount });
        }

        // Record contribution
        await Contribution.create({
            contributorWallet: req.user.walletAddress,
            type: 'report',
            referenceId: threat._id,
            points: 10,
            weekNumber: getISOWeek(new Date()),
            year: getYear(new Date())
        });

        res.json({ reportId: threat._id, mlScore: mlRes.score, txHash });
    } catch (err) {
        res.status(400).json({ error: 'Invalid request' });
    }
});

router.get('/my-reports', requireAuth, async (req: AuthRequest, res) => {
    try {
        const threats = await Threat.find({ "reportedBy.walletAddress": req.user.walletAddress }).sort({ createdAt: -1 });
        const reports = threats.map(t => ({
            _id: t._id,
            url: t.originalUrl,
            threatType: t.threatType,
            severity: t.severity,
            status: t.verified ? 'Verified' : 'Pending',
            reward: t.verified ? 10 : 0,
            createdAt: t.createdAt,
            txHash: t.onChainTxHash || null
        }));
        res.json(reports);
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

router.patch('/:id/verify', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
    try {
        const threat = await Threat.findById(req.params.id);
        if (!threat) return res.status(404).json({ error: 'Not found' });
        
        threat.verified = true;
        threat.verifiedBy = req.user.walletAddress;
        await threat.save();

        if (threat.reportedBy.length > 0) {
            const firstReporter = threat.reportedBy[0].walletAddress;
            await mintRewardTokens(firstReporter, 10);
            await User.updateOne({ walletAddress: firstReporter }, { $inc: { verifiedReports: 1, totalRewardsEarned: 10, shw3Balance: 10 } });
        }

        res.json(threat);
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

export default router;
