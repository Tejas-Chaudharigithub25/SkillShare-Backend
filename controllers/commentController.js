const Comment = require("../models/Comment.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// User API (Add Comments)
const addComments = async (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    try {
        const { onUser, onPost, comments } = req.body;
        // Create a new Skill
        const saveComment = new Comment({
            userId: onUser,
            post: onPost,
            content: comments
        });
        await saveComment.save();
        res.status(200).json({ msg: "Comments Added." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Comments error" });
    }
};

// Get Comments
const fetchComments = async (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    
    try {
        const { onPost_id } = req.params;
        console.log(typeof onPost_id);
        
        // Create a new Skill
        const getComments = await Comment.find({ post:  onPost_id });

        res.status(200).json({ getComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Comments error" });
    }
};

// Update Comments
const updateComments = async (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    try {
        const { commentId, content } = req.body;
        // Create a new Skill
        const update = await Comment.findByIdAndUpdate({_id:commentId }, { content, updatedAt: Date.now() })
        if (!update) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }
        res.status(200).json({ msg: "Comments Updated." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Comments error" });
    }
};

// User API (Delete Comments)
const deleteComments = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    const {commentId} = req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        
        let CommentMatch = await Comment.findByIdAndDelete({_id:commentId});
        if (!CommentMatch) {
            return res.status(400).json({ msg: `Comment Not exists.` });
        }
        res.status(200).json({ msg: "Comment Deleted."});
    } catch (error) {
        res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
};

module.exports = { addComments, fetchComments, updateComments, deleteComments};
