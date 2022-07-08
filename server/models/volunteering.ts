import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';

const volunteeringSchema = new mongoose.Schema({
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
});
volunteeringSchema.plugin(mongoosePaginate);

interface VolunteeringDocument extends Document, VolunteeringObject {}

const Volunteering = mongoose.model<VolunteeringDocument, PaginateModel<VolunteeringDocument>>(
    'Volunteering',
    volunteeringSchema,
    'volunteering'
);

export default Volunteering;
