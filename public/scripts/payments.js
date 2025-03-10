document.addEventListener('DOMContentLoaded', function () {
    // Obtener el parámetro 'account' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    // Cargar el historial de pagos automáticamente con la cuenta seleccionada
    fetchPaymentHistory(account);
});

// const backendUrl = "https://backend-binance-resumen-production.up.railway.app"; //  Railway URL
const backendUrl = "http://localhost:3000";

async function fetchPaymentHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/payments/history`, { params: { account } });
        console.log("Respuesta del backend:", response.data);

        if (response.data.error) {
            alert("Error: " + response.data.error);
            return;
        }

        if (!response.data.data || !Array.isArray(response.data.data)) {
            console.error("Formato inesperado:", response.data);
            alert("No se encontraron datos válidos.");
            return;
        }

        displayPaymentHistory(response.data.data);
    } catch (error) {
        console.error("Error al cargar el historial de pagos:", error);
        alert("No se pudo cargar el historial de pagos.");
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