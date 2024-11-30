const express = require('express');
const router = express.Router();
const { uploadAssignment, getAllAdmins } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');
const { check } = require('express-validator');

// @route   POST /api/user/upload
// @desc    Upload an assignment
// @access  Private (User)
router.post(
    '/upload',
    protect,
    role(['User']),
    [
        check('task', 'Task description is required').not().isEmpty(),
        check('adminUsername', 'Admin username is required').not().isEmpty(),
    ],
    uploadAssignment
);

// @route   GET /api/user/admins
// @desc    Get all admins
// @access  Private (User)
router.get('/admins', protect, role(['User']), getAllAdmins);

module.exports = router;
