const express = require('express');
const Club = require('../models/club');
const router = express.Router();

/**
 * GET /clubs
 *
 * Sends the list of all clubs
 */
router.get('/', async (req, res, next) => {
    const clubs = await Club.find({});
    res.send(clubs);
});

/**
 * GET /clubs/<id>
 *
 * Gets a club by id
 */
 router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const club = await Club.findOne({ id }).exec();
    if (club) res.send(club);
    else sendError(res, 400, 'Invalid club id');
});

module.exports = router;