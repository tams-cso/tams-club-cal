import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
    {
        id: String,
        resource: String,
        resourceId: String,
        time: Number,
        editorId: String,
        fields: [
            {
                key: String,
                oldValue: mongoose.Schema.Types.Mixed,
                newValue: mongoose.Schema.Types.Mixed,
            },
        ],
    },
    { collection: 'history' }
);

const History = mongoose.model('History', historySchema);

export default History;
