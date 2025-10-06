// const Notification = require("../models/Notification");
// const Message = require("../models/Message");

// // Create Notification when message is received
// const createMessageNotification = async (req, res) => {
//     try {
//         const { senderId, receiverId, messageId } = req.body;
//         const message = await Message.findById(messageId);
//         if (!message) {
//             return res.status(404).json({ msg: "Message not found" });
//         }

//         const notification = new Notification({
//             userId: receiverId,
//             type: "Message",
//             message: `New message from ${senderId}: ${message.content}`,
//             isRead: false,
//         });

//         await notification.save();

//         // Emit socket event to receiver (real-time)
//         req.io.to(receiverId.toString()).emit("newNotification", notification);

//         res.status(201).json({ msg: "Notification created", notification });
//     } catch (err) {
//         res.status(500).json({ msg: "Server error", error: err.message });
//     }
// };

// // Fetch all notifications for a user
// const getNotifications = async (req, res) => {
//     try {
//         const userId = req.user.id; // from JWT middleware
//         const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
//         res.status(200).json(notifications);
//     } catch (err) {
//         res.status(500).json({ msg: "Server error", error: err.message });
//     }
// };

// // Mark notification as read
// const markAsRead = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const notification = await Notification.findByIdAndUpdate(
//             id,
//             { isRead: true },
//             { new: true }
//         );
//         res.status(200).json(notification);
//     } catch (err) {
//         res.status(500).json({ msg: "Server error", error: err.message });
//     }
// };

// export { createMessageNotification, getNotifications, markAsRead }

const Notification = require("../models/Notification");
const webpush = require("../config/webPush");

// Save subscription from frontend
const saveSubscription = async (req, res) => {
    try {
        const { subscription, userId } = req.body;
        await Notification.create({
            userId,
            type: "Message",
            message: "Push subscription saved",
        });
        // Store subscription in DB (better: separate collection)
        req.app.locals.subscriptions = req.app.locals.subscriptions || {};
        req.app.locals.subscriptions[userId] = subscription;
        res.status(201).json({ msg: "Subscription saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send push notification
const sendNotification = async (userId, payload) => {
    try {
        // const subscription = req.app.locals.subscriptions[userId];
        const subscriptions = global.subscriptions || {};
        const subscription = subscriptions[userId];

        if (subscription) {
            await webpush.sendNotification(subscription, JSON.stringify(payload));
        }
    } catch (err) {
        console.error("Push error:", err);
    }
};
module.exports = { saveSubscription, sendNotification }