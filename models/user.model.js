const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 16
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'artist', 'user'],
        default: 'user'
    },
    followedArtists: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Artist',
        default: []
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);