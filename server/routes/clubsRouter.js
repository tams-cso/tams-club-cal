const express = require('express');
const multer = require('multer');
const { processClubUpload } = require('../functions/images');
const { newId, createNewHistory, sendError } = require('../functions/util');
const Club = require('../models/club');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// Create images object for multer
const imageUpload = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'exec', maxCount: 20 },
]);

/**
 * POST /clubs
 *
 * Creates a new club
 */
router.post('/', imageUpload, async (req, res, next) => {
    try {
        const { coverImg, coverImgThumbnail, execImgList, club } = await processClubUpload(req);

        const historyId = newId();
        const id = newId();

        const execs = club.execs.map((e, i) => ({
            name: e.name,
            position: e.position,
            description: e.description || '',
            img: execImgList[i],
        }));

        const newClub = new Club({
            id,
            name: club.name,
            advised: club.advised,
            description: club.description,
            links: club.links,
            coverImgThumbnail,
            coverImg,
            execs,
            committees: club.committees,
            history: [historyId],
        });
        const newHistory = await createNewHistory(req, newClub, 'clubs', id, historyId, true, club);

        const clubRes = await newClub.save();
        const historyRes = await newHistory.save();
        if (clubRes === newClub && historyRes === newHistory) res.send({ ok: 1 });
        else sendError(res, 500, 'Unable to add new club to database');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

/**
 * PUT /clubs/<id>
 */
router.put('/:id', imageUpload, async (req, res, next) => {
    try {
        const id = req.params.id;
        const prev = await Club.findOne({ id }).exec();
        if (!prev) {
            sendError(res, 400, 'Invalid event ID');
            return;
        }

        const { coverImg, coverImgThumbnail, execImgList, club } = await processClubUpload(req);

        const execs = club.execs.map((e, i) => ({
            name: e.name,
            position: e.position,
            description: e.description || '',
            img: execImgList[i] || e.img || '',
        }));

        const historyId = newId();
        const newHistory = await createNewHistory(req, prev, 'clubs', id, historyId, false, club);
        const clubRes = await Club.updateOne(
            { id },
            {
                $set: {
                    name: club.name,
                    advised: club.advised,
                    description: club.description,
                    links: club.links,
                    coverImgThumbnail,
                    coverImg,
                    execs,
                    committees: club.committees,
                    history: [...club.history, historyId],
                },
            }
        );
        const historyRes = await newHistory.save();

        if (clubRes.n === 1 && historyRes === newHistory) res.send({ ok: 1 });
        else sendError(res, 500, 'Unable to update event in database.');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

module.exports = router;
