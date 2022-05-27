import express, { Request, Response } from 'express';
import { sendError } from '../functions/util';
import TextData from '../models/text-data';
const router = express.Router();

/**
 * GET /text-data/external-links
 *
 * Gets the list of external links
 */
router.get('/text-data/external-links', async (req: Request, res: Response) => {
    // TODO: Remove this from the index router and put it into its own router file
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
router.put('/text-data/external-links', async (req: Request, res: Response) => {
    try {
        const linkRes = await TextData.updateOne({ id: 1 }, JSON.parse(req.body), { upsert: true });
        if (linkRes.acknowledged) res.status(204);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Could not get external links :(');
    }
});

export default router;
