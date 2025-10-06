const express = require('express');
const router = express.Router();
const { getUser, registerUser, connectUser, loginUser, upgradeUser, getUserByID } = require('../controllers/userConntroller');
const { validateRegister, validateLogin } = require("../middleware/userMiddle");

// User route
router.get('/getUser', getUser);
router.get('/getUserByID/:id', getUserByID);
// router.post('/register', validateRegister , registerUser );
router.post('/login', validateLogin, loginUser);
router.post("/follow/:targetId", connectUser);
router.put('/upgradeUser', upgradeUser );

module.exports = router;