const mongoose = require('mongoose');

const volunteeringSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        club: String,
        description: String,
        filters: {
            open: Boolean,
            limited: Boolean,
            semester: Boolean,
            setTimes: Boolean,
            weekly: Boolean,
        },
        history: [String],
    },
    { collection: 'volunteering' }
);

const Volunteering = mongoose.model('Volunteering', volunteeringSchema);
module.exports = Volunteering;
