const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        id: String,
        eventId: String,
        name: String,
        club: String,
        description: String,
        start: Number,
        end: Number,
        location: String,
        history: [String],
    },
    { collection: 'reservations' },
)

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;