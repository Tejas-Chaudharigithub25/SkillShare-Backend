const express = require("express");
const router = express.Router();
const { saveSubscription, sendNotification } = require("../controllers/notificationController");
// const auth = require("../middleware/auth"); // JWT middleware

// ✅ Save push subscription (from frontend)
router.post("/subscribe", 
    // auth,
     saveSubscription);

// ✅ Trigger push notification manually (for testing in Postman)
router.post("/send/:userId", 
    // auth,
     async (req, res) => {
    try {
        const { payload } = req.body;
        const { userId } = req.params;

        await sendNotification(userId, payload);
        res.status(200).json({ msg: "Notification sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
