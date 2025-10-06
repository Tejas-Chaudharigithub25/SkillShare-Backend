// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { sendNotification } = require("./notificationController");
const Message = require("../models/Message");

// const fs = require("fs");
// const { exists } = require("../models/User.model");
// const { json } = require("stream/consumers");


require('dotenv').config();

const addMessage = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { senderId, receiverId, content, messageType, readStatus } = req.body;

        const msg = new Message({ senderId, receiverId, content, messageType, readStatus });
        const savedMessage = await msg.save();

        // Emit the message using Socket.IO
        req.io.to(receiverId).emit('newMessage', savedMessage);
        
        await sendNotification(receiverId, {
            title: "📩 New Message",
            body: content,
            icon: "/icon.png",
        });

        res.status(200).json({ msg: "Message sent", message: savedMessage });

    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

const fetchMessage = async (req, res) => {
    const { senderId, receiverId } = req.params;
    console.log(senderId, ' ', receiverId);

    if (!senderId || !receiverId)  return res.status(400).json({ msg: "Both senderId and receiverId are required." });

    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Oldest to latest

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

const updateMessage = async (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ msg: "No Token Provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const { messageId, content } = req.body;

        const message = await Message.findById(messageId);
        if (!message) res.status(403).json({ msg: "Message not found" });

        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ msg: "You can only update your own messages" });
        }

        // Update message content
        message.content = content;
        message.updatedAt = Date.now();
        await message.save();

        // Optional: Emit real-time event
        // Emit update to receiver in real-time
        req.io.to(message.receiverId.toString()).emit("messageUpdated", {
            messageId: message._id,
            content: message.content,
            updatedAt: message.updatedAt,
        });

        res.status(200).json({ msg: "Message updated", message });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
}

const deleteMessage = async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ msg: "Message not found" });

        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ msg: "You can only delete your own messages" });
        }

        await message.deleteOne();

        // Optional: Emit to receiver in real time
        req.io.to(message.receiverId.toString()).emit("messageDeleted", { messageId: message._id });

        res.status(200).json({ msg: "Message deleted", messageId: message._id });

    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

module.exports = { addMessage, fetchMessage, updateMessage, deleteMessage };