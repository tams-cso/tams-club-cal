import express from 'express';
import type { Request, Response } from 'express';
import { sendError, newId } from '../functions/util';
import Feedback from '../models/feedback';
const router = express.Router();

/**
 * POST /feedback
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const newFeedback = new Feedback({
            id: newId(),
            feedback: req.body.feedback,
            name: req.body.name,
            time: req.body.time,
        });

        const feedbackRes = await newFeedback.save();
        if (feedbackRes == newFeedback) res.send({ ok: 1 });
        else sendError(res, 500, 'Unable to add feedback to database');
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Unable to add feedback to database');
    }
});

export default router;