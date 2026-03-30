const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/Administrator/Desktop/BACKEND-COHORT/AI Task/backend/.env' });

const UserSchema = new mongoose.Schema({
    username: String,
    credits: Number
});
const User = mongoose.model('User', UserSchema);

const NegSchema = new mongoose.Schema({
    userId: String,
    status: String,
    currentPrice: Number
});
const Neg = mongoose.model('Neg', NegSchema, 'negotiations');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- USERS ---');
    const users = await User.find({});
    console.log(JSON.stringify(users, null, 2));

    console.log('--- NEGOTIATIONS ---');
    const negs = await Neg.find({});
    console.log(JSON.stringify(negs, null, 2));
    
    process.exit(0);
}
check();
