const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        id: String,
        resource: String,
        editId: String,
        time: Number,
        editor: {
            id: String,
            ip: String,
        },
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
module.exports = History;
