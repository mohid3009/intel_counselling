const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment.controller');

router.post('/create-cashfree-session', paymentCtrl.createCashfreeSession);

module.exports = router;
