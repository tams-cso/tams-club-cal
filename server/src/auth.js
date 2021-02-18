const { google } = require('googleapis');

const redirectUri = `${process.env.FRONTEND}/auth`;
const oauth2 = new google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, redirectUri);
const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

var users = new Map();

function getAuthUrl() {
    return oauth2.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
}

// https://developers.google.com/identity/protocols/oauth2/scopes#people
function getTokensAndInfo() {
    
}

module.exports = { getAuthUrl, getTokensAndInfo };
