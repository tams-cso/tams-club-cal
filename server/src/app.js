require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
    getClubList,
    getClub,
    addFeedback,
    addEvent,
    getEvent,
    getEventList,
    getVolunteeringList,
    updateVolunteering,
    updateEvent,
    updateClub,
    addVolunteering,
    addClub,
    deleteClub,
    getVolunteering,
} = require('./database');
const { getImage, deleteClubImages } = require('./images');
const { sendError, logRequest, parseForm } = require('./util');

// Clean up the 'cache' folder on start
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

// Check for defined API key and set NO_KEY constant
// If API_KEY env variable undefined, then NO_KEY will be true
const NO_KEY = process.env.API_KEY === undefined;

// Use CORS and bodyparser to recieve calls
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Trust proxy
app.set('trust proxy', true);

// Parse every request here first
app.use(function (req, res, next) {
    // Add CORS headers
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers', 'X-Requested-With');

    const static = req.path.includes('static');

    // Check for correct API key
    // and return '401 Unauthorized' if incorrect or not found
    // If there is no key defined OR it's a static image call, ignore this block
    if (!(NO_KEY || static)) {
        if (!(req.body.key === process.env.API_KEY || req.query.key === process.env.API_KEY)) {
            sendError(res, 401, 'Invalid API key. Pass the key in the POST body or in the querystring.');
            return;
        }
    }

    // Check for correct origin
    // Set this in the .env file as ORIGIN
    // This will throw an error if no origin is defined OR if the origin does not match the expected origin
    // The block will be skipped if no ORIGIN environmental variable is defined
    if (!static) {
        if (
            req.headers.origin === undefined ||
            (process.env.ORIGIN !== undefined && req.headers.origin.indexOf(process.env.ORIGIN) === -1)
        ) {
            sendError(res, 403, 'Invalid request origin.');
            return;
        }
    }

    // Log everything but static file requests
    if (!static) logRequest(req);

    // Continue looking for path matches
    next();
});

// Default path
app.get('/', (req, res, next) => {
    res.send({
        hi: 'idk how you got here but uh welcome!',
        key: "Either you're a developer, or we have some security issues to fix :))",
        github: 'https://github.com/MichaelZhao21/tams-club-cal/',
        documentation: 'https://docs.tams.club/',
        webiste: 'https://tams.club/',
    });
});

// Get event list
app.get('/events', async (req, res, next) => {
    const data = await getEventList();
    if (data.good === -1) sendError(res, 500, 'Unable to retrive events list');
    else {
        res.status(200);
        res.send(data.events);
    }
});

// Get single event by id
app.get('/events/:id', async (req, res, next) => {
    const event = await getEvent(req.params.id);
    if (event.good === -1) sendError(res, 500, 'Unable to retrive current event');
    else if (event.good === 0) sendError(res, 400, 'Invalid event objId');
    else {
        res.status(200);
        res.send(event);
    }
});

// Add event
app.post('/events', async (req, res, next) => {
    const data = await addEvent(req.body);
    if (data.good === -1) sendError(res, 500, 'Unable to add event');
    else {
        res.status(200);
        res.send({ id: data.objId });
    }
});

// Update event
app.post('/events/:id', async (req, res, next) => {
    // TODO: Check for correct id
    const good = await updateEvent(req.body, req.params.id);
    if (good === -1) sendError(res, 500, 'Unable to update event');
    else if (good === 0) sendError(res, 400, 'Invalid event id');
    else {
        res.status(200);
        res.send({ status: 200 });
    }
});

// Gets club list
app.get('/clubs', async (req, res, next) => {
    const data = await getClubList();
    if (data.good === -1) sendError(res, 500, 'Unable to retrive club list');
    else {
        res.status(200);
        res.send(data.clubs);
    }
});

// Get single club by id
app.get('/clubs/:id', async (req, res, next) => {
    const club = await getClub(req.params.id);
    if (club.good === -1) sendError(res, 500, 'Unable to retrive current club');
    else if (club.good === 0) sendError(res, 400, 'Invalid club objId');
    else {
        res.status(200);
        res.send(club);
    }
});

// Add a club
app.post('/clubs', async (req, res, next) => {
    parseForm(req, res, async (club) => {
        const data = await addClub(club);
        if (data.good === -1) sendError(res, 500, 'Unable to add club');
        else {
            res.status(200);
            res.send({ id: data.objId });
        }
    });
});

// Update a club
app.post('/clubs/:id', async (req, res, next) => {
    parseForm(req, res, async (club) => {
        const good = await updateClub(club, req.params.id);
        if (good === -1) sendError(res, 500, 'Unable to update clubs');
        else if (good === 0) sendError(res, 400, 'Invalid club id');
        else {
            res.status(200);
            res.send({ status: 200 });
        }
    });
});

// Get volunteering list
app.get('/volunteering', async (req, res, next) => {
    const data = await getVolunteeringList();
    if (data.good === -1) sendError(res, 500, 'Unable to retrive volunteering list');
    else {
        res.status(200);
        res.send(data.volunteering);
    }
});

// Get single volunteering by id
app.get('/volunteering/:id', async (req, res, next) => {
    const volunteering = await getVolunteering(req.params.id);
    if (volunteering.good === -1) sendError(res, 500, 'Unable to retrive current volunteering');
    else if (volunteering.good === 0) sendError(res, 400, 'Invalid volunteering id');
    else {
        res.status(200);
        res.send(volunteering);
    }
});

// Add volunteering
app.post('/volunteering', async (req, res, next) => {
    const data = await addVolunteering(req.body);
    if (data.good === -1) sendError(res, 500, 'Unable to add volunteering');
    else {
        res.status(200);
        res.send({ id: data.id });
    }
});

// Update volunteering
app.post('/volunteering/:id', async (req, res, next) => {
    const good = await updateVolunteering(req.body, req.params.id);
    if (good === -1) sendError(res, 500, 'Unable to update volunteering');
    else if (good === 0) sendError(res, 400, 'Invalid volunteering ID');
    else {
        res.status(200);
        res.send({ status: 200 });
    }
});

// Add feedback
app.post('/feedback', async (req, res, next) => {
    if (req.body.feedback == '') sendError(res, 400, 'Empty feedback text!');
    const good = await addFeedback(req.body.feedback);
    if (good === -1) sendError(res, 500, 'Unable to add feedback');
    else {
        res.status(200);
        res.send({ status: 200 });
    }
});

// Delete club
// TODO: Clean up
app.post('/delete-club', async (req, res, next) => {
    var good = (await deleteClubImages(req.body.id)) === 200 && (await deleteClub(req.body.id));
    if (good) {
        res.status(200);
        res.send({ status: 200 });
    } else sendError(res, 400, 'Could not delete club');
});

app.get(/\/static\/.*/, async (req, res, next) => {
    getImage(req.path.substring(7), res);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
