const AWS = require('aws-sdk');
const sharp = require('sharp');
const { Request } = require('express');
const { newId } = require('./util');
AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const BUCKET = 'tams-club-calendar-images';

/**
 * Will compress, resize, and upload all images passed to a club upload.
 * This will return an object with the string urls of the coverImgThumbnail,
 *  coverImg, and array of exec imgs.
 *
 * @param {Request} req Express request object
 */
async function processClubUpload(req) {
    const cover = req.files.cover ? req.files.cover[0] : '';
    const execs = req.files.exec ? req.files.exec : '';
    const club = JSON.parse(req.body.data);
    const execPhotos = JSON.parse(req.body.execPhotos);

    let coverSrc = club.coverImg;
    let coverThumbSrc = club.coverImgThumbnail;
    let execsSrc = club.execs.map((e) => e.img || '');

    if (cover) {
        const compressedCover = await compressImage(cover, 1800);
        const compressedCoverThumbnail = await compressImage(cover, 600);
        coverSrc = await uploadImage('covers', compressedCover);
        coverThumbSrc = await uploadImage('thumbs', compressedCoverThumbnail);
        deletePrevious(club.coverImg);
        deletePrevious(club.coverImgThumbnail);
    }

    if (execs && execs.length > 0) {
        let count = 0;
        const rawExecList = execPhotos.map((e, i) => (!e ? null : execs[count++]));
        console.log(rawExecList);
        const compressedExecs = await Promise.all(
            rawExecList.map(async (e) => {
                return await compressImage(e);
            })
        );
        execsSrc = await Promise.all(
            compressedExecs.map(async (e) => {
                return await uploadImage('execs', e);
            })
        );
        console.log(execsSrc);
        execsSrc.forEach((e, i) => {
            if (e && club.execs[i]) deletePrevious(club.execs[i].img);
        });
    }

    return { coverImg: coverSrc, coverImgThumbnail: coverThumbSrc, execImgList: execsSrc, club };
}

/**
 * Compresses and resizes image to webp format
 *
 * @param {object} input Input buffer
 * @param {number} width Width to resize to
 * @returns {Promise<Buffer>} Resized image
 */
async function compressImage(input, width) {
    if (!input) return null;
    return sharp(input.buffer).resize(width).webp().toBuffer();
}

async function uploadImage(resource, blob) {
    if (!blob) return null;

    const id = newId();

    try {
        await s3
            .putObject({
                Bucket: BUCKET,
                Key: `${resource}/${id}.webp`,
                Body: blob,
            })
            .promise();
        return `${resource}/${id}.webp`;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deletePrevious(previousSrc) {
    if (!previousSrc) return null;
    try {
        const res = await s3
            .deleteObject({
                Bucket: BUCKET,
                Key: previousSrc.substring(1),
            })
            .promise();
        return 1;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { processClubUpload };
