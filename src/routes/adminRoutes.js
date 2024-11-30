const express = require('express');
const router = express.Router();
const { getAssignments, acceptAssignment, rejectAssignment } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

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

module.exports = router;
