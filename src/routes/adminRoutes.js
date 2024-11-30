const express = require('express');
const router = express.Router();
const { getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

// Middleware to log requests (for debugging)
router.use((req, res, next) => {
    console.log(`Admin Route Accessed: ${req.method} ${req.originalUrl}`);
    next();
});

// @route   GET /api/admin/assignments
// @desc    Get assignments tagged to admin
// @access  Private (Admin)
router.get('/assignments', protect, role(['Admin']), getAssignments);

// @route   POST /api/admin/assignments/:id/accept
// @desc    Accept an assignment
// @access  Private (Admin)
router.post('/assignments/:id/accept', protect, role(['Admin']), acceptAssignment);

// @route   POST /api/admin/assignments/:id/reject
// @desc    Reject an assignment
// @access  Private (Admin)
router.post('/assignments/:id/reject', protect, role(['Admin']), rejectAssignment);

// Test Route
router.post('/assignments/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
});

module.exports = router;
