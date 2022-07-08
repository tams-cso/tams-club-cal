import AWS from 'aws-sdk';
import sharp from 'sharp';
import { RequestWithClubFiles } from '../types/RequestWithClubFiles';
import { newId } from './util';

// Connect to AWS S3 instance
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
const BUCKET = `${
    process.env.NODE_ENV === 'production' && !process.env.STAGING ? '' : 'staging-'
}tams-club-calendar-images`;

/**
 * Will compress, resize, and upload all images passed to a club upload.
 * This will return an object with the string urls of the coverImgThumbnail,
 * coverImg, and array of exec imgs.
 */
export async function processClubUpload(req: RequestWithClubFiles) {
    const cover = req.files.cover ? req.files.cover[0] : null;
    const execs = req.files.exec ? req.files.exec : null;
    const club: ClubObject = JSON.parse(req.body.data);
    const execPhotos: boolean[] = JSON.parse(req.body.execPhotos);

    let coverSrc: string = club.coverImg;
    let coverThumbSrc: string = club.coverImgThumbnail;
    let execsSrc: string[] = club.execs.map((e) => e.img || '');

    if (cover) {
        const compressedCover = await compressImage(cover, 1800);
        const compressedCoverThumbnail = await compressImage(cover, 600);
        coverSrc = await uploadImage('covers', compressedCover);
        coverThumbSrc = await uploadImage('thumbs', compressedCoverThumbnail);
        deletePrevious(club.coverImg);
        deletePrevious(club.coverImgThumbnail);
    }

    if (execs && execs.length > 0) {
        const rawExecList = execPhotos.map((e: boolean, i: number) => (!e ? null : execs[i]));
        const compressedExecs = await Promise.all(
            rawExecList.map(async (e: MulterFile) => {
                return await compressImage(e, 300);
            })
        );
        execsSrc = await Promise.all(
            compressedExecs.map(async (e) => {
                return await uploadImage('execs', e);
            })
        );
        execsSrc.forEach((e, i) => {
            if (e && club.execs[i]) deletePrevious(club.execs[i].img);
        });
    }

    return { coverImg: coverSrc, coverImgThumbnail: coverThumbSrc, execImgList: execsSrc, club };
}

/**
 * Compresses and resizes image to webp format
 */
async function compressImage(input: MulterFile, width: number): Promise<Buffer> {
    if (!input) return null;
    return sharp(input.buffer).resize(width).webp().toBuffer();
}

/**
 * Uploads an images to a specified resource given a blob.
 *
 * @returns The ID of the image
 */
async function uploadImage(resource: string, buffer: Buffer): Promise<string> {
    if (!buffer) return null;

    const id = newId();

    try {
        await s3
            .putObject({
                Bucket: BUCKET,
                Key: `${resource}/${id}.webp`,
                Body: buffer,
            })
            .promise();
        return `${resource}/${id}.webp`;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Deletes the previous image that was used
 */
async function deletePrevious(previousSrc: string): Promise<1> {
    if (!previousSrc) return null;
    try {
        await s3
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

/**
 * Deletes all images from a club object, given the club
 */
export async function deleteClubImages(club: ClubObject) {
    const urls = [];
    if (club.coverImg && club.coverImg !== '') urls.push(club.coverImg);
    if (club.coverImgThumbnail && club.coverImgThumbnail !== '') urls.push(club.coverImgThumbnail);
    club.execs.forEach((exec) => {
        if (exec.img && exec.img !== '') urls.push(exec.img);
    });

    // Return if nothing to delete
    if (urls.length === 0) return;

    try {
        await s3
            .deleteObjects({
                Bucket: BUCKET,
                Delete: { Objects: urls.map((u) => ({ Key: u })) },
            })
            .promise();
        return 1;
    } catch (error) {
        console.error(error);
        return null;
    }
}
