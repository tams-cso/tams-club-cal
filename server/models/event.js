const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        id: String,
        eventId: String,
        reservationId: String,
        type: String,
        name: String,
        club: String,
        description: String,
        start: Number,
        end: Number,
        location: String,
        allDay: Boolean,
        history: [String],
    },
    { collection: 'events' },
)

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;