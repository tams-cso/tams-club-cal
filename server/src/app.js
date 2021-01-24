require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
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
    addVolunteering,
    addClub,
    deleteClub,
} = require('./database');
const { uploadImage, getImage, deleteClubImages } = require('./images');

// Clean up the 'cache' folder
fs.readdir(path.join(__dirname, 'cache'), (err, files) => {
    if (err) throw err;

    for (const file of files) {
        if (file !== '.placeholder') {
            fs.unlink(path.join(__dirname, 'cache', file), (err) => {
                if (err) throw err;
            });
        }
    }
});

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
                if (req.query.update) club.execs[i].img = await uploadImage(files[`exec${i}`], club.oldExecs[i].img);
                else club.execs[i].img = await uploadImage(files[`exec${i}`]);
            }
        }

        if (req.query.update === 'true') {
            const id = await updateClub(club, req.query.id);
            res.status(200);
            res.send({ id });
        } else {
            const id = await addClub(club);
            if (id === null) res.sendStatus(400);
            else {
                res.status(200);
                res.send({ id });
            }
        }
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
    var id = null;
    if (req.query.update === 'true') id = await updateVolunteering(req.body, req.query.id);
    else id = await addVolunteering(req.body);
    if (id !== null) {
        res.status(200);
        res.send({ id });
    } else {
        res.sendStatus(400);
    }
});

app.post('/delete-club', async (req, res, next) => {
    var good = (await deleteClubImages(req.body.id)) === 200 && (await deleteClub(req.body.id));
    if (good) res.sendStatus(200);
    else res.sendStatus(400);
});

app.get(/\/static\/.*/, async (req, res, next) => {
    getImage(req.path.substring(7), res);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
