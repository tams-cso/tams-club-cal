import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';
import { EventObject } from '../functions/types';

const eventSchema = new mongoose.Schema({
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
});
eventSchema.plugin(mongoosePaginate);

interface EventDocument extends Document, EventObject {}

const Event = mongoose.model<EventDocument, PaginateModel<EventDocument>>('Event', eventSchema, 'events');

export default Event;
