import mongoose from 'mongoose';

const textDataSchema = new mongoose.Schema(
    {
        type: String,
        data: Object,
    },
    { collection: 'text-data' }
);

const TextData = mongoose.model('Text Data', textDataSchema);

export default TextData;
