/*=========================================================
    INI Logistics
    Shipments Module
    Version 2.1.0
=========================================================*/

"use strict";

/*=========================================================
    GLOBAL VARIABLES
=========================================================*/

let shipments = [];
let filteredShipments = [];

let currentPage = 1;
const rowsPerPage = 10;

/*=========================================================
    DOM ELEMENTS
=========================================================*/

let shipmentTableBody;

let totalShipmentsCard;
let deliveredCard;
let transitCard;
let pendingCard;
let revenueCard;

let totalRecords;

/*=========================================================
    CACHE ELEMENTS
=========================================================*/

function cacheElements() {

    shipmentTableBody =
        document.getElementById("shipmentTableBody");

    totalShipmentsCard =
        document.getElementById("totalShipments");

    deliveredCard =
        document.getElementById("deliveredShipments");

    transitCard =
        document.getElementById("transitShipments");

    pendingCard =
        document.getElementById("pendingShipments");

    revenueCard =
        document.getElementById("totalRevenue");

    totalRecords =
        document.getElementById("totalRecords");

}

/*=========================================================
    LOAD SHIPMENTS
=========================================================*/

function loadShipments() {

    shipments = getShipments();

    filteredShipments = [...shipments];

    updateStatistics();

    renderTable();

}

/*=========================================================
    UPDATE DASHBOARD CARDS
=========================================================*/

function updateStatistics() {

    const total = shipments.length;

    const delivered = shipments.filter(

        shipment => shipment.status === STATUS.DELIVERED

    ).length;

    const transit = shipments.filter(

        shipment => shipment.status === STATUS.TRANSIT

    ).length;

    const pending = shipments.filter(

        shipment => shipment.status !== STATUS.DELIVERED

    ).length;

    const revenue = shipments.reduce(

        (sum, shipment) => sum + Number(shipment.cost),

        0

    );

    if (totalShipmentsCard)
        totalShipmentsCard.textContent = total;

    if (deliveredCard)
        deliveredCard.textContent = delivered;

    if (transitCard)
        transitCard.textContent = transit;

    if (pendingCard)
        pendingCard.textContent = pending;

    if (revenueCard)
        revenueCard.textContent = formatCurrency(revenue);

}

/*=========================================================
    RENDER TABLE
=========================================================*/

function renderTable() {

    shipmentTableBody.innerHTML = "";

    if (filteredShipments.length === 0) {

        shipmentTableBody.innerHTML =

        `<tr>

            <td colspan="10" class="text-center">

                No shipments found.

            </td>

        </tr>`;

        if (totalRecords)
            totalRecords.textContent = "0";

        return;

    }

    const start =

        (currentPage - 1) * rowsPerPage;

    const end =

        start + rowsPerPage;

    const pageData =

        filteredShipments.slice(start, end);

    pageData.forEach(shipment => {

        shipmentTableBody.innerHTML += `

<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.receiver}</td>

<td>${shipment.origin}</td>

<td>${shipment.destination}</td>

<td>${shipment.priority}</td>

<td>${formatCurrency(shipment.cost)}</td>

<td>

<span class="status-badge ${getStatusColor(shipment.status)}">

${shipment.status}

</span>

</td>

<td>${formatDate(shipment.bookingDate)}</td>

<td>

<button
class="table-btn view-btn"
onclick="viewShipment('${shipment.id}')">

View

</button>

<button
class="table-btn edit-btn"
onclick="editShipment('${shipment.id}')">

Edit

</button>

<button
class="table-btn delete-btn"
onclick="deleteShipment('${shipment.id}')">

Delete

</button>

</td>

</tr>

`;

    });

    if (totalRecords)

        totalRecords.textContent =

        filteredShipments.length;

    renderPagination();

}

/*=========================================================
    PAGINATION
=========================================================*/

function renderPagination() {

    const pagination =

        document.getElementById("pagination");

    if (!pagination)
        return;

    pagination.innerHTML = "";

    const totalPages =

        Math.ceil(

            filteredShipments.length /

            rowsPerPage

        );

    for (

        let page = 1;

        page <= totalPages;

        page++

    ) {

        pagination.innerHTML += `

<button

class="page-btn ${page===currentPage?"active":""}"

onclick="changePage(${page})">

${page}

</button>

`;

    }

}

function changePage(page){

    currentPage = page;

    renderTable();

}

/*=========================================================
    SEARCH & FILTER
=========================================================*/

function applyFilters() {

    const search =
        document.getElementById("searchShipment")?.value
        .trim()
        .toLowerCase() || "";

    const status =
        document.getElementById("filterStatus")?.value || "";

    const priority =
        document.getElementById("filterPriority")?.value || "";

    filteredShipments = shipments.filter(shipment => {

        const matchesSearch =

            shipment.id.toLowerCase().includes(search) ||

            shipment.sender.toLowerCase().includes(search) ||

            shipment.receiver.toLowerCase().includes(search) ||

            shipment.origin.toLowerCase().includes(search) ||

            shipment.destination.toLowerCase().includes(search);

        const matchesStatus =

            !status ||

            shipment.status === status;

        const matchesPriority =

            !priority ||

            shipment.priority === priority;

        return (

            matchesSearch &&

            matchesStatus &&

            matchesPriority

        );

    });

    currentPage = 1;

    renderTable();

}

/*=========================================================
    RESET FILTERS
=========================================================*/

function resetFilters() {

    const search =
        document.getElementById("searchShipment");

    const status =
        document.getElementById("filterStatus");

    const priority =
        document.getElementById("filterPriority");

    if(search) search.value = "";

    if(status) status.value = "";

    if(priority) priority.value = "";

    filteredShipments = [...shipments];

    currentPage = 1;

    renderTable();

}

/*=========================================================
    SORTING
=========================================================*/

function sortShipments(field) {

    filteredShipments.sort((a,b)=>{

        const valueA = a[field];

        const valueB = b[field];

        if(typeof valueA === "number"){

            return valueA-valueB;

        }

        return valueA
            .toString()
            .localeCompare(valueB);

    });

    renderTable();

}

/*=========================================================
    VIEW SHIPMENT
=========================================================*/

function viewShipment(id){

    const shipment = shipments.find(

        s => s.id === id

    );

    if(!shipment){

        showToast(

            "Shipment not found.",

            "error"

        );

        return;

    }

    const message =

`Shipment ID : ${shipment.id}

Sender : ${shipment.sender}

Receiver : ${shipment.receiver}

Origin : ${shipment.origin}

Destination : ${shipment.destination}

Package : ${shipment.packageType}

Weight : ${shipment.weight} kg

Priority : ${shipment.priority}

Cost : ${formatCurrency(shipment.cost)}

Booking Date : ${formatDate(shipment.bookingDate)}

Estimated Delivery : ${formatDate(shipment.estimatedDelivery)}

Status : ${shipment.status}`;

    alert(message);

}

/*=========================================================
    STATUS UPDATE
=========================================================*/

function updateShipmentStatus(id,status){

    const shipment = shipments.find(

        s => s.id === id

    );

    if(!shipment) return;

    shipment.status = status;

    shipment.trackingHistory.push({

        status,

        date:new Date().toLocaleString(),

        location:shipment.destination,

        remarks:getStatusDescription(status)

    });

    saveShipments(shipments);

    loadShipments();

    showToast(

        "Shipment status updated.",

        "success"

    );

}

/*=========================================================
    REGISTER EVENTS
=========================================================*/

function registerFilterEvents(){

    const search =
        document.getElementById("searchShipment");

    const status =
        document.getElementById("filterStatus");

    const priority =
        document.getElementById("filterPriority");

    if(search){

        search.addEventListener(

            "input",

            debounce(applyFilters,300)

        );

    }

    if(status){

        status.addEventListener(

            "change",

            applyFilters

        );

    }

    if(priority){

        priority.addEventListener(

            "change",

            applyFilters

        );

    }

}

/*=========================================================
    EDIT SHIPMENT
=========================================================*/

function editShipment(id) {

    const shipment = shipments.find(s => s.id === id);

    if (!shipment) {

        showToast("Shipment not found.", "error");
        return;

    }

    const sender = prompt("Sender Name:", shipment.sender);
    if (sender === null) return;

    const receiver = prompt("Receiver Name:", shipment.receiver);
    if (receiver === null) return;

    const origin = prompt("Origin:", shipment.origin);
    if (origin === null) return;

    const destination = prompt("Destination:", shipment.destination);
    if (destination === null) return;

    shipment.sender = capitalize(sanitize(sender));
    shipment.receiver = capitalize(sanitize(receiver));
    shipment.origin = capitalize(sanitize(origin));
    shipment.destination = capitalize(sanitize(destination));

    saveShipments(shipments);

    loadShipments();

    showToast(
        "Shipment updated successfully.",
        "success"
    );

}

/*=========================================================
    DELETE SHIPMENT
=========================================================*/

function deleteShipment(id) {

    const shipment = shipments.find(s => s.id === id);

    if (!shipment) {

        showToast("Shipment not found.", "error");
        return;

    }

    if (!confirm(
        `Delete shipment ${id}?`
    )) return;

    shipments = shipments.filter(

        shipment => shipment.id !== id

    );

    saveShipments(shipments);

    loadShipments();

    showToast(

        "Shipment deleted successfully.",

        "success"

    );

}

/*=========================================================
    REFRESH TABLE
=========================================================*/

function refreshTable() {

    shipments = getShipments();

    filteredShipments = [...shipments];

    updateStatistics();

    renderTable();

}

/*=========================================================
    EXPORT CSV
=========================================================*/

function exportCSV() {

    if (shipments.length === 0) {

        showToast(

            "No shipments available.",

            "warning"

        );

        return;

    }

    downloadCSV(

        "shipments.csv",

        shipments

    );

}

/*=========================================================
    EXPORT JSON
=========================================================*/

function exportJSON() {

    if (shipments.length === 0) {

        showToast(

            "No shipments available.",

            "warning"

        );

        return;

    }

    downloadJSON(

        "shipments.json",

        shipments

    );

}

/*=========================================================
    PRINT SHIPMENTS
=========================================================*/

function printShipments() {

    window.print();

}

/*=========================================================
    UPDATE STATISTICS
=========================================================*/

function refreshDashboard() {

    updateStatistics();

    renderTable();

}

/*=========================================================
    ACTION BUTTONS
=========================================================*/

function registerActionButtons() {

    const exportCsvBtn =
        document.getElementById("exportCSV");

    const exportJsonBtn =
        document.getElementById("exportJSON");

    const refreshBtn =
        document.getElementById("refreshTable");

    const printBtn =
        document.getElementById("printTable");

    if (exportCsvBtn) {

        exportCsvBtn.addEventListener(

            "click",

            exportCSV

        );

    }

    if (exportJsonBtn) {

        exportJsonBtn.addEventListener(

            "click",

            exportJSON

        );

    }

    if (refreshBtn) {

        refreshBtn.addEventListener(

            "click",

            refreshTable

        );

    }

    if (printBtn) {

        printBtn.addEventListener(

            "click",

            printShipments

        );

    }

}

/*=========================================================
    PREVIOUS PAGE
=========================================================*/

function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

}

/*=========================================================
    NEXT PAGE
=========================================================*/

function nextPage() {

    const totalPages = Math.ceil(

        filteredShipments.length / rowsPerPage

    );

    if (currentPage < totalPages) {

        currentPage++;

        renderTable();

    }

}

/*=========================================================
    EMPTY STATE
=========================================================*/

function checkEmptyState() {

    const emptyState =
        document.getElementById("emptyState");

    if (!emptyState)
        return;

    if (filteredShipments.length === 0) {

        emptyState.style.display = "block";

    }

    else {

        emptyState.style.display = "none";

    }

}

/*=========================================================
    KEYBOARD SHORTCUTS
=========================================================*/

function registerKeyboardShortcuts() {

    document.addEventListener("keydown", function (e) {

        /* Ctrl + F */

        if (e.ctrlKey && e.key.toLowerCase() === "f") {

            e.preventDefault();

            document.getElementById(

                "searchShipment"

            )?.focus();

        }

        /* Ctrl + R */

        if (e.ctrlKey && e.key.toLowerCase() === "r") {

            e.preventDefault();

            refreshTable();

        }

        /* Ctrl + E */

        if (e.ctrlKey && e.key.toLowerCase() === "e") {

            e.preventDefault();

            exportCSV();

        }

        /* Ctrl + J */

        if (e.ctrlKey && e.key.toLowerCase() === "j") {

            e.preventDefault();

            exportJSON();

        }

        /* Ctrl + P */

        if (e.ctrlKey && e.key.toLowerCase() === "p") {

            e.preventDefault();

            printShipments();

        }

    });

}

/*=========================================================
    AUTO REFRESH
=========================================================*/

function startAutoRefresh() {

    setInterval(function () {

        shipments = getShipments();

        filteredShipments = [...shipments];

        updateStatistics();

        renderTable();

        checkEmptyState();

    }, 30000);

}

/*=========================================================
    INITIALIZE PAGE
=========================================================*/

function initializeShipmentsPage() {

    checkLogin();

    cacheElements();

    loadShipments();

    registerFilterEvents();

    registerActionButtons();

    registerKeyboardShortcuts();

    checkEmptyState();

    startAutoRefresh();

    console.log(

        "INI Logistics Shipments Module v2.1 Loaded"

    );

}

/*=========================================================
    START APPLICATION
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeShipmentsPage

);



