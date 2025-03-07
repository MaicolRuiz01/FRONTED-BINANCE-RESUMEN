// futuresController.js en la carpeta /controllers
const express = require('express');
const router = express.Router();
const binanceService = require('../service/binanceService');

router.get('/positionHistory', async (req, res) => {
    try {
        const account = req.query.account;
        const result = await binanceService.getFuturesPositionHistory(account);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tradeHistory', async (req, res) => {
    try {
        const account = req.query.account;
        const result = await binanceService.getFuturesTradeHistory(account);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/transactionHistory', async (req, res) => {
    try {
        const account = req.query.account;
        const result = await binanceService.getFuturesTransactionHistory(account);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
