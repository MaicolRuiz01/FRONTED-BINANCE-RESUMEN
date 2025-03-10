const express = require('express');
const router = express.Router();
const cors = require('cors');
const binanceService = require('../service/binanceService');

// Aplicar CORS a todas las rutas del router
router.use(cors({
    origin: 'http://127.0.0.1:5501' // Ajusta esto según sea necesario
}));


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
