import express, { Request, Response } from 'express';
import { sendError } from '../functions/util';
import TextData from '../models/text-data';
const router = express.Router();

/**
 * GET /text-data/external-links
 *
 * Gets the list of external links
 */
router.get('/external-links', async (req: Request, res: Response) => {
    try {
        const dataRes = await TextData.findOne({ type: 'external-links' });
        res.send(dataRes.data);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Could not get external links :(');
    }
});

/**
 * PUT /text-data/external-links
 *
 * Updates the list of external links with new data
 */
router.put('/external-links', async (req: Request, res: Response) => {
    try {
        const linkRes = await TextData.updateOne({ type: 'external-links' }, req.body, { upsert: true });
        if (linkRes.acknowledged) res.sendStatus(204);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Could not get external links :(');
    }
});

export default router;
