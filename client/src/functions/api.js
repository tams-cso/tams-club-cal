function getEvents() {
    fetch('https://api.tams.club/events')
        .then((res) => res.json())
        .then((json) => console.log(json));
}

async function getClubList() {
    return await fetch('http://localhost:5000/clubs').then((res) => res.json());
}

// TODO: Add the rest of the requests
// see https://github.com/MichaelZhao21/playlists-plus/blob/master/src/components/spotify-api.js
// for example fetch POST requests

export { getEvents, getClubList };
