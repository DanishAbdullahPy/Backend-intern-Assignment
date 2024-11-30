const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task: {
        type: String,
        required: [true, 'Please add a task description'],
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
