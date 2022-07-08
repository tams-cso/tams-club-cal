import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';

const clubSchema = new mongoose.Schema({
    id: String,
    name: String,
    advised: Boolean,
    description: String,
    links: [String],
    coverImgThumbnail: String,
    coverImg: String,
    execs: [
        {
            name: String,
            position: String,
            description: String,
            img: String,
        },
    ],
    committees: [
        {
            name: String,
            description: String,
            heads: [String],
            links: [String],
        },
    ],
});
clubSchema.plugin(mongoosePaginate);

interface ClubDocument extends Document, ClubObject {}

const Club = mongoose.model<ClubDocument, PaginateModel<ClubDocument>>('Club', clubSchema, 'clubs');

export default Club;
