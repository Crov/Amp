const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.get('/:id', userController.getUserProfile);
router.post('/:id/recent/:songId', auth.authenticate, userController.recordRecentlyPlayed);

module.exports = router;