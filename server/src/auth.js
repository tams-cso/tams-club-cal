const { upsertUser, findUser } = require('./database');
const fetch = require('node-fetch');
const qs = require('querystring');
const { URLSearchParams } = require('url');

const SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

var users = new Map();

function getAuthUrl(state, frontend) {
    let params = {
        client_id: process.env.G_CLIENT_ID,
        redirect_uri: `${frontend}/auth`,
        response_type: 'code',
        scope: SCOPES.join(' '),
        access_type: 'offline',
        state,
    };
    return `https://accounts.google.com/o/oauth2/v2/auth?${qs.encode(params)}`;
}

async function getTokensAndInfo(code, refresh = false, frontend) {
    // Get tokens
    const body = new URLSearchParams();
    body.append('client_id', process.env.G_CLIENT_ID);
    body.append('client_secret', process.env.G_CLIENT_SECRET);
    body.append('grant_type', refresh ? 'refresh_token' : 'authorization_code');
    body.append('redirect_uri', `${frontend}/auth`);

    // Set correct parameter depending on if refresh token
    if (refresh) body.append('refresh_token', code);
    else body.append('code', code);

    // POST to token endpoint
    const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body });
    const tokens = await res.json();
    if (res.status !== 200) {
        console.dir(tokens);
        return null;
    }

    // Get user data
    const userRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const data = await userRes.json();
    if (userRes.status !== 200) {
        console.dir(data);
        return null;
    }

    // Save the user information and clear it after
    // 55 minutes (3300000 milliseconds). This is because
    // the access token expires after 60 minutes
    users.set(data.email, {
        email: data.email,
        name: data.name,
        timeout: setTimeout(() => users.delete(data.email), 3300000),
    });

    // Weird bug with refresh token
    if (tokens.refresh_token === null) {
        console.dir("Error in getTokensAndInfo with invalid refresh_token passed into upsertUser");
        return null;
    }

    // Update/insert user into database
    if (!refresh) upsertUser(data.email, tokens.refresh_token);

    // Send to user
    return data;
}

function getSavedUser(email) {
    // Don't run if user info has been retrieved recently
    const savedUser = users.get(email);
    if (savedUser === undefined) return null;
    return savedUser;
}

async function getLoggedInData(email) {
    const savedUser = getSavedUser(email);
    if (savedUser !== null) return savedUser;

    const user = await findUser(email);
    if (user === null) {
        return null;
    }

    const data = await getTokensAndInfo(user.refresh, true);
    if (data === null) return null;
    return data;
}

module.exports = { getAuthUrl, getTokensAndInfo, getSavedUser, getLoggedInData };
