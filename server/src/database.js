const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@tams-cal-db.seuxs.mongodb.net/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => console.log('Connected to mongodb'));

async function getClub(id) {
    try {
        const db = client.db('clubs');
        const collectionData = db.collection('data');
        const collectionInfo = db.collection('info');
        const clubData = await collectionData.findOne({ objId: id });
        const clubInfo = await collectionInfo.findOne({ objId: id });
        return { ...clubData, ...clubInfo };
    } catch (error) {
        console.dir(error);
    }
}

async function getClubList() {
    try {
        const db = client.db('clubs');
        const collection = db.collection('info');
        const clubs = await collection.find().toArray();
        return clubs;
    } catch (error) {
        console.dir(error);
    }
}

async function getVolunteering() {
    try {
        const db = client.db('volunteering');
        const collection = db.collection('data');
        const volunteering = await collection.find().toArray();
        return volunteering;
    } catch (error) {
        console.dir(error);
    }
}

function updateClubs() {}

async function addFeedback(feedback) {
    try {
        const db = client.db('feedback');
        const collection = db.collection('data');
        collection.insertOne({ date: new Date().getTime(), feedback });
    } catch (error) {
        console.dir(error);
    }
}

async function getEvent(id) {
    try {
        const db = client.db('events');
        const collectionData = db.collection('data');
        const collectionInfo = db.collection('info');
        const eventData = await collectionData.findOne({ objId: id });
        const eventInfo = await collectionInfo.findOne({ objId: id });
        return { ...eventData, ...eventInfo };
    } catch (error) {
        console.dir(error);
    }
}

async function getEventList() {
    try {
        const db = client.db('events');
        const collection = db.collection('info');
        const events = await collection.find().toArray();
        return events;
    } catch (error) {
        console.dir(error);
    }
}

async function addEvent(event) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');
        var objId;
        while (true) {
            objId = crypto.randomBytes(16).toString('hex');
            const eventInfo = await infoCollection.find({ objId }).toArray();
            if (eventInfo.length == 0) break;
        }
        infoCollection.insertOne({
            objId,
            name: event.name,
            type: event.type,
            club: event.club,
            start: event.start,
            end: event.end,
        });
        dataCollection.insertOne({
            objId,
            links: event.links,
            addedBy: event.addedBy,
            editedBy: [],
            description: event.description,
        });
    } catch (error) {
        console.dir(error);
    }
}

async function updateEvent(event, id) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');
        infoCollection.updateOne(
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
        dataCollection.updateOne(
            { objId: id },
            {
                $set: {
                    links: event.links,
                    addedBy: event.addedBy,
                    editedBy: [],
                    description: event.description,
                },
            }
        );
    } catch (error) {
        console.dir(error);
    }
}

async function updateVolunteering(vol, id) {
    try {
        const db = client.db('volunteering');
        const collection = db.collection('data');
        collection.updateOne(
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
    } catch (error) {
        console.dir(error);
    }
}

async function updateClub(club, id) {
    try {
        const db = client.db('clubs');
        const dataCollection = db.collection('data');
        const infoCollection = db.collection('info');
        dataCollection.updateOne(
            { objId: id },
            {
                $set: {
                    description: club.description,
                    execs: club.execs,
                    committees: club.committees,
                    coverImg: club.coverImg
                }
            }
        );
        infoCollection.updateOne(
            { objId: id },
            {
                $set: {
                    name: club.name,
                    advised: club.advised,
                    fb: club.fb,
                    website: club.website,
                    coverImgThumbnail: club.coverImgThumbnail
                }
            }
        );
    } catch (error) {
        console.dir(error);
    }
}

module.exports = {
    getClubList,
    getClub,
    updateClubs,
    addFeedback,
    addEvent,
    getEvent,
    getEventList,
    updateEvent,
    getVolunteering,
    updateVolunteering,
    updateClub
};
