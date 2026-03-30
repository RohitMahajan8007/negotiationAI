const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/topup', authController.topUpCredits);
router.post('/update', authController.updateProfile);
router.get('/profile/:username', authController.getProfile);

module.exports = router;
