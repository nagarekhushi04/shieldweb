import { Router } from 'express';
import { getAccountBalance } from '../services/stellarService';
import Threat from '../models/Threat';

const router = Router();

router.get('/balance/:walletAddress', async (req, res) => {
    try {
        const balance = await getAccountBalance(req.params.walletAddress);
        res.json(balance);
    } catch (e) {
        res.status(500).json({ error: "Error fetching balance" });
    }
});

router.get('/history/:walletAddress', async (req, res) => {
    try {
        const history = await Threat.find({ "reportedBy.walletAddress": req.params.walletAddress, verified: true });
        res.json(history);
    } catch (e) {
        res.status(500).json({ error: 'Error' });
    }
});

export default router;
