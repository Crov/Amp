const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 16 })
        .withMessage('Username must be between 3 and 16 characters'),

    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters long')
]

const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
]

const validationResults = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    next();
}


router.post('/register', validateRegistration, validationResults, authController.register);
router.post('/login', validateLogin, validationResults, authController.login);

module.exports = router;