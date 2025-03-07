const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/binance-time', async (req, res) => {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/time');
        res.json({ time: response.data.serverTime });
    } catch (error) {
        res.status(500).json({ error: "Error: " + error.message });
    }
});

module.exports = router;
