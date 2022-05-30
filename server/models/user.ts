import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';
import type { UserObject } from '../functions/types';

// User levels: 0 - standard, 1 - clubs, 2 - admin
const userSchema = new mongoose.Schema({
    id: String,
    sub: String,
    email: String,
    name: String,
    token: String,
    level: Number,
});
userSchema.plugin(mongoosePaginate);

interface UserDocument extends Document, UserObject {}

const User = mongoose.model<UserDocument, PaginateModel<UserDocument>>('User', userSchema, 'users');

export default User;
