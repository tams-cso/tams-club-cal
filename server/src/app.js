const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

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
} = require('./database');

app.use(cors());
app.use(bodyParser.json());

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

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
