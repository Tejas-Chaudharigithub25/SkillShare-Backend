const express = require('express');
const router = express.Router();
// const upload = require('../middleware/postMiddle'); // or define here
const { addMessage, updateMessage, deleteMessage, fetchMessage } = require('../controllers/messageController');

router.post('/addMessage', addMessage);
router.get('/fetchMessage/:senderId/:receiverId', fetchMessage);
router.put('/updateMessage', updateMessage);
router.delete('/deleteMessage/:messageId', deleteMessage);

module.exports = router;
