const express = require('express');
const router = express.Router();
const {addSkills, updateSkills, deleteSkills, fetchSkills, fetchAllSkill} = require('../controllers/skillController');
const { validateRegister, validateLogin } = require("../middleware/userMiddle");

// Skill route for admin
// router.post('/register', validateRegister , registerUser );
// router.post('/login', validateLogin , loginUser );
router.post('/addSkill', addSkills );
router.put('/updateSkill', updateSkills );
router.delete('/deleteSkill', deleteSkills );
router.get('/fetchSkill', fetchSkills );
router.get('/fetchAllSkill', fetchAllSkill ); 

module.exports = router;