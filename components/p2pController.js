const express = require('express');
const router = express.Router();
const cors = require('cors'); // Asegúrate de requerir CORS
const binanceService = require('../service/binanceService');

const allowedOrigins = [
    'http://127.0.0.1:5501', // Local
    'https://maicolruiz01.github.io', // GitHub Pages
    'https://fronted-binance-resumen-production.up.railway.app', // Railway
];

router.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
}));


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
