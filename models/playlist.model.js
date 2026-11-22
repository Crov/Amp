const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
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
    isPublic: {
        type: Boolean,
        default: true
    },
    playlistImage: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);