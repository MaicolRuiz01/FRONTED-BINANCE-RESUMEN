let allOrders = [];
let currentPage = 1;
const ordersPerPage = 10;

// 🔥 CONFIGURACIÓN: Múltiples API Keys
const apiKeys = {
    "MILTON": { 
        key: "EfBN9mFWAxk7CwsZzu37sXIGXyIQnyLVrAs3aqZOLAa3NumayunaGRQIJ6fi4U2r",
        secret: "NbdiovuQxwgzwANxgZC669Jke5MZJUH3hyLT6BD8iWYz91EVK6e9adOY2Wq4t6nK"
    },
    "CESAR": { 
        key: "Ho474mufN8vTwvrZLjj8DdZHxa88JYlCrcPHp1r7UAhwc197So9vmUG9tRhM3XNr",
        secret: "Ns41sTlvAM3nUzD0qMPE4PW57omuSxOPKdcngudgqVPphExjJC3tWX8kcxwibXDz"
    },
    "MARCEL": { 
        key: "vtNXEFCDEYxWpGGipXG210zzq5i2FnJAqmK5LJtRGiq5NRMCJqCQEOcR85SAunUP",
        secret: "J9eIUXMxwFggHvU2HHp2EiWfNaXGvShSx5UihepHmW1gIjIBe3waZC3JvMUPBfga"
    }
};
const binanceUrl = "https://api.binance.com";

async function fetchP2POrders(account) {
    if (!apiKeys[account]) {
        alert("Cuenta no válida");
        return;
    }

    const API_KEY = apiKeys[account].key;
    const SECRET_KEY = apiKeys[account].secret;

    try {
        const timestamp = Date.now();
        const queryString = `tradeType=SELL&timestamp=${timestamp}&recvWindow=60000`;
        const signature = CryptoJS.HmacSHA256(queryString, SECRET_KEY).toString(CryptoJS.enc.Hex);
        const url = `${binanceUrl}/sapi/v1/c2c/orderMatch/listUserOrderHistory?${queryString}&signature=${signature}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        });

        const data = await response.json();
        console.log(`Órdenes P2P (${account}):`, data);

        if (data.error) {
            alert(`Error en ${account}: ` + data.error);
            return;
        }

        if (!data.data || !Array.isArray(data.data)) {
            console.error("Formato inesperado:", data);
            alert(`No se encontraron datos válidos para ${account}.`);
            return;
        }

        allOrders = data.data;
        filterOrders(); // Aplicar filtro de fechas
    } catch (error) {
        console.error(`Error al cargar órdenes P2P (${account}):`, error);
        alert(`No se pudo cargar las órdenes P2P (${account}).`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    fetchP2POrders(account);
});
