const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client
    .connect()
    .then(() => console.log('Connected to mongodb'))
    .catch((err) => console.dir(err));

// TODO: add time range limitations to get event list
async function getEventList() {
    try {
        const db = client.db('events');
        const collection = db.collection('info');

        const events = await collection.find().toArray();

        if (events === null) {
            // TODO: Add this console.dir to every GET
            console.dir({ error: 'Could not get events.info' });
            return { good: -1 };
        }
        return { events, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getEvent(id) {
    try {
        const db = client.db('events');
        const collectionData = db.collection('data');
        const collectionInfo = db.collection('info');

        const eventData = await collectionData.findOne({ objId: id });
        const eventInfo = await collectionInfo.findOne({ objId: id });

        if (eventData === null) return { good: 0 };
        return { ...eventData, ...eventInfo, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function addEvent(event, user) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');

        // Create a unique objID
        // TODO: encapsulate this somehow
        var objId;
        while (true) {
            objId = crypto.randomBytes(16).toString('hex');
            const eventInfo = await infoCollection.find({ objId }).toArray();
            if (eventInfo.length == 0) break;
        }

        const infoRes = await infoCollection.insertOne({
            objId,
            type: event.type,
            name: event.name,
            club: event.club,
            start: event.start,
            end: event.end,
        });
        const dataRes = await dataCollection.insertOne({
            objId,
            description: event.description,
        });
        if (dataRes.result.ok === 0 || infoRes.result.ok === 0) return { good: -1 };

        const historyRes = await createHistory('events', objId, user, event);
        if (historyRes !== 1) return { good: -1 };

        return { objId, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateEvent(event, id, user) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');

        const infoRes = await infoCollection.updateOne(
            { objId: id },
            {
                $set: {
                    type: event.type,
                    name: event.name,
                    club: event.club,
                    start: event.start,
                    end: event.end,
                },
            }
        );
        const dataRes = await dataCollection.updateOne(
            { objId: id },
            {
                $set: {
                    description: event.description,
                },
            }
        );
        if (dataRes.matchedCount === 0 || infoRes.matchedCount === 0) return 0;

        const historyRes = await addToHistory('events', id, user, event);
        if (historyRes !== 1) return -1;

        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function addEventCalendarId(objId, eventId) {
    try {
        const db = client.db('events');
        const collection = db.collection('calendar');

        const res = await collection.insertOne({ objId, eventId });

        if (res.insertedCount === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function getEventCalendarId(objId) {
    try {
        const db = client.db('events');
        const collection = db.collection('calendar');

        console.log(objId);
        const ids = await collection.findOne({ objId });

        if (ids === null) {
            // TODO: Add this console.dir to every GET
            console.dir({ error: 'Could not get events.calendar' });
            return { good: -1 };
        }
        return { ids, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getClubList() {
    try {
        const db = client.db('clubs');
        const collection = db.collection('info');
        const clubs = await collection.find().toArray();

        if (clubs === null) {
            console.dir({ error: 'Could not get clubs.info' });
            return { good: -1 };
        }
        return { clubs, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getClub(id) {
    try {
        const db = client.db('clubs');
        const collectionData = db.collection('data');
        const collectionInfo = db.collection('info');

        const clubData = await collectionData.findOne({ objId: id });
        const clubInfo = await collectionInfo.findOne({ objId: id });

        if (clubData === null) return { good: 0 };
        return { ...clubData, ...clubInfo, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function addClub(club, user) {
    try {
        const db = client.db('clubs');
        const dataCollection = db.collection('data');
        const infoCollection = db.collection('info');

        // Generate an object ID
        var objId;
        while (true) {
            objId = crypto.randomBytes(16).toString('hex');
            const clubTest = await infoCollection.find({ objId }).toArray();
            if (clubTest.length == 0) break;
        }

        const infoRes = await infoCollection.insertOne({
            objId,
            coverImgThumbnail: club.coverImgThumbnail,
            name: club.name,
            advised: club.advised,
            fb: club.fb,
            website: club.website,
        });
        const dataRes = await dataCollection.insertOne({
            objId,
            coverImg: club.coverImg,
            description: club.description,
            execs: club.execs,
            committees: club.committees,
        });
        if (dataRes.result.ok === 0 || infoRes.result.ok === 0) return { good: -1 };

        const historyRes = await createHistory('clubs', objId, user, club);
        if (historyRes !== 1) return { good: -1 };

        return { objId, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateClub(club, id, user, oldImages) {
    try {
        const db = client.db('clubs');
        const dataCollection = db.collection('data');
        const infoCollection = db.collection('info');

        const infoRes = await infoCollection.updateOne(
            { objId: id },
            {
                $set: {
                    coverImgThumbnail: club.coverImgThumbnail,
                    name: club.name,
                    advised: club.advised,
                    fb: club.fb,
                    website: club.website,
                },
            }
        );
        const dataRes = await dataCollection.updateOne(
            { objId: id },
            {
                $set: {
                    coverImg: club.coverImg,
                    description: club.description,
                    execs: club.execs,
                    committees: club.committees,
                },
            }
        );
        if (dataRes.matchedCount === 0 || infoRes.matchedCount === 0) return 0;

        const historyRes = await addToHistory('clubs', id, user, club, oldImages);
        if (historyRes !== 1) return -1;

        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function getVolunteeringList() {
    try {
        const db = client.db('volunteering');
        const collection = db.collection('data');
        const volunteering = await collection.find().toArray();

        if (volunteering === null) {
            console.dir({ error: 'Could not get volunteering.info' });
            return { good: -1 };
        }
        return { volunteering, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getVolunteering(id) {
    try {
        const db = client.db('volunteering');
        const collectionData = db.collection('data');

        const data = await collectionData.findOne({ _id: ObjectId(id) });

        if (data === null) return { good: 0 };
        return { ...data, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function addVolunteering(vol, user) {
    try {
        const db = client.db('volunteering');
        const collection = db.collection('data');
        var data = {
            name: vol.name,
            club: vol.club,
            description: vol.description,
            filters: vol.filters,
            signupTime: vol.signupTime,
        };

        const res = await collection.insertOne(data);
        if (res.result.ok === 0) return { good: -1 };

        const historyRes = await createHistory('volunteering', data._id.str, user, data);
        if (historyRes !== 1) return 0;

        return { id: data._id, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateVolunteering(vol, id, user) {
    try {
        const db = client.db('volunteering');
        const collection = db.collection('data');

        const res = await collection.updateOne(
            { _id: ObjectId(id) },
            {
                $set: {
                    name: vol.name,
                    club: vol.club,
                    description: vol.description,
                    filters: vol.filters,
                    signupTime: vol.signupTime,
                },
            }
        );
        if (res.matchedCount === 0) return 0;

        const historyRes = await addToHistory('volunteering', id, user, vol);
        if (historyRes !== 1) return 0;

        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function addFeedback(feedback, user) {
    try {
        const db = client.db('feedback');
        const collection = db.collection('data');

        const res = await collection.insertOne({ date: new Date().getTime(), feedback, user });

        if (res.insertedCount === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function upsertUser(email, refreshToken) {
    try {
        const db = client.db('data');
        const collection = db.collection('users');

        const res = await collection.updateOne(
            { email },
            { $set: { email, refresh: refreshToken, lastRequest: new Date().getTime() } },
            { upsert: 1 }
        );

        if (res.upsertedCount === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function findUser(email) {
    try {
        const db = client.db('data');
        const collection = db.collection('users');
        const res = await collection.findOne({ email });
        return res;
    } catch (error) {
        console.dir(error);
        return null;
    }
}

/**
 * Create a history object for a new resource
 *
 * @param {'events' | 'clubs' | 'volunteering'} resource The resource that was changed
 * @param {string} id The hex objId or _id (volunteering) of the object
 * @param {string} user User name or ip address
 * @param {object} data Edited data object
 */
async function createHistory(resource, id, user, data) {
    try {
        const db = client.db('history');
        const listCollection = db.collection('list');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');

        const now = new Date().getTime();

        const infoRes = await infoCollection.insertOne({
            editId: id,
            resource,
            list: [
                {
                    name: data.name,
                    editor: user.name,
                    email: user.email,
                    time: now,
                },
            ],
        });
        const dataRes = await dataCollection.insertOne({
            editId: id,
            resource,
            list: [data],
        });
        const listRes = await listCollection.insertOne({
            editId: id,
            editIndex: 0,
            resource,
            name: data.name,
            editor: user.name,
            email: user.email,
            time: now,
        });

        if (infoRes.result.ok === 0 || dataRes.result.ok === 0 || listRes.result.ok === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

/**
 * Add to a history object
 *
 * @param {'events' | 'clubs' | 'volunteering'} resource The resource that was changed
 * @param {string} id The hex objId or _id (volunteering) of the object
 * @param {string} user User name or ip address
 * @param {object} data Edited data object
 * @param {string[]} [imageIds] URLs of images that are to be deleted (only applies for resource='clubs')
 */
async function addToHistory(resource, id, user, data, imageIds = null) {
    try {
        const db = client.db('history');
        const listCollection = db.collection('list');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');

        const now = new Date().getTime();
        const index = (await dataCollection.findOne({ editId: id })).list.length;

        const infoRes = await infoCollection.updateOne(
            { editId: id, resource },
            {
                $push: {
                    list: {
                        name: data.name,
                        editor: user.name,
                        email: user.email,
                        time: now,
                    },
                },
            }
        );
        const dataRes = await dataCollection.updateOne(
            { editId: id, resource },
            {
                $push: {
                    list: data,
                },
            }
        );
        const listRes = await listCollection.insertOne({
            editId: id,
            editIndex: index,
            resource,
            name: data.name,
            editor: user.name,
            email: user.email,
            time: now,
        });

        if (resource === 'clubs') {
            // Add 2629800000 milliseconds (1 month) to current time
            const aMonthFromNow = now + 2629800000;

            // Map images ids to objects to add to database
            imageObjs = imageIds.map((id) => ({ imageId: id, deleteDate: aMonthFromNow }));

            // POST and send error if bad
            const imageCollection = db.collection('images');
            const imageRes = await imageCollection.insertMany(imageObjs);
            if (imageRes.result.ok === 0) return -1;
        }

        if (infoRes.matchedCount === 0 || dataRes.matchedCount === 0 || listRes.result.ok === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function getHistoryList() {
    try {
        const db = client.db('history');
        const collection = db.collection('list');
        const data = await collection.find().toArray();
        if (date === null) return { good: -1 };
        return { data, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getHistoryInfo(resource, id) {
    try {
        const db = client.db('history');
        const collection = db.collection('info');
        const data = await collection.findOne({ editId: id, resource });
        if (data === null) return { good: 0 };
        return { data, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getHistoryData(resource, id, index) {
    try {
        const db = client.db('history');
        const collection = db.collection('data');
        const data = await collection.findOne({ editId: id, resource });
        if (data === null || data.list.length <= index) return { good: 0 };
        return { data: data.list[index], good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function getSpecificDb(dbName, collectionName) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const data = await collection.find().toArray();

        if (data === null) {
            console.dir(`Could not get ${db}.${collection}`);
            return { good: -1 };
        }
        return { collection: data, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function addToSpecificDb(dbName, collectionName, data) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const res = await collection.insertMany(JSON.parse(data));

        if (res.result.ok === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function uploadLogs(logData) {
    try {
        const db = client.db('data');
        const collection = db.collection('logs');
        const res = await collection.insertOne({ date: new Date().toISOString().substring(0, 10), log: logData });
        if (res.insertedCount !== 1) {
            console.dir('Could not insert log data into data.logs!');
            return -1;
        }
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function getExpiredImages() {
    try {
        const db = client.db('history');
        const collection = db.collection('images');
        const data = collection.find({ deleteDate: { $lt: new Date().getTime() } });

        if (data === null) return { good: -1 };
        return { data, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

module.exports = {
    getEventList,
    getEvent,
    addEvent,
    updateEvent,
    addEventCalendarId,
    getEventCalendarId,
    getVolunteeringList,
    getVolunteering,
    addVolunteering,
    updateVolunteering,
    getClubList,
    getClub,
    addClub,
    updateClub,
    addFeedback,
    upsertUser,
    findUser,
    createHistory,
    addToHistory,
    getHistoryList,
    getHistoryInfo,
    getHistoryData,
    getSpecificDb,
    addToSpecificDb,
    uploadLogs,
    getExpiredImages,
};
