const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: String,
        email: String,
        name: String,
    },
    { collection: 'users' }
)

const User = mongoose.model('User', userSchema);
module.exports = User;