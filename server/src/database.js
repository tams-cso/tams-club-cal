const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@tams-cal-db.seuxs.mongodb.net/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => console.log('Connected to mongodb'));

async function getClub(id) {
    try {
        const db = client.db('clubs');
        const collection = db.collection('data');
        const club = await collection.findOne({ objId: id });
        return club;
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
        const collection = db.collection('data');
        const event = await collection.findOne({ objId: id });
        return event;
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
        // TODO: Check to make sure it doesn't match existing ID
        const objId = crypto.randomBytes(16).toString('hex');
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

module.exports = { getClubList, getClub, updateClubs, addFeedback, addEvent, getEvent, getEventList, getVolunteering };
