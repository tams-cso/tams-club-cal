const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const { getClubList } = require('./database');

app.use(cors());

app.get('/', (req, res, next) => {
    console.log(req.query);
    res.send('hello!');
});

app.get('/clubs', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const clubs = await getClubList();
    res.send(clubs);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
