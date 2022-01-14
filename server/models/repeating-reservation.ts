import mongoose from 'mongoose';

const repeatingReservationSchema = new mongoose.Schema(
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
        repeatEnd: Number,
        history: [String],
    },
    { collection: 'repeatingReservations' }
);

const RepeatingReservation = mongoose.model('Repeating Reservations', repeatingReservationSchema);

export default RepeatingReservation;
