import mongoose from 'mongoose';

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
        location: String,
        noEnd: Boolean,
        allDay: Boolean,
        repeats: Number,
        repeatsUntil: Number,
        repeatOriginId: String,
        publicEvent: Boolean,
        reservation: Boolean,
        history: [String],
    },
    { collection: 'activities' }, // TODO: Change to events when DB is migrated!!!
)

const Event = mongoose.model('Event', eventSchema);

export default Event;
