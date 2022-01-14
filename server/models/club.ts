import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
    {
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
        history: [String],
    },
    { collection: 'clubs' }
);

const Club = mongoose.model('Club', clubSchema);

export default Club;
