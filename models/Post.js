const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
    },
    image: {
        type: String,
        validate: {
            validator: function (v) {
                return /\.(jpg|jpeg|png|gif|bmp|webp|mp4|mov|avi)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image or video file!`
        }
    },

    postType: {
        type: String,
        enum: ["Free", "Paid"],
    },
    price: {
        type: Number,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
    }],
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
PostSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post', PostSchema);