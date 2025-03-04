let allOrders = [];
let currentPage = 1;
const ordersPerPage = 10;

async function fetchP2POrders(account) {
    try {
        const response = await axios.get(`http://localhost:3000/api/p2p/orders`, {
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
