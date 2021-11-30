const express = require('express');
const { sendError, newId } = require('../functions/util');
const Feedback = require('../models/feedback');
const router = express.Router();

/**
 * POST /feedback
 */
router.post('/', async (req, res) => {
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

module.exports = router;