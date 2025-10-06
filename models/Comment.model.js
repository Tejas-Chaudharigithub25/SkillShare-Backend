const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
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
CommentSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);