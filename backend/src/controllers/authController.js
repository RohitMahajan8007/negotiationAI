const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const storageService = require('../services/storageService');

const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        
        let existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, fullName: fullName || username, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.status(201).json({ token, user: { username: user.username, fullName: user.fullName, email: user.email, credits: user.credits } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({ success: true, token, user: { username: user.username, fullName: user.fullName || user.username, email: user.email, credits: user.credits } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user: { username: user.username, fullName: user.fullName || user.username, email: user.email, credits: user.credits } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const topUpCredits = async (req, res) => {
    try {
        const { username, amount } = req.body;
        const user = await User.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${username}$`, 'i') } },
            { $inc: { credits: Number(amount) } },
            { new: true }
        );
        res.json({ success: true, user: { username: user.username, fullName: user.fullName || user.username, email: user.email, credits: user.credits } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { currentUsername, username, fullName, email, password } = req.body;
        const updateData = { fullName, email };
        
        if (username) updateData.username = username;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${currentUsername}$`, 'i') } },
            { $set: updateData },
            { new: true }
        );
        res.json({ success: true, user: { username: user.username, fullName: user.fullName || user.username, email: user.email, credits: user.credits } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, topUpCredits, updateProfile };
