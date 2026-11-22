const Artist = require('../models/artist.model');
const User = require('../models/user.model');
const Album = require('../models/album.model');
const { getUserPlaylists } = require('./user.controller');
const fs = require('fs');
const mongoose = require('mongoose');

const removeUploadedFile = (req) => {
    if (req.file) {
        fs.unlink(req.file.path, () => {});
    }
};

exports.getArtistPortal = async (req, res, next) => {
    try {
        res.render('artistPortal');
    } catch (error) {
        next(error);
    }
};

exports.createArtist = async (req, res, next) => {
    try {
        const username = req.body.username?.trim();
        const bio = req.body.bio?.trim();
        if (!username || username.length < 3 || username.length > 26) {
            removeUploadedFile(req);
            return res.status(400).render('artistPortal', {
                error: 'Artist name must be between 3 and 26 characters.'
            });
        }

        const artist = await Artist.create({
            username,
            bio: bio || undefined,
            owner: req.user.id,
            profilePicture: req.file ? `/uploads/artists/${req.file.filename}` : undefined
        });

        const user = await User.findById(req.user.id);
        if (user && user.role !== 'admin') {
            user.role = 'artist';
            await user.save();
        }

        res.redirect(`/artists/${artist._id}`);
    } catch (error) {
        removeUploadedFile(req);
        next(error);
    }
};

exports.getArtistProfile = async (req, res, next) => {
    try {
        const artistId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(404).render('error', {
                code: '404',
                message: 'Artist not found'
            });
        }

        const artist = await Artist.findById(artistId).populate('songs').populate('albums');
        if (!artist) {
            return res.status(404).render('error', {
                code: '404',
                message: 'Artist not found'
            });
        }
        const playlists = req.user
            ? await getUserPlaylists(req.user._id)
            : [];

        res.render('artistProfile', {
            artist,
            songs: artist.songs || [],
            albums: artist.albums || [],
            playlists
        });
    } catch (error) {
        next(error);
    }
}