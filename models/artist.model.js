const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 26
    },
    bio: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profilePicture: {
        type: String,
        trim: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);