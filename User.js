const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    dob : String,
    gender : String,
    age : Number
});

const User = mongoose.model('user', userSchema)

module.exports = User