const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 
const dotenv = require('dotenv');

dotenv.config();

// Configure Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find user in the database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User exists
                    return done(null, user);
                }

                // If user doesn't exist, create a new user
                user = new User({
                    username: profile.emails[0].value,
                    googleId: profile.id,
                    role: 'User',
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user into session
passport.serializeUser((user, done) => {
    // Serialize user by ID
    console.log('Serializing User:', user.id);
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        console.log('Deserializing User:', user);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});




passport.serializeUser((user, done) => {
    console.log('Serializing User:', user); // Log the user object
    done(null, user.id); // Ensure only the user ID is being serialized
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing User ID:', id); // Log the user ID
        const user = await User.findById(id);
        console.log('Deserialized User:', user); // Log the retrieved user
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error, null);
    }
});
