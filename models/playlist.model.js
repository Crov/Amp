const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    description: {
        type: String,
        trim: true,
        maxLength: 200
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: [new mongoose.Schema({
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    })],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);