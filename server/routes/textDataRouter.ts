import express, { Request, Response } from 'express';
import { sendError } from '../functions/util';
import TextData from '../models/text-data';
import { asyncHandler } from '../functions/asyncHandler';
const router = express.Router();

/**
 * GET /text-data/external-links
 *
 * Gets the list of external links
 */
router.get(
    '/external-links',
    asyncHandler(async (req: Request, res: Response) => {
        const dataRes = await TextData.findOne({ type: 'external-links' });
        res.send(dataRes.data);
    }),
);

/**
 * PUT /text-data/external-links
 *
 * Updates the list of external links with new data
 */
router.put(
    '/external-links',
    asyncHandler(async (req: Request, res: Response) => {
        const linkRes = await TextData.updateOne({ type: 'external-links' }, req.body, { upsert: true });
        if (linkRes.acknowledged) res.sendStatus(204);
    }),
);

export default router;
