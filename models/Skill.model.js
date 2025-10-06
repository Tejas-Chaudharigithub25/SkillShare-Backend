const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
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
SkillSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Skill', SkillSchema);