const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    cash:{
        type: Number,
        default: 1000,
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;