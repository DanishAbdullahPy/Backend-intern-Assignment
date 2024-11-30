// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register Route
router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role', 'Role must be either User or Admin').isIn(['User', 'Admin']),
    ],
    register
);

// Login Route
router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').exists(),
    ],
    login
);

// Google OAuth Route
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback Route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Redirect with token (adjust the frontend URL as needed)
        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

module.exports = router;
