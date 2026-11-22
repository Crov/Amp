const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        default: null
    },
    duration: {
        type: Number,
        required: true,
    },
    audioFile: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    playCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    coverImage: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);