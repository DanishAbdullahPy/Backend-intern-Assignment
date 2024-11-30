const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get Assignments Tagged to Admin
const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ admin: req.user._id })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Accept Assignment
const acceptAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if assignment is tagged to the admin
        if (assignment.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this assignment' });
        }

        // Update status
        assignment.status = 'Accepted';
        await assignment.save();

        res.json({ message: 'Assignment accepted', assignment });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Reject Assignment
const rejectAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if assignment is tagged to the admin
        if (assignment.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this assignment' });
        }

        // Update status
        assignment.status = 'Rejected';
        await assignment.save();

        res.json({ message: 'Assignment rejected', assignment });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAssignments, acceptAssignment, rejectAssignment };
