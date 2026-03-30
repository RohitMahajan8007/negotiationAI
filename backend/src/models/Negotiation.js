const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productId: { type: String, default: 'cyber-watch-01' },
    status: { type: String, enum: ['negotiating', 'accepted', 'rejected'], default: 'negotiating' },
    initialPrice: { type: Number, default: 2000 },
    currentPrice: { type: Number, default: 2000 },
    history: [{
        sender: { type: String, enum: ['user', 'ai'], required: true },
        message: { type: String, required: true },
        offer: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Negotiation', negotiationSchema);
