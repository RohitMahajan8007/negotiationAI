const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Administrator/Desktop/BACKEND-COHORT/AI Task/backend/.env' });

const leaderboardSchema = new mongoose.Schema({
    username: String,
    finalPrice: Number,
    rounds: Number,
    totalDeals: Number,
    timestamp: Date
}, { strict: false });
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- LEADERBOARD ---');
    const data = await Leaderboard.find({});
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}
check();
