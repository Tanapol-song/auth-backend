const express = require("express");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/send-otp',authController.sendOTP);
router.post('/reset-password',authController.resetPassword);

module.exports = router;