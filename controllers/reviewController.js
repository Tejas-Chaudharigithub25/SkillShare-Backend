const Reviews = require("../models/Reviews");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const addReview = async (req, res) => {
const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied Please Relogin." });
    }

    try {
        const { reviewerId, reviewedUserId, rating, comment } = req.body;
        jwt.verify(token, process.env.JWT_SECRET);

        const review = new Reviews({
            reviewerId, reviewedUserId, rating, comment
        });

        await review.save();

        return res.status(200).json({ msg: 'Thanks For Review.' });

    } catch (error) {
        return res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
}

// for recever
const fetchReview = async (req, res) => {

const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    try {
const { reviewedUserId } = req.params;

        const review = await Reviews.find({ reviewedUserId })
            .populate('reviewerId', 'name email') // populate reviewer info
            .populate('reviewedUserId', 'name email') // populate reviewed user info
            .sort({ createdAt: -1 });;

        return res.status(200).json({ msg: 'Receved Reviews', review });
    } catch (error) {
        return res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
}

// Update Review
const updateReview = async (req, res) => {
const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const { _id, rating, comment } = req.body;

        const review = await Reviews.findByIdAndUpdate(
            _id, { rating, comment, updatedAt: new Date() }, 
            { new: true }
        )
        .populate('reviewerId', 'name email')
        .populate('reviewedUserId', 'name email');

        if (!review) {
            return res.status(400).json({ msg: `Review Not Updated.` });
        }
        return res.status(200).json({ msg: "Review Updated.", review });
    } catch (error) {
        return res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
}

const deleteReview = async (req, res) => {
const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = req.body;
        const review = await Reviews.findByIdAndDelete({ _id });

        if (!review) {
            return res.status(400).json({ msg: `Review Not exists.` });
        }
        return res.status(200).json({ msg: "Review Deleted." });
    } catch (error) {
        return res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
}

module.exports = {addReview,fetchReview,updateReview,deleteReview};