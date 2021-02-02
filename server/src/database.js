const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => console.log('Connected to mongodb'));

// TODO: add time range limitations to get event list
async function getEventList() {
    try {
        const db = client.db('events');
        const collection = db.collection('info');

        const events = await collection.find().toArray();

        if (events === null) {
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

async function addEvent(event) {
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
            name: event.name,
            type: event.type,
            club: event.club,
            start: event.start,
            end: event.end,
        });
        const dataRes = await dataCollection.insertOne({
            objId,
            links: event.links,
            editedBy: event.editedBy,
            description: event.description,
        });

        if (dataRes.result.ok === 0 || infoRes.result.ok === 0) return { good: -1 };
        return { objId, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateEvent(event, id) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');
        const infoRes = await infoCollection.updateOne(
            { objId: id },
            {
                $set: {
                    name: event.name,
                    type: event.type,
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
                    links: event.links,
                    editedBy: event.editedBy,
                    description: event.description,
                },
            }
        );
        if (dataRes.matchedCount === 0 || infoRes.matchedCount === 0) return 0;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
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

async function addClub(club) {
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
            name: club.name,
            advised: club.advised,
            fb: club.fb,
            website: club.website,
            coverImgThumbnail: club.coverImgThumbnail,
        });
        const dataRes = await dataCollection.insertOne({
            objId,
            description: club.description,
            execs: club.execs,
            committees: club.committees,
            coverImg: club.coverImg,
        });

        if (dataRes.result.ok === 0 || infoRes.result.ok === 0) return { good: -1 };
        return { objId, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateClub(club, id) {
    try {
        const db = client.db('clubs');
        const dataCollection = db.collection('data');
        const infoCollection = db.collection('info');
        const dataRes = await dataCollection.updateOne(
            { objId: id },
            {
                $set: {
                    description: club.description,
                    execs: club.execs,
                    committees: club.committees,
                    coverImg: club.coverImg,
                },
            }
        );
        const infoRes = await infoCollection.updateOne(
            { objId: id },
            {
                $set: {
                    name: club.name,
                    advised: club.advised,
                    fb: club.fb,
                    website: club.website,
                    coverImgThumbnail: club.coverImgThumbnail,
                },
            }
        );
        if (dataRes.matchedCount === 0 || infoRes.matchedCount === 0) return 0;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function deleteClub(id) {
    try {
        const db = client.db('clubs');
        const dataCollection = db.collection('data');
        const infoCollection = db.collection('info');
        dataCollection.deleteOne({ objId: id });
        infoCollection.deleteOne({ objId: id });
        return true;
    } catch (error) {
        console.dir(error);
        return false;
    }
}

async function getVolunteering() {
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

async function addVolunteering(vol) {
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
        return { id: data._id, good: 1 };
    } catch (error) {
        console.dir(error);
        return { good: -1 };
    }
}

async function updateVolunteering(vol, id) {
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
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function addFeedback(feedback) {
    try {
        const db = client.db('feedback');
        const collection = db.collection('data');
        
        const res = await collection.insertOne({ date: new Date().getTime(), feedback });
        
        if (res.insertedCount === 0) return -1;
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

module.exports = {
    getClubList,
    getClub,
    addFeedback,
    addEvent,
    getEvent,
    getEventList,
    updateEvent,
    getVolunteering,
    updateVolunteering,
    updateClub,
    addVolunteering,
    addClub,
    deleteClub,
};
