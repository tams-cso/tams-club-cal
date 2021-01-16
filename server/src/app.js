require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('formidable');

const {
    getClubList,
    getClub,
    addFeedback,
    addEvent,
    getEvent,
    getEventList,
    getVolunteering,
    updateVolunteering,
    updateEvent,
    updateClub,
} = require('./database');
const { uploadImage, getImage } = require('./images');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get('/', (req, res, next) => {
    res.send('hello!');
});

app.get('/club', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const club = await getClub(req.query.id);
    if (club.description == undefined) res.sendStatus(400);
    else res.send(club);
});

app.get('/club-list', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const clubs = await getClubList();
    res.send(clubs);
});

app.post('/add-club', async (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            res.status(400);
            res.send({ error: '400 Bad Request', description: 'Invalid form response' });
            return;
        }

        var club = JSON.parse(fields.data);
        if (club.coverImgBlobs.img !== null) {
            club.coverImgThumbnail = await uploadImage(files.thumb, club.coverImgThumbnail);
            club.coverImg = await uploadImage(files.img, club.coverImg);
        }
        for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
            if (club.execProfilePicBlobs[i] !== null) {
                club.execs[i].img = await uploadImage(files[`exec${i}`], club.oldExecs[i].img);
            }
        }

        if (req.query.update === 'true') await updateClub(club, req.query.id);
        res.status(200);
        res.send({ url: club.coverImgThumbnail, execs: club.execs });
    });
});

app.get('/volunteering', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const volunteering = await getVolunteering();
    res.send(volunteering);
});

app.post('/feedback', async (req, res, next) => {
    if (req.body.feedback == '') {
        res.sendStatus(400);
        return;
    }
    addFeedback(req.body.feedback);
    res.sendStatus(200);
});

app.get('/event', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const event = await getEvent(req.query.id);
    res.send(event);
});

app.get('/event-list', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const events = await getEventList();
    res.send(events);
});

app.post('/add-event', async (req, res, next) => {
    if (req.query.update === 'true') updateEvent(req.body, req.query.id);
    else addEvent(req.body);
    res.sendStatus(200);
});

app.post('/add-volunteering', async (req, res, next) => {
    if (req.query.update === 'true') await updateVolunteering(req.body, req.query.id);
    res.sendStatus(200);
});

app.get(/\/static\/.*/, async (req, res, next) => {
    getImage(req.path.substring(7), res);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
