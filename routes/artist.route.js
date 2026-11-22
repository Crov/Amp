const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');
const auth = require('../middleware/auth');
const artistUpload = require('../middleware/artistUpload');

router.get('/portal', auth.authenticate, artistController.getArtistPortal);
router.post('/', auth.authenticate, (req, res, next) => {
    artistUpload.single('profilePicture')(req, res, (error) => {
        if (!error) return next();

        return res.status(400).render('artistPortal', {
            error: error.message
        });
    });
}, artistController.createArtist);

router.get('/:id', artistController.getArtistProfile);

module.exports = router;
