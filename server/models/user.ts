import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: String,
        sub: String,
        email: String,
        name: String,
        token: String,
        admin: Boolean,
    },
    { collection: 'users' }
)

const User = mongoose.model('User', userSchema);

export default User;