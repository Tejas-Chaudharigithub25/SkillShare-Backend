const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
},
    { timestamps: true }
);

// Update `updatedAt` before saving
ReviewSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);