import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
    {
        id: String,
        feedback: String,
        name: String,
        time: Number,
    },
    { collection: 'feedback' }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
