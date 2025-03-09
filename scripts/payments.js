document.addEventListener('DOMContentLoaded', function () {
    // Obtener el parámetro 'account' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    // Cargar el historial de pagos automáticamente con la cuenta seleccionada
    fetchPaymentHistory(account);
});

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

async function fetchPaymentHistory(account) {
    if (!apiKeys[account]) {
        alert("Cuenta no válida");
        return;
    }

    const API_KEY = apiKeys[account].key;
    const SECRET_KEY = apiKeys[account].secret;

    try {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}&recvWindow=60000`;

        // 🔐 Generar la firma HMAC SHA256
        const signature = CryptoJS.HmacSHA256(queryString, SECRET_KEY).toString(CryptoJS.enc.Hex);
        const url = `${binanceUrl}/sapi/v1/pay/transactions?${queryString}&signature=${signature}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": API_KEY
            }
        });

        const data = await response.json();
        console.log(`Historial de pagos (${account}):`, data);

        if (data.error) {
            alert(`Error en ${account}: ` + data.error);
        } else if (data.data) {
            displayPaymentHistory(data.data);
        } else {
            alert("Respuesta inesperada de Binance.");
        }
    } catch (error) {
        console.error(`Error al obtener historial de pagos (${account}):`, error);
        alert(`No se pudo cargar el historial de pagos (${account}).`);
    }
}

function displayPaymentHistory(data) {
    const historyTable = document.getElementById('paymentHistory');
    historyTable.innerHTML = '';

    data.forEach(transaction => {
        const row = `<tr>
            <td>${new Date(transaction.transactionTime).toLocaleString()}</td>
            <td>${transaction.transactionId}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.currency}</td>
            <td>${transaction.payerInfo ? transaction.payerInfo.name : 'N/A'}</td>
            <td>${transaction.receiverInfo ? transaction.receiverInfo.name : 'N/A'}</td>
        </tr>`;
        historyTable.innerHTML += row;
    });
}
