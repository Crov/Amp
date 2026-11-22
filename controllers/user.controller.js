const User = require('../models/user.model');
const Playlist = require('../models/playlist.model');
const Artist = require('../models/artist.model');
const Song = require('../models/song.model');
const mongoose = require('mongoose');

const getUserPlaylists = (userId) =>
    Playlist.find({ owner: userId }).sort({ updatedAt: -1 });

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).render('error', {
                code: '404',
                message: 'User not found'
            });
        }

        const user = await User.findById(userId)
            .populate('followedArtists')
            .populate({
                path: 'likedSongs',
                populate: {
                    path: 'artist',
                    select: 'username'
                }
            })
            .populate({
                path: 'recentlyPlayed.song',
                populate: {
                    path: 'artist',
                    select: 'username'
                }
            });

        if (!user) {
            return res.status(404).render('error', {
                code: '404',
                message: 'User not found'
            });
        }

        const playlists = await getUserPlaylists(userId);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentlyPlayed = user.recentlyPlayed.filter(
            entry => entry.playedAt >= thirtyDaysAgo && entry.song
        );

        res.render('userProfile', {
            user,
            playlists,
            songs: user.likedSongs,
            artists: user.followedArtists,
            recentlyPlayed
        });
    } catch (error) {
        next(error);
    }
}

exports.recordRecentlyPlayed = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).render('error', {
                code: '403',
                message: 'Access denied'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id) ||
            !mongoose.Types.ObjectId.isValid(req.params.songId)) {
            return res.status(404).render('error', {
                code: '404',
                message: 'Song not found'
            });
        }

        const song = await Song.findById(req.params.songId);
        if (!song) {
            return res.status(404).render('error', {
                code: '404',
                message: 'Song not found'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', {
                code: '404',
                message: 'User not found'
            });
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentEntries = user.recentlyPlayed.filter(
            entry => entry.playedAt >= thirtyDaysAgo &&
                entry.song.toString() !== req.params.songId
        );

        recentEntries.unshift({
            song: req.params.songId,
            playedAt: new Date()
        });

        user.recentlyPlayed = recentEntries.slice(0, 30);
        await user.save();
        await Song.findByIdAndUpdate(req.params.songId, { $inc: { playCount: 1 } });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

exports.getUserPlaylists = getUserPlaylists;