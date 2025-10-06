const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    payerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required:true,
    },
    paymentType: {
        type: String,
        enum: ["Skill Session", "Post"],
        required:true,
    },
    transactionId: {
        type: String,
        required:true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        required:true,
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
PaymentSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Payment', PaymentSchema);