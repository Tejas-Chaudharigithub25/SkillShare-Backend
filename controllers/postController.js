const Post = require("../models/Post");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

require('dotenv').config();

// Helper function to safely delete files
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error deleting file at ${filePath}:`, err);
        } else if (err && err.code === 'ENOENT') {
            // File not found, which is an acceptable case
            console.log(`File not found, likely already deleted: ${filePath}`);
        } else {
            console.log(`Successfully deleted file: ${filePath}`);
        }
    });
};

// User API (get all Post)
const getPost = async (req, res) => {
    try {
        const posts = await Post.find().populate("userId");
        console.log("All posts fetched successfully.");
        res.status(200).json({ data: posts, msg: "Getting posts." });
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

// User API (get user Post)
const getUserPost = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please re-login.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const posts = await Post.find({ userId: decoded.userId }).populate("userId");

        if (posts.length === 0) {
            return res.status(404).json({ msg: 'No posts found for this user.' });
        }

        res.status(200).json({ data: posts, msg: "Getting user's posts." });
    } catch (error) {
        console.error('Error verifying token or fetching user posts:', error);
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Token is invalid or expired. Please re-login.' });
        }
        res.status(500).json({ msg: "Server error" });
    }
};

// User API (Add Post)
const addPost = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please re-login.' });
    }

    const { content, postType, price } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newPost = new Post({
            userId: decoded.userId,
            content,
            image: req.file ? req.file.filename : null,
            postType,
            price
        });
        await newPost.save();
        res.status(200).json({ msg: "Post uploaded successfully." });
    } catch (error) {
        console.error("Error adding new post:", error);
        // Clean up the uploaded file if the save fails
        if (req.file) {
            deleteFile(path.join(__dirname, "../uploads/posts/", req.file.filename));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Token is invalid or expired. Please re-login.' });
        }
        res.status(500).json({ msg: "Server error" });
    }
};

// User API (Update Post)
const updatePost = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please re-login.' });
    }

    const { _id, content, postType, price } = req.body;
    const newImageFilename = req.file ? req.file.filename : null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const postToUpdate = await Post.findOne({ _id, userId: decoded.userId });

        if (!postToUpdate) {
            if (newImageFilename) {
                deleteFile(path.join(__dirname, "../uploads/posts/", newImageFilename));
            }
            return res.status(404).json({ msg: 'Post not found or you do not have permission to update it.' });
        }

        // Prepare update object
        const updateFields = {
            content: content,
            postType: postType,
            price: price,
            likes: postToUpdate.likes ,     // ensure empty array if not exists
            comments: postToUpdate.comments  // ensure empty array if not exists
        };

        if (newImageFilename) {
            updateFields.image = newImageFilename || "1749288628306-photp.jpg";
        }

        // Handle image file replacement
        if (newImageFilename && postToUpdate.image) {
            const oldFilePath = path.join(__dirname, "../uploads/posts/", postToUpdate.image);
            deleteFile(oldFilePath);
        }

        // Update the post in the database
        await Post.updateOne({ _id }, { $set: updateFields });

        res.status(200).json({ msg: "Post updated successfully.", post: updateFields });
    } catch (error) {
        console.error("Error updating post:", error);
        // Clean up the new file if an error occurs after upload but before a successful DB update
        if (newImageFilename) {
            deleteFile(path.join(__dirname, "../uploads/posts/", newImageFilename));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Token is invalid or expired. Please re-login.' });
        }
        res.status(500).json({ msg: "Server error" });
    }
};


// User API (Delete Post)
const deletePost = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please re-login.' });
    }

    const { _id } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the post and ensure the user owns it
        const postToDelete = await Post.findOneAndDelete({ _id, userId: decoded.userId });

        if (!postToDelete) {
            return res.status(404).json({ msg: 'Post not found or you do not have permission to delete it.' });
        }
        
        // Delete the associated image file from the server
        if (postToDelete.image) {
            const filePath = path.join(__dirname, "../uploads/posts/", postToDelete.image);
            deleteFile(filePath);
        }

        res.status(200).json({ msg: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Token is invalid or expired. Please re-login.' });
        }
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { addPost, deletePost, updatePost, getPost, getUserPost };