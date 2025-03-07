const axios = require('axios');
const crypto = require('crypto');

class BinanceService {
    constructor() {
        this.apiKeys = {
            MILTON: { apiKey: 'EfBN9mFWAxk7CwsZzu37sXIGXyIQnyLVrAs3aqZOLAa3NumayunaGRQIJ6fi4U2r', secretKey: 'NbdiovuQxwgzwANxgZC669Jke5MZJUH3hyLT6BD8iWYz91EVK6e9adOY2Wq4t6nK' },
            CESAR: { apiKey: 'Ho474mufN8vTwvrZLjj8DdZHxa88JYlCrcPHp1r7UAhwc197So9vmUG9tRhM3XNr', secretKey: 'Ns41sTlvAM3nUzD0qMPE4PW57omuSxOPKdcngudgqVPphExjJC3tWX8kcxwibXDz' },
            MARCEL: { apiKey: 'vtNXEFCDEYxWpGGipXG210zzq5i2FnJAqmK5LJtRGiq5NRMCJqCQEOcR85SAunUP', secretKey: 'J9eIUXMxwFggHvU2HHp2EiWfNaXGvShSx5UihepHmW1gIjIBe3waZC3JvMUPBfga' }
        };
        this.paymentsApiUrl = 'https://api.binance.com/sapi/v1/pay/transactions';
        this.p2pOrdersApiUrl = 'https://api.binance.com/sapi/v1/c2c/orderMatch/listUserOrderHistory';
        this.futuresPositionHistoryUrl = 'https://fapi.binance.com/fapi/v1/positionRisk';
        this.futuresTradeHistoryUrl = 'https://fapi.binance.com/fapi/v1/userTrades';
        this.futuresTransactionHistoryUrl = 'https://fapi.binance.com/fapi/v1/allOrders';
    }

    getApiCredentials(account) {
        return this.apiKeys[account.toUpperCase()] || null;
    }

    async getServerTime() {
        const response = await axios.get('https://api.binance.com/api/v3/time');
        return response.data.serverTime;
    }

    createSignature(secretKey, query) {
        return crypto.createHmac('sha256', secretKey).update(query).digest('hex');
    }

    async sendBinanceRequest(url, apiKey) {
        try {
            const config = {
                headers: { 'X-MBX-APIKEY': apiKey }
            };
            return await axios.get(url, config);
        } catch (error) {
            console.error('Error sending Binance request:', error.message);
            throw error;
        }
    }

    async getPaymentHistory(account) {
        const credentials = this.getApiCredentials(account);
        if (!credentials) {
            return JSON.stringify({ error: "Cuenta no válida." });
        }

        const timestamp = await this.getServerTime();
        const query = `timestamp=${timestamp}&recvWindow=60000`;
        const signature = this.createSignature(credentials.secretKey, query);
        const url = `${this.paymentsApiUrl}?${query}&signature=${signature}`;

        try {
            const response = await this.sendBinanceRequest(url, credentials.apiKey);
            return response.data;
        } catch (error) {
            return JSON.stringify({ error: "Error interno: " + error.message });
        }
    }

    async getP2POrders(account) {
        const credentials = this.getApiCredentials(account);
        if (!credentials) {
            return JSON.stringify({ error: "Cuenta no válida." });
        }

        const timestamp = await this.getServerTime();
        const query = `tradeType=SELL&timestamp=${timestamp}&recvWindow=60000&page=1&rows=50`;
        const signature = this.createSignature(credentials.secretKey, query);
        const url = `${this.p2pOrdersApiUrl}?${query}&signature=${signature}`;

        try {
            const response = await this.sendBinanceRequest(url, credentials.apiKey);
            return response.data;
        } catch (error) {
            return JSON.stringify({ error: "Error interno: " + error.message });
        }
    }

    async getFuturesPositionHistory(account) {
        const credentials = this.getApiCredentials(account);
        if (!credentials) {
            return JSON.stringify({ error: "Cuenta no válida." });
        }
    
        const timestamp = await this.getServerTime();
        const query = `timestamp=${timestamp}&recvWindow=5000`;
        const signature = this.createSignature(credentials.secretKey, query);
        const url = `${this.futuresPositionHistoryUrl}?${query}&signature=${signature}`;
    
        try {
            const response = await this.sendBinanceRequest(url, credentials.apiKey);
            return response.data;
        } catch (error) {
            return JSON.stringify({ error: "Error interno: " + error.message });
        }
    }
    
    async getFuturesTradeHistory(account) {
        const credentials = this.getApiCredentials(account);
        if (!credentials) {
            return JSON.stringify({ error: "Cuenta no válida." });
        }
    
        const timestamp = await this.getServerTime();
        const query = `timestamp=${timestamp}&recvWindow=5000`;
        const signature = this.createSignature(credentials.secretKey, query);
        const url = `${this.futuresTradeHistoryUrl}?${query}&signature=${signature}`;
    
        try {
            const response = await this.sendBinanceRequest(url, credentials.apiKey);
            return response.data;
        } catch (error) {
            return JSON.stringify({ error: "Error interno: " + error.message });
        }
    }
    
    async getFuturesTransactionHistory(account) {
        const credentials = this.getApiCredentials(account);
        if (!credentials) {
            return JSON.stringify({ error: "Cuenta no válida." });
        }
    
        const timestamp = await this.getServerTime();
        const query = `timestamp=${timestamp}&recvWindow=5000`;
        const signature = this.createSignature(credentials.secretKey, query);
        const url = `${this.futuresTransactionHistoryUrl}?${query}&signature=${signature}`;
    
        try {
            const response = await this.sendBinanceRequest(url, credentials.apiKey);
            return response.data;
        } catch (error) {
            return JSON.stringify({ error: "Error interno: " + error.message });
        }
    }
    

    // Puedes implementar los métodos para futuros trades y transacciones aquí siguiendo un patrón similar
}

module.exports = new BinanceService();
