const express = require('express');
const router = express.Router();
const upload = require('../middleware/postMiddle'); // or define here
const { addPost, deletePost, updatePost,getPost,getUserPost } = require('../controllers/postController');

router.get('/getPost', getPost);
router.get('/getUserPost', getUserPost);
router.post('/addPost', upload.single('image'), addPost);
router.delete('/deletePost',deletePost);
router.put('/updatePost', upload.single('image'), updatePost);
module.exports = router;
