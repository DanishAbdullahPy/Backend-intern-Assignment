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
        // Find admin by username and role
        const admin = await User.findOne({ username: adminUsername, role: 'Admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Create a new assignment
        const assignment = new Assignment({
            user: req.user._id, // Assuming req.user is set by middleware
            task,
            admin: admin._id,
        });

        // Save the assignment
        await assignment.save();

        res.status(201).json({
            message: 'Assignment uploaded successfully',
            assignment,
        });
    } catch (error) {
        console.error('Error in uploadAssignment:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
    try {
        // Fetch all users with the role 'Admin', excluding passwords
        const admins = await User.find({ role: 'Admin' }).select('-password -__v');
        res.status(200).json({
            message: 'Admins fetched successfully',
            admins,
        });
    } catch (error) {
        console.error('Error in getAllAdmins:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { uploadAssignment, getAllAdmins };
