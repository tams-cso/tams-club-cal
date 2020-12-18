const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res, next) => {
    console.log(req.query);
    res.send('hello!');
});

app.get('/clubs', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    var clubs = [
        {
            name: 'CSO (Computer Science Organization)',
            advised: 'true',
            fb: 'https://www.facebook.com/groups/cso2021',
            website: 'https://cso.tams.club',
            coverImg: 'https://api.michaelzhao.xyz/static/club-cal/cso.png',
        },
        {
            name: 'HOPE (Helping Other People Everywhere)',
            advised: 'true',
            fb: 'https://www.facebook.com/groups/hope2021',
            website: 'https://tamshope.org',
            coverImg: 'https://api.michaelzhao.xyz/static/club-cal/hope.png',
        },
        {
            name: 'Ambassadors',
            advised: 'true',
            fb: 'https://www.facebook.com/groups/435813770636084',
            website: '',
            coverImg: 'https://api.michaelzhao.xyz/static/club-cal/ambassadors.png',
        },
        {
            name: 'TCS (TAMS Culinary Society)',
            advised: 'false',
            fb: 'https://www.facebook.com/groups/481790829408149',
            website: '',
            coverImg: 'https://api.michaelzhao.xyz/static/club-cal/tcs.png',
        },
        {
            name: 'NACRA (Nihon Arts and Culture Research)',
            advised: 'false',
            fb: 'https://www.facebook.com/groups/416640248899431',
            website: '',
            coverImg: 'https://api.michaelzhao.xyz/static/club-cal/nacra.png',
        },
    ];
    res.send(clubs);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
