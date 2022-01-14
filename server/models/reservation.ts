import mongoose from 'mongoose';

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
        allDay: Boolean,
        history: [String],
    },
    { collection: 'reservations' },
)

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;