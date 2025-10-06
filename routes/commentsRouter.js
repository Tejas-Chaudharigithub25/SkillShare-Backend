const express = require('express');
const router = express.Router();
// const upload = require('../middleware/postMiddle'); // or define here
const { addComments, updateComments, deleteComments, fetchComments } = require('../controllers/commentController');

router.post('/addComments', addComments );
router.get('/fetchComments/:onPost_id', fetchComments );
router.put('/updateComments', updateComments );
router.delete('/deleteComments', deleteComments );
module.exports = router;
