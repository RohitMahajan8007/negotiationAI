const express = require('express');
const router = express.Router();
const { startNegotiation, sendOffer, resetNegotiation, getLeaderboard, getHistory, completePurchase, createPaymentOrder } = require('../controllers/negotiationController');

router.post('/start', startNegotiation);
router.post('/offer', sendOffer);
router.post('/reset', resetNegotiation);
router.post('/purchase', completePurchase);
router.post('/create-order', createPaymentOrder);
router.get('/leaderboard', getLeaderboard);
router.get('/history/:userId', getHistory);

module.exports = router;
