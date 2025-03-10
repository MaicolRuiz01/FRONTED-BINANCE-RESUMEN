let allOrders = [];
let currentPage = 1;
const ordersPerPage = 10;

// const backendUrl = "https://backend-binance-resumen-production.up.railway.app"; // 🚀 Railway URL
    const backendUrl = "http://localhost:3000"; 



    function filterOrders() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
    
        if (!startDate || !endDate) {
            alert("Por favor, selecciona un rango de fechas válido.");
            return;
        }
    
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.createTime);
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            return orderDate >= start && orderDate <= end;
        });
    
        displayOrders(filteredOrders); // Mostrar las órdenes filtradas
    }
    
    function displayOrders(orders) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
    
        if (orders.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron órdenes en el rango de fechas seleccionado.</p>';
            return;
        }
    
        const table = document.createElement('table');
        table.className = 'table table-striped';
    
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Fecha</th>
                <th>USDT</th>
                <th>PESOS</th>
                <th>Comisión</th>
                <th>Tasa</th>
                <th>Estado</th>
                <th>Banco</th>
            </tr>
        `;
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(order.createTime).toLocaleString()}</td>
                <td>${order.amount}</td>
                <td>${order.totalPrice}</td>
                <td>${order.commission}</td>
                <td>${order.unitPrice}</td>
                <td>${order.orderStatus}</td>
                <td>${order.payMethodName}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
    
        resultsDiv.appendChild(table);
    }
    
    async function fetchP2POrders(account) {
        try {
            const response = await axios.get(`${backendUrl}/api/p2p/orders`, { params: { account } });
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
    
            allOrders = response.data.data;
            filterOrders(); // Aplicar filtro de fechas
        } catch (error) {
            console.error("Error al cargar órdenes P2P:", error);
            alert("No se pudo cargar las órdenes P2P.");
        }
    }
    

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    fetchP2POrders(account);
});

function downloadExcel() {
    if (allOrders.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos de las órdenes a formato adecuado para la biblioteca
    const worksheetData = allOrders.map(order => ({
        Fecha: new Date(order.createTime).toLocaleString(),
        USDT: order.amount,
        PESOS: order.totalPrice,
        Comisión: order.commission,
        Tasa: order.unitPrice,
        Estado: order.orderStatus,
        Banco: order.payMethodName
    }));

    // Añadir los datos al libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes P2P");

    // Opciones para guardar el archivo
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buffer;
    }

    // Descargar el archivo
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "OrdenesP2P.xlsx");
}

// Función para obtener el historial de posiciones de futuros
async function fetchFuturesPositionHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/futures/positionHistory`, { params: { account } });
        console.log("Historial de posiciones:", response.data);

        if (response.data.error) {
            alert("Error al cargar el historial de posiciones: " + response.data.error);
            return;
        }

        // Función para mostrar los datos
        displayData(response.data, 'positions');
    } catch (error) {
        console.error("Error al obtener el historial de posiciones:", error);
        alert("Error al cargar el historial de posiciones: " + error.message);
    }
}


// Función para obtener el historial de trades de futuros
async function fetchFuturesTradeHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/futures/tradeHistory`, { params: { account } });
        console.log("Historial de trades:", response.data);

        if (response.data.error) {
            alert("Error al cargar el historial de trades: " + response.data.error);
            return;
        }

        displayData(response.data, 'trades');
    } catch (error) {
        console.error("Error al obtener el historial de trades:", error);
        alert("Error al cargar el historial de trades: " + error.message);
    }
}

async function fetchFuturesTransactionHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/futures/transactionHistory`, { params: { account } });
        console.log("Historial de transacciones:", response.data);

        if (response.data.error) {
            alert("Error al cargar el historial de transacciones: " + response.data.error);
            return;
        }

        displayData(response.data, 'transactions');
    } catch (error) {
        console.error("Error al obtener el historial de transacciones:", error);
        alert("Error al cargar el historial de transacciones: " + error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    if (window.location.pathname.includes('orders.html')) {
        // Lógica para órdenes P2P
        fetchP2POrders(account);
    } else if (window.location.pathname.includes('futures.html')) {
        // Lógica para futuros
        const positionsTab = document.getElementById('positions-tab');
        const tradesTab = document.getElementById('trades-tab');
        const transactionsTab = document.getElementById('transactions-tab');

        if (positionsTab) {
            positionsTab.addEventListener('shown.bs.tab', function (event) {
                fetchFuturesPositionHistory(account).then(data => {
                    displayData(data, 'positions');
                });
            });
        }

        if (tradesTab) {
            tradesTab.addEventListener('shown.bs.tab', function (event) {
                fetchFuturesTradeHistory(account).then(data => {
                    displayData(data, 'trades');
                });
            });
        }

        if (transactionsTab) {
            transactionsTab.addEventListener('shown.bs.tab', function (event) {
                fetchFuturesTransactionHistory(account).then(data => {
                    displayData(data, 'transactions');
                });
            });
        }

        // Cargar las posiciones al inicio
        if (positionsTab) {
            fetchFuturesPositionHistory(account).then(data => {
                displayData(data, 'positions');
            });
        }
    }
});

function displayData(data, tabId) {
    const tabPane = document.getElementById(tabId);
    tabPane.innerHTML = '';

    if (!data || data.error) {
        tabPane.innerHTML = `<p class='text-center'>Error o sin datos disponibles.</p>`;
        return;
    }

    // Aquí puedes construir la visualización de los datos según necesites
    const content = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    tabPane.innerHTML = content;
}


