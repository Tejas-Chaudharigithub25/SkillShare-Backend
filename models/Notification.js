const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ["Match Request", "Session Reminder", "Payment Alert", "Message"],
        message: String,
        isRead: Boolean,
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` before saving
NotificationSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Notification', NotificationSchema);