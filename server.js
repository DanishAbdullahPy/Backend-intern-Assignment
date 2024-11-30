const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/utils/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(
    cors({
        origin: 'http://localhost:3000', // Adjust based on your frontend's URL
        credentials: true,
    })
);

// Express session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_session_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./src/config/passportConfig');

// Database connection
connectDB();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/user', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Assignment Submission Portal Backend');
});

// Error Handling for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack || err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
