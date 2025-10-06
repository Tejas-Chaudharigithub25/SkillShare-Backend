const mongoose = require("mongoose");  // ✅ Required for ObjectId validation
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
    // const { name, email, password, bio, profilePicture, skillOffered, skillsLearning, accountType } = req.body;
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: "This User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            name,
            email,
            password: hashedPassword, // Store hashed password
            // bio,
            // profilePicture,
            // skillOffered,
            // skillsLearning,
            // accountType
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ msg: "User registered successfully", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials or May User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ msg: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};


// upgrade user Bio status
const upgradeUser = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        let userc = await User.findById(userId);
        if (!userc) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { bio, name
            // profilePicture, skillOffered, skillsLearning, accountType 
        } = req.body;

        // Initialize variables to store the new or old values
        let newBio = (bio != null && bio != '') ? bio : userc.bio;
        let newName = (name != null && name != '') ? name : userc.name;

        let user = await User.findByIdAndUpdate({ _id: userId }, { bio, name });

        if (!user) res.status(200).json({ msg: 'Something went wrong' });

        res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Invalid or expired token' });
    }
};

// get user All
const getUser = async (req, res) => {
    try {

        let data = await User.find();
        if (!data) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ data, msg: 'Profile get successfully' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Invalid or expired token' });
    }
};

// find user by id
const getUserByID = async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const { id } = req.params;

    try {
        let data = await User.findById(id);

        if (!data) {
            return res.status(404).json({ msg: "User not found" });
        }

        // If token exists, validate it
        if (token) {
            try {
                // Verify token (if you use JWT)
                jwt.verify(token, process.env.JWT_SECRET);
                return res.status(200).json({ data, msg: "Profile fetched (with login)" });
            } catch (err) {
                return res.status(401).json({ msg: "Invalid or expired token" });
            }
        }

        // If no token, still return data
        return res.status(200).json({ data, msg: "Profile fetched (without login)" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// follow
const connectUser = async (req, res) => {
    try {
        const loggedInUserId = req.body.userId;
        const targetUserId = req.params.targetId;

        if (!mongoose.Types.ObjectId.isValid(loggedInUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (loggedInUserId === targetUserId) {
            return res.status(400).json({ message: "Cannot connect yourself" });
        }

        const loggedInUser = await User.findById(loggedInUserId);
        const targetUser = await User.findById(targetUserId);

        if (!loggedInUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let action = "";
        if (targetUser.following.includes(loggedInUserId)) {
            // Disconnect / Unfollow
            targetUser.following.pull(loggedInUserId); // remove logged-in user from target's following
            loggedInUser.followers.pull(targetUserId); // remove target from logged-in user's followers
            action = "disconnected";
        } else {
            // Connect / Follow
            targetUser.following.push(loggedInUserId); // add logged-in user to target's following
            loggedInUser.followers.push(targetUserId); // add target to logged-in user's followers
            action = "connected";
        }

        await targetUser.save();
        await loggedInUser.save();

        return res.json({ success: true, message: `User ${action} successfully` });
    } catch (error) {
        console.error("Connect API error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = { getUser, registerUser, loginUser, upgradeUser, getUserByID, connectUser };