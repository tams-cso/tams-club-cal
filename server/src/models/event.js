const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        id: String,
        eventId: String,
        type: String,
        name: String,
        club: String,
        description: String,
        start: Number,
        end: Number,
        history: [String],
    },
    { collection: 'events' },
)

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;