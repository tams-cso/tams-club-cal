import express, { Request, Response } from 'express';
import { sendError } from '../functions/util';
import ExternalLinks from '../models/external-links';
const router = express.Router();

/**
 * GET /external-links
 *
 * Gets the list of external links
 */
router.get('/external-links', async (req: Request, res: Response) => {
    try {
        const links = await ExternalLinks.findOne({ id: 1 });
        res.send(links);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Could not get external links :(');
    }
});

/**
 * PUT /external-links
 *
 * Updates the list of external links with new data
 */
router.put('/external-links', async (req: Request, res: Response) => {
    try {
        const linkRes = await ExternalLinks.updateOne({ id: 1 }, JSON.parse(req.body), { upsert: true });
        if (linkRes.acknowledged) res.status(204);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Could not get external links :(');
    }
});

export default router;
