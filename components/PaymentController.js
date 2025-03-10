const express = require('express');
const router = express.Router();
const cors = require('cors'); // Asegúrate de requerir CORS
const binanceService = require('../service/binanceService');

// Aplicar CORS a todas las rutas del router
router.use(cors({
    origin: 'http://127.0.0.1:5501' // Ajusta esto según sea necesario
}));

router.get('/', async (req, res) => {
    try {
        const account = req.query.account;
        const result = await binanceService.getPaymentHistory(account);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;