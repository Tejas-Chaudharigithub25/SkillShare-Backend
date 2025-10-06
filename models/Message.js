const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ["Text", "Image", "Video"],
        required: true,
    },
    readStatus: {
        type: Boolean,
        required: true,
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
MessageSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Message', MessageSchema);