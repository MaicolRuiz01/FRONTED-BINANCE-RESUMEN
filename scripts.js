let allOrders = [];
let currentPage = 1;
const ordersPerPage = 10;

// const backendUrl = "https://backend-binance-resumen-production.up.railway.app"; // 🚀 Railway URL
    const backendUrl = "http://localhost:8080"; 
async function fetchP2POrders(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/p2p/orders`, {
            params: { account }
        });

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


function filterOrders() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Por favor, selecciona ambas fechas.");
        return;
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    const filteredOrders = allOrders.filter(order => {
        const orderTime = order.createTime;
        return orderTime >= startTime && orderTime <= endTime;
    });

    allOrders = filteredOrders;
    currentPage = 1;
    displayOrders(currentPage);
    setupPagination();
}

function displayOrders(page) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (allOrders.length === 0) {
        resultsDiv.innerHTML = "<p class='text-center'>No se encontraron órdenes en el rango de fechas.</p>";
        return;
    }

    const start = (page - 1) * ordersPerPage;
    const end = start + ordersPerPage;
    const paginatedOrders = allOrders.slice(start, end);

    const table = document.createElement("table");
    table.className = "table table-striped table-hover";
    const headerRow = table.insertRow();
    headerRow.className = "table-dark";

    const headers = ["Fecha", "USDT", "PESOS", "Comisión", "Tasa", "Estado", "Banco"];
    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    paginatedOrders.forEach(order => {
        const row = table.insertRow();
        ["createTime", "amount", "totalPrice", "commission", "unitPrice", "orderStatus", "payMethodName"].forEach(field => {
            const cell = row.insertCell();
            cell.textContent = field === 'createTime' ? new Date(order[field]).toLocaleString() : order[field] || "N/A";
        });
    });

    resultsDiv.appendChild(table);
}

function setupPagination() {
    const paginationDiv = document.getElementById("pagination");
    if (!paginationDiv) {
        console.error("El elemento 'pagination' no se encontró en el DOM.");
        return;
    }

    paginationDiv.innerHTML = "";

    const pageCount = Math.ceil(allOrders.length / ordersPerPage);
    const maxVisiblePages = 5; // Número de páginas visibles en la paginación

    if (pageCount <= 1) return; // No mostrar paginación si solo hay una página

    const createPageButton = (page, text = page, isDisabled = false, isActive = false) => {
        const button = document.createElement("button");
        button.className = `btn mx-1 ${isActive ? "btn-primary" : "btn-outline-primary"}`;
        button.textContent = text;
        button.disabled = isDisabled;
        button.onclick = () => {
            if (!isDisabled) {
                currentPage = page;
                displayOrders(currentPage);
                setupPagination();
            }
        };
        return button;
    };

    // Botón de "Anterior"
    if (currentPage > 1) {
        paginationDiv.appendChild(createPageButton(currentPage - 1, "<"));
    }

    // Siempre mostrar la primera página
    paginationDiv.appendChild(createPageButton(1, "1", false, currentPage === 1));

    if (currentPage > maxVisiblePages) {
        paginationDiv.appendChild(createPageButton(null, "...", true));
    }

    // Rango dinámico de páginas centrado en la página actual
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
        paginationDiv.appendChild(createPageButton(i, i, false, currentPage === i));
    }

    if (endPage < pageCount - 1) {
        paginationDiv.appendChild(createPageButton(null, "...", true));
    }

    // Siempre mostrar la última página
    if (pageCount > 1) {
        paginationDiv.appendChild(createPageButton(pageCount, pageCount, false, currentPage === pageCount));
    }

    // Botón de "Siguiente"
    if (currentPage < pageCount) {
        paginationDiv.appendChild(createPageButton(currentPage + 1, ">"));
    }
}


// Cargar órdenes al iniciar
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
        const response = await axios.get(`${backendUrl}/api/futures/positionHistory`, {
            params: { account }
        });
        console.log("Historial de posiciones:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial de posiciones:", error);
        alert("Error al cargar el historial de posiciones: " + error.message);
    }
}

// Función para obtener el historial de trades de futuros
async function fetchFuturesTradeHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/futures/tradeHistory`, {
            params: { account }
        });
        console.log("Historial de trades:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial de trades:", error);
        alert("Error al cargar el historial de trades: " + error.message);
    }
}

// Función para obtener el historial de transacciones de futuros
async function fetchFuturesTransactionHistory(account) {
    try {
        const response = await axios.get(`${backendUrl}/api/futures/transactionHistory`, {
            params: { account }
        });
        console.log("Historial de transacciones:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el historial de transacciones:", error);
        alert("Error al cargar el historial de transacciones: " + error.message);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const account = urlParams.get('account');

    // Asignar eventos a las pestañas
    const positionsTab = document.getElementById('positions-tab');
    const tradesTab = document.getElementById('trades-tab');
    const transactionsTab = document.getElementById('transactions-tab');

    positionsTab.addEventListener('shown.bs.tab', function (event) {
        fetchFuturesPositionHistory(account).then(data => {
            displayData(data, 'positions');
        });
    });

    tradesTab.addEventListener('shown.bs.tab', function (event) {
        fetchFuturesTradeHistory(account).then(data => {
            displayData(data, 'trades');
        });
    });

    transactionsTab.addEventListener('shown.bs.tab', function (event) {
        fetchFuturesTransactionHistory(account).then(data => {
            displayData(data, 'transactions');
        });
    });

    // Suponiendo que deseas cargar las posiciones al cargar la página por primera vez
    fetchFuturesPositionHistory(account).then(data => {
        displayData(data, 'positions');
    });
});

function displayData(data, tabId) {
    const tabPane = document.getElementById(tabId);
    tabPane.innerHTML = ''; // Limpiar contenido anterior
    if (!data || data.error) {
        tabPane.innerHTML = `<p class='text-center'>Error o sin datos disponibles.</p>`;
        return;
    }
    // Aquí puedes construir la visualización de los datos según necesites
    const content = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    tabPane.innerHTML = content;
}

