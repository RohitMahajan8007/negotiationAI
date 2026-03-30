const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: { type: String, default: '' },
    finalPrice: { type: Number, required: true },
    rounds: { type: Number, default: 1 },
    totalDeals: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
});

// Create index for faster lookups during updates
leaderboardSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
