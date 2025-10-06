const Skill = require("../models/Skill.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Admin + User API (Add skills)
const addSkills = async (req, res) => {
    // const { name, email, password, bio, profilePicture, skillOffered, skillsLearning, accountType } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    const { skillName, category, popularity } = req.body;
    try {
        let skillMatch = await Skill.findOne({ skillName });
        if (skillMatch) {
            return res.status(400).json({ msg: `This Skill already exists in ${skillMatch.category}` });
        }
        // Create a new Skill
        skillMatch = new Skill({
            skillName,
            category,
            popularity
        });
        await skillMatch.save();
        res.status(200).json({ msg: "Skills Added." });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Admin API (Update Skills)
const updateSkills = async (req, res) => {
    // const { name, email, password, bio, profilePicture, skillOffered, skillsLearning, accountType } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    const { _id, skillName, category, popularity } = req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET);

        let skillMatch = await Skill.findOne({ _id });
        if (!skillMatch) {
            return res.status(400).json({ msg: `Skill Not Match with Databse.` });
        }
        // Create a new Skill
        await Skill.findOneAndUpdate({ _id }, { skillName, category, popularity });
        // await skillMatch.save();
        res.status(200).json({ msg: "Skills Updated." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
};

// Admin API (Delete Skills)
const deleteSkills = async (req, res) => {
    // const { name, email, password, bio, profilePicture, skillOffered, skillsLearning, accountType } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    const { _id } = req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET);

        let skillMatch = await Skill.findOne({ _id });
        if (!skillMatch) {
            return res.status(400).json({ msg: `Skill Not exists.` });
        }
        // Create a new Skill
        await Skill.findByIdAndDelete({ _id });
        // await skillMatch.save();
        res.status(200).json({ msg: "Skills Deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
};

// Fetch Skills
const fetchSkills = async (req, res) => {
    // const { name, email, password, bio, profilePicture, skillOffered, skillsLearning, accountType } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied Please Relogin.' });
    }
    const { _id } = req.body;
    try {
        jwt.verify(token, process.env.JWT_SECRET);

        let skillMatch = await Skill.find();
        if (!skillMatch) {
            return res.status(400).json({ msg: `Skill Not exists.` });
        }
        // Create a new Skill

        res.status(200).json({ msg: "Skills Fetch.", data: skillMatch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
};

// All free
const fetchAllSkill = async (req,res) => {
    try {
        let skillMatch = await Skill.find();
        if (!skillMatch) {
            return res.status(400).json({ msg: `Skill Not exists.` });
        }
        res.status(200).json({ msg: "Skills Fetch.", data: skillMatch });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error or Token is Unauthorized." });
    }
};


module.exports = { addSkills, updateSkills, deleteSkills, fetchSkills ,fetchAllSkill};