import { Router } from 'express';
import { z } from 'zod';
import { redisClient } from '../db';
import Threat from '../models/Threat';
import { hashUrl, checkThreatOnChain } from '../services/stellarService';
import { scoreUrl } from '../services/mlService';

const router = Router();

const urlSchema = z.string().url();

router.get('/check', async (req, res) => {
    try {
        const { url } = req.query;
        const validUrl = urlSchema.parse(url as string);
        const domain = new URL(validUrl).hostname;
        const hash = hashUrl(validUrl);

        const cached = await redisClient.get(`threat:${hash}`);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        let threat: any = await Threat.findOne({ urlHash: hash });
        let responsePayload;

        if (threat) {
             responsePayload = { safe: !threat.active, threat, mlScore: threat.mlScore, source: 'db' };
        } else {
             const mlRes = await scoreUrl(validUrl);
             if (mlRes.score > 0.7) {
                 threat = new Threat({
                     urlHash: hash,
                     originalUrl: validUrl,
                     domain,
                     threatType: mlRes.prediction,
                     severity: 3,
                     mlScore: mlRes.score,
                     active: true
                 });
                 await threat.save();
                 responsePayload = { safe: false, threat, mlScore: mlRes.score, source: 'ml' };
             } else {
                 responsePayload = { safe: true, threat: null, mlScore: mlRes.score, source: 'ml' };
             }
             checkThreatOnChain(hash); // non-blocking
        }

        await redisClient.setEx(`threat:${hash}`, 300, JSON.stringify(responsePayload));
        res.json(responsePayload);
    } catch (err) {
        res.status(400).json({ error: 'Invalid request' });
    }
});

router.post('/bulk-check', async (req, res) => {
    try {
        const { urls } = req.body;
        if (!Array.isArray(urls) || urls.length > 20) return res.status(400).json({ error: 'Max 20 URLs allowed' });
        
        const results = await Promise.all(urls.map(async u => {
            try { urlSchema.parse(u); return { url: u, target: hashUrl(u) }; } catch { return { url: u, error: 'Invalid' }; }
        }));
        res.json({ results });
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});
// Using GET with body is technically doable but unstandard. Using GET for bulk-check as explicitly asked.
router.get('/bulk-check', async (req, res) => {
    try {
        const { urls } = req.body;
        if (!Array.isArray(urls) || urls.length > 20) return res.status(400).json({ error: 'Max 20 URLs allowed' });
        
        const results = await Promise.all(urls.map(async u => {
            try { urlSchema.parse(u); return { url: u, target: hashUrl(u) }; } catch { return { url: u, error: 'Invalid' }; }
        }));
        res.json({ results });
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const { page = 1, limit = 10, threatType, severity, verified } = req.query;
        const query: any = {};
        if (threatType) query.threatType = threatType;
        if (severity) query.severity = parseInt(severity as string);
        if (verified !== undefined) query.verified = verified === 'true';

        const threats = await Threat.find(query)
            .limit(parseInt(limit as string))
            .skip((parseInt(page as string) - 1) * parseInt(limit as string))
            .sort({ createdAt: -1 });
        
        res.json(threats);
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/:hash', async (req, res) => {
    try {
        const threat = await Threat.findOne({ urlHash: req.params.hash });
        if (!threat) return res.status(404).json({ error: 'Not found' });
        res.json(threat);
    } catch {
        res.status(500).json({ error: 'Error' });
    }
});

export default router;
