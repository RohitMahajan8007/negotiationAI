const { GoogleGenerativeAI } = require('@google/generative-ai');
const storageService = require('./storageService');

class NegotiationService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (this.apiKey) {
            const genAI = new GoogleGenerativeAI(this.apiKey);
            this.model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
        }
        
        console.log("AI is connected (Cyber-Negotiation Subsystem Online)");
        
        this.products = {
            'watch-01': { name: 'Cyber-Watch 01', initial: 2000, target: 1800, min: 1400 },
            'drone-02': { name: 'Neo-Drone X', initial: 4500, target: 4100, min: 3800 },
            'suit-03': { name: 'Carbon-Body Armor', initial: 12000, target: 11000, min: 9500 },
            'jetpack-04': { name: 'Jetpack V3', initial: 25000, target: 23000, min: 20000 },
            'rig-05': { name: 'Holographic Rig', initial: 8000, target: 7500, min: 6500 }
        };

        this.fallbackMessages = [
            "Your logic is impressive, operative. I'll drop the price, but don't push your luck.",
            "I see you've done your market research. Fine, a revised offer is on the table.",
            "A fair argument, though my margins are thinning. Let's meet here.",
            "You negotiate like a veteran. I respect the grit. Adjusted price incoming.",
            "Database indicates a high demand, but I'll make an exception for an agent of your standing."
        ];
    }

    async startNewNegotiation(userId, productId) {
        const product = this.products[productId] || this.products['watch-01'];
        return {
            userId,
            productId,
            currentPrice: product.initial,
            status: 'negotiating',
            history: [],
            rounds: 0,
            createdAt: new Date()
        };
    }

    async processNegotiation(userId, userMessage, userOffer) {
        let neg = storageService.getNegotiation(userId);
        
        if (!neg) {
            try {
                const NegotiationModel = require('../models/Negotiation');
                const dbNeg = await NegotiationModel.findOne({ userId }).sort({ createdAt: -1 });
                if (dbNeg) {
                    neg = dbNeg.toObject();
                    storageService.saveNegotiation(neg);
                }
            } catch (e) {}
        }

        if (!neg) neg = await this.startNewNegotiation(userId, 'watch-01');

        const User = require('../models/User');
        // Critical: Case-insensitive user lookup for credits
        const userData = await User.findOne({ 
            username: { $regex: new RegExp(`^${userId}$`, 'i') } 
        });

        if (userData && userData.credits < userOffer) {
            neg.history.push({ 
                sender: 'ai', 
                message: "ALERT: Insufficient credits detected in your account. The Merchant will only accept bids you can actually pay for.", 
                offer: neg.currentPrice,
                timestamp: new Date() 
            });
            return { ...neg, currentCredits: userData.credits };
        }

        const product = this.products[neg.productId] || this.products['watch-01'];
        const MIN_PRICE = product.min;
        const TARGET_PROFIT = product.target;

        neg.history.push({ 
            sender: 'user', 
            message: userMessage, 
            offer: Number(userOffer),
            timestamp: new Date() 
        });

        const result = await this.getGeminiResponse(neg, product, userMessage, userOffer, MIN_PRICE, TARGET_PROFIT);

        neg.currentPrice = result.newOffer;
        neg.status = String(result.status || 'negotiating').toLowerCase();
        
        neg.history.push({ 
            sender: 'ai', 
            message: result.message, 
            offer: result.newOffer,
            timestamp: new Date() 
        });
        neg.rounds = Math.ceil(neg.history.length / 2);

        storageService.saveNegotiation(neg);

        let finalCredits = userData ? userData.credits : 10000;

        try {
            const NegotiationModel = require('../models/Negotiation');
            await NegotiationModel.findOneAndUpdate({ userId, productId: neg.productId }, neg, { upsert: true });

            if (neg.status === 'accepted') {
                const amount = Number(neg.currentPrice);
                // Nuclear forced update: Always attempt deduction on successful deal
                const updatedUser = await User.findOneAndUpdate(
                    { username: { $regex: new RegExp(`^${userId}$`, 'i') } }, 
                    { $inc: { credits: -amount } },
                    { new: true }
                );
                if (updatedUser) finalCredits = updatedUser.credits;

                const Leaderboard = require('../models/Leaderboard');
                const totalWins = await NegotiationModel.countDocuments({ 
                    userId: { $regex: new RegExp(`^${userId}$`, 'i') }, 
                    status: 'accepted' 
                });
                await Leaderboard.findOneAndUpdate(
                    { username: userId }, 
                    { username: userId, finalPrice: amount, rounds: neg.rounds, totalDeals: totalWins }, 
                    { upsert: true }
                );
            }
        } catch (e) {
            console.error('Logic Fail:', e);
        }

        return { ...neg, currentCredits: finalCredits };
    }

    async getGeminiResponse(neg, product, userMessage, userOffer, min, target) {
        if (!this.model) {
            // Mock System for No API Key scenarios
            const currentMerchantOffer = neg.currentPrice;
            let status = 'negotiating';
            let newOffer = currentMerchantOffer;

            if (userOffer >= min && neg.rounds > 1) {
                status = 'accepted';
                newOffer = userOffer;
            } else if (userOffer < min * 0.7) {
                status = 'rejected';
            } else {
                // Drop 5% of diff or fixed $100
                const diff = (currentMerchantOffer - min);
                const drop = Math.max(100, Math.floor(diff * 0.3));
                newOffer = Math.max(min, currentMerchantOffer - drop);
            }

            return {
                message: status === 'accepted' ? "Fine! You secured the asset. The deal is closed." : 
                         status === 'rejected' ? "You're wasting my time with these lowballs. Security, remove this 'merchant'!" :
                         `$${newOffer.toLocaleString()} is my best offer. Take it or keep dreaming.`,
                newOffer,
                status
            };
        }

        try {
            const genHistory = neg.history.slice(-6).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: `${h.message} (Bid: $${h.offer})` }]
            }));

            const systemPrompt = `Role: Cyber Merchant. Product: ${product.name}. 
            Initial: $${product.initial}. Min: $${min}. Target: $${target}.
            Tone: Sarcastic but smart.
            STRICT RULE 1: If user offer $${userOffer} is >= ${min} AND rounds > 2, you MUST set status to 'accepted'. Respond as JSON only.
            STRICT RULE 2 (INCREMENTAL): When dropping price, do it SLOWLY (e.g. 4500 -> 4400 -> 4300). DON'T jump to the minimum immediately.
            STRICT RULE 3 (STUBBORNNESS): Once you are near $${min} (within 5%), you MUST NOT drop the price further. Be stubborn. Say "This is my absolute bottom line."`;

            const chat = this.model.startChat({
                history: [
                    { role: "user", parts: [{ text: `Init: ${systemPrompt}` }] },
                    { role: "model", parts: [{ text: JSON.stringify({ message: "Merchant Mind ready.", newOffer: product.initial, status: "negotiating" }) }] },
                    ...genHistory.slice(0, -1)
                ]
            });

            const prompt = `User Message: "${userMessage}". User Offer: $${userOffer}. Current: $${neg.currentPrice}.`;
            const result = await chat.sendMessage(prompt);
            const responseText = result.response.text();

            try {
                const json = JSON.parse(responseText.trim());
                if (typeof json.newOffer !== 'number') json.newOffer = neg.currentPrice;
                if (json.newOffer < min && json.status !== 'accepted') json.newOffer = min;
                return json;
            } catch (err) {
                return this.fallbackInternalAi(neg, userMessage, userOffer, min, target);
            }
        } catch (err) {
            return this.fallbackInternalAi(neg, userMessage, userOffer, min, target);
        }
    }

    fallbackInternalAi(neg, userMessage, userOffer, min, target) {
        const lower = userMessage.toLowerCase();
        let sentiment = 0;
        if (lower.includes('please') || lower.includes('fair')) sentiment += 1;
        if (lower.includes('market') || lower.includes('cheap')) sentiment += 2;
        
        let status = 'negotiating';
        let newPrice = neg.currentPrice;

        if (userOffer >= min) {
            const drop = (neg.currentPrice - userOffer) * (0.1 + (sentiment * 0.05));
            newPrice = Math.max(min, neg.currentPrice - drop);
            if (userOffer >= (newPrice - 10) || neg.rounds >= 5) {
                status = 'accepted';
                newPrice = userOffer;
            }
        }

        return {
            message: this.fallbackMessages[Math.floor(Math.random() * this.fallbackMessages.length)],
            newOffer: Math.round(newPrice),
            status
        };
    }
}

module.exports = new NegotiationService();
