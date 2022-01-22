import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
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
        public: Boolean,
        reservation: Boolean,
        history: [String],
    },
    { collection: 'activities' },
)

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
