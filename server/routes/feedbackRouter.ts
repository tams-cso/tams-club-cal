import express from 'express';
import type { Request, Response } from 'express';
import { sendError, newId } from '../functions/util';
import Feedback from '../models/feedback';
import { asyncHandler } from '../functions/asyncHandler';
const router = express.Router();

/**
 * GET /feedback
 */
router.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const feedback = await Feedback.find({}).sort({ time: -1 }).exec();
        res.send(feedback);
    }),
);

/**
 * POST /feedback
 */
router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const newFeedback = new Feedback({
            id: newId(),
            feedback: req.body.feedback,
            name: req.body.name,
            time: req.body.time,
        });

        const feedbackRes = await newFeedback.save();
        if (feedbackRes == newFeedback) res.sendStatus(204);
        else sendError(res, 500, 'Unable to add feedback to database');
    }),
);

export default router;
