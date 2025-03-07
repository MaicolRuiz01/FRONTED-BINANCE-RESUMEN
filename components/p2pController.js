const express = require('express');
const router = express.Router();
const binanceService = require('../service/binanceService');

router.get('/orders', async (req, res) => {
    try {
        const account = req.query.account;
        const result = await binanceService.getP2POrders(account);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
