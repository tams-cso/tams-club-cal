import config from '../files/config.json';

function getEvents() {
    fetch('https://api.tams.club/events')
        .then((res) => res.json())
        .then((json) => console.log(json));
}

async function getClubList() {
    return await fetch(`${config.backend}/clubs`).then((res) => res.json());
}

async function postFeedback(feedback) {
    console.log(feedback);
    fetch(`${config.backend}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()).then(data => console.log(data));
}

// TODO: Add the rest of the requests
// see https://github.com/MichaelZhao21/playlists-plus/blob/master/src/components/spotify-api.js
// for example fetch POST requests

export { getEvents, getClubList, postFeedback };
