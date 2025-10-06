const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required and should be character"],
    },
    bio: {
        type: String,
        maxlength: [300, "Bio cannot exceed 300 characters"],
    },
    profilePicture: {
        type: String,
        default: "https://example.com/default-profile.png", // Default profile image
    },
    skillOffered: {
        type: [String],
        default: [],
    },
    skillsLearning: {
        type: [String],
        default: [],
    },
    followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    accountType: {
            type: String,
            enum: ["Free", "Premium", "Learner"],
            default: "Free",
        },
    role: {
        type: String,
        enum: ["Admin", "User"],
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
UserSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', UserSchema);