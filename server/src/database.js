const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@tams-cal-db.seuxs.mongodb.net/clubs?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => console.log('Connected to mongodb'));

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
        // TODO: Calculate time from start and end time/date (use library to manage time zones)
        // Need to store times in milliseconds since Jan 1, 1970 + UTC time zone
        var startTimeMillis = 0;
        var endTimeMillis = 0;
        infoCollection.insertOne({
            type: event.type,
            club: event.club,
            startTime: startTimeMillis,
            eventTime: endTimeMillis,
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

module.exports = { getClubList, updateClubs, addFeedback, addEvent, getVolunteering };
