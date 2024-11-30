// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
        },
        password: {
            type: String,
            // Password is not required for OAuth users
        },
        role: {
            type: String,
            enum: ['User', 'Admin'],
            default: 'User',
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple documents without googleId
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving (only if password is modified)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// Method to match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
