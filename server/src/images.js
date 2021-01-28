const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const Dropbox = require('dropbox');
const { getClub } = require('./database');
const dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

const CACHE_TIMEOUT = 3600000; // Cache gets deleted after an hour (3,600,000 ms)
var cache = {};

/**
 * Uploads an image to dropbox, naming it with a 16 digit hex ID
 *
 * @param {import('formidable').File} file File path from Formidable
 * @param {string} oldId The id of the image to replace
 * @returns {Promise<string>} Final relative path to retrive images from (eg. /static/2hjf724hfw8ufbn249fhnwe9ugh2)
 */
async function uploadImage(file, oldId = null) {
    var id = '/' + crypto.randomBytes(16).toString('hex');
    if (file.type.includes('png')) id += '.png';
    else id += '.jpg';

    // Uploads new image
    // TODO: Check for fs and dropbox read/write errors
    const data = fs.readFileSync(file.path);
    await dbx.filesUpload({ path: id, contents: data });

    // Deletes old image if it was in the database
    if (oldId !== null && oldId !== undefined && oldId.startsWith('/')) {
        try {
            const res = await dbx.filesDeleteV2({ path: oldId });
            console.log(res);
        } catch (error) {
            console.dir(error);
        }
    }

    return id;
}

/**
 * Downloads an image or gets image from cache to send to user
 *
 * @param {string} id ID of image to get
 * @param {import('express').Response} res Express response object
 */
async function getImage(id, res) {
    // Check for image in cache
    if (Object.keys(cache).find((key) => key === id)) {
        res.sendFile(cache[id]);
        return;
    }

    try {
        // Download image from dropbox
        const data = await dbx.filesDownload({ path: id });
        var filePath = path.join(__dirname, 'cache', id.substring(1));
        fs.writeFileSync(filePath, data.result.fileBinary);
        res.sendFile(filePath);
        cache[id] = filePath;
        setTimeout(() => {
            fs.unlink(filePath, () => {});
            delete cache[id];
        }, CACHE_TIMEOUT);
    } catch (error) {
        console.dir(error);
        res.status(400);
        res.send({ error: '400 Bad Request', description: 'File not found' });
    }
}

async function deleteClubImages(id) {
    const club = await getClub(id);
    var toDelete = [];
    if (club.coverImg !== null) {
        toDelete.push({ path: club.coverImg });
        toDelete.push({ path: club.coverImgThumbnail });
    }
    club.execs.forEach((e) => {
        if (e.img !== null) toDelete.push({ path: e.img });
    });
    const res = await dbx.filesDeleteBatch({ entries: toDelete });
    return res.status;
}

module.exports = { uploadImage, getImage, deleteClubImages };
