const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@tams-cal-db.seuxs.mongodb.net/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => console.log('Connected to mongodb'));

async function getClub(id) {
    try {
        const db = client.db('clubs');
        const collection = db.collection('data');
        const club = await collection.findOne({ infoId: id });
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

async function addEvent(event) {
    try {
        const db = client.db('events');
        const infoCollection = db.collection('info');
        const dataCollection = db.collection('data');
        infoCollection.insertOne({
            type: event.type,
            club: event.club,
            startTime: event.start,
            endTime: event.end,
        });
        dataCollection.insertOne({
            links: event.links,
            addedBy: event.addedBy,
            editedBy: event.editedBy,
            description: event.description,
        });
    } catch (error) {
        console.dir(error);
    }
}

module.exports = { getClubList, getClub, updateClubs, addFeedback, addEvent, getVolunteering };
