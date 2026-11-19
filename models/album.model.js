const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
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
    coverImage: {
        type: String,
        trim: true
    },
    releaseYear: {
        type: Number,
        default: new Date().getFullYear()
    }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);