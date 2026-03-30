const negotiationService = require('../services/negotiationService');
const storageService = require('../services/storageService');
const Leaderboard = require('../models/Leaderboard');
const Negotiation = require('../models/Negotiation');

const startNegotiation = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        const existing = await Negotiation.findOne({ userId, productId, status: 'negotiating' }).sort({ createdAt: -1 });

        if (existing) {
            storageService.saveNegotiation(existing.toObject());
            return res.status(200).json({ success: true, data: existing });
        }

        const neg = await negotiationService.startNewNegotiation(userId, productId || 'watch-01');
        await Negotiation.create(neg);
        res.status(201).json({ success: true, data: neg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const sendOffer = async (req, res) => {
    try {
        const { userId, message, offer } = req.body;
        const result = await negotiationService.processNegotiation(userId, message, offer);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const rankings = await Leaderboard.aggregate([
            {
                $group: {
                    _id: { $toLower: { $trim: { input: "$username" } } },
                    username: { $first: "$username" },
                    fullName: { $first: "$fullName" },
                    totalDeals: { $max: "$totalDeals" },
                    finalPrice: { $min: "$finalPrice" },
                    avgRounds: { $avg: "$rounds" }
                }
            },
            { $sort: { totalDeals: -1, finalPrice: 1 } },
            { $limit: 10 },
            {
                $project: {
                    username: 1,
                    fullName: { $ifNull: ["$fullName", "$username"] },
                    totalDeals: { $ifNull: ["$totalDeals", 1] },
                    avgRounds: { $round: [{ $ifNull: ["$avgRounds", 4] }, 1] },
                    _id: 0
                }
            }
        ]);
        res.status(200).json({ success: true, data: rankings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        // Absolute fix: Case-insensitive search for the user mission logs
        const history = await Negotiation.find({ 
            userId: { $regex: new RegExp(`^${userId}$`, 'i') } 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const resetNegotiation = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        // Use case-insensitive targeting for the nuclear wipe
        const targetUserId = { $regex: new RegExp(`^${userId}$`, 'i') };
        
        // 1. Delete the Negotiation Records
        await Negotiation.deleteMany({ userId: targetUserId, productId });
        storageService.deleteNegotiation(userId);

        // 2. Recalculate Leaderboard Stats for this user
        const totalWins = await Negotiation.countDocuments({ userId: targetUserId, status: 'accepted' });
        
        if (totalWins === 0) {
            // Delete from leaderboard if no wins left
            await Leaderboard.deleteOne({ username: targetUserId });
        } else {
            // Update leaderboard with new win count
            await Leaderboard.updateOne(
                { username: targetUserId },
                { totalDeals: totalWins }
            );
        }

        res.status(200).json({ success: true, message: 'Log and Data wiped permanently' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const completePurchase = async (req, res) => {
    try {
        const { userId, productId, amount } = req.body;
        const User = require('../models/User');
        const Negotiation = require('../models/Negotiation');
        const Leaderboard = require('../models/Leaderboard');

        // Force case-insensitive deduction
        const targetUserId = { $regex: new RegExp(`^${userId}$`, 'i') };
        
        // 1. Deduct Credits
        const updatedUser = await User.findOneAndUpdate(
            { username: targetUserId },
            { $inc: { credits: -Number(amount), successfulDeals: 1 } },
            { new: true }
        );

        // 2. Mark as Paid and PERSIST THE FINAL PRICE in the logs
        await Negotiation.updateMany(
            { userId: targetUserId, productId }, 
            { status: 'accepted', currentPrice: Number(amount) }
        );

        // 3. Update Leaderboard (Deduplication Logic)
        const totalWins = await Negotiation.countDocuments({ userId: targetUserId, status: 'accepted' });
        await Leaderboard.findOneAndUpdate(
            { username: { $regex: new RegExp(`^${userId}$`, 'i') } },
            { 
              $set: { 
                username: userId, 
                fullName: updatedUser?.fullName || userId,
                finalPrice: amount, 
                totalDeals: totalWins, 
                timestamp: new Date() 
              } 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, credits: updatedUser.credits });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createPaymentOrder = async (req, res) => {
    try {
        const Razorpay = require('razorpay');
        const rzp = new Razorpay({
            key_id: "rzp_test_vKqHURlUnAmsPq",
            key_secret: "SgG6WqL8Y7H0Fj3Y6U0X3R1R" // Placeholder secret
        });
        const { amount } = req.body;
        const options = {
            amount: Number(amount) * 100, // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await rzp.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { startNegotiation, sendOffer, getLeaderboard, getHistory, resetNegotiation, completePurchase, createPaymentOrder };
