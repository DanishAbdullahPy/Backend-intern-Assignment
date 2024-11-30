const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Upload Assignment
const uploadAssignment = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { task, adminUsername } = req.body;

    try {
        // Find admin by username
        const admin = await User.findOne({ username: adminUsername, role: 'Admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Create assignment
        const assignment = new Assignment({
            user: req.user._id,
            task,
            admin: admin._id,
        });

        await assignment.save();

        res.status(201).json({ message: 'Assignment uploaded successfully', assignment });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { uploadAssignment, getAllAdmins };
