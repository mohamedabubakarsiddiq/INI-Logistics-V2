/*=========================================================
    INI Logistics
    Dashboard Module
    Version 2.1.0
=========================================================*/

"use strict";

/*=========================================================
    GLOBAL VARIABLES
=========================================================*/

let shipments = [];

let statusChart = null;
let monthlyChart = null;
let revenueChart = null;

/*=========================================================
    DASHBOARD ELEMENTS
=========================================================*/

let totalShipmentsCard;
let deliveredCard;
let transitCard;
let pendingCard;
let revenueCard;
let todayCard;

let recentShipmentTable;

/*=========================================================
    CACHE DOM ELEMENTS
=========================================================*/

function cacheElements(){

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

    todayCard =
    document.getElementById("todayShipments");

    recentShipmentTable =
    document.getElementById("recentShipmentTable");

}

/*=========================================================
    LOAD DATA
=========================================================*/

function loadDashboard(){

    shipments = getShipments();

    updateDashboardCards();
	
    refreshCharts();

    renderRecentShipments();

}

/*=========================================================
    KPI CARDS
=========================================================*/

function updateDashboardCards(){

    const total = shipments.length;

    const delivered = shipments.filter(

        shipment =>

        shipment.status === STATUS.DELIVERED

    ).length;

    const transit = shipments.filter(

        shipment =>

        shipment.status === STATUS.TRANSIT

    ).length;

    const pending = shipments.filter(

        shipment =>

        shipment.status !== STATUS.DELIVERED

    ).length;

    const revenue = shipments.reduce(

        (sum, shipment) =>

        sum + Number(shipment.cost),

        0

    );

    const today = shipments.filter(

        shipment =>

        shipment.bookingDate === today()

    ).length;

    if(totalShipmentsCard)

        totalShipmentsCard.textContent = total;

    if(deliveredCard)

        deliveredCard.textContent = delivered;

    if(transitCard)

        transitCard.textContent = transit;

    if(pendingCard)

        pendingCard.textContent = pending;

    if(revenueCard)

        revenueCard.textContent =

        formatCurrency(revenue);

    if(todayCard)

        todayCard.textContent = today;

}

/*=========================================================
    RECENT SHIPMENTS
=========================================================*/

function renderRecentShipments(){

    if(!recentShipmentTable)

        return;

    recentShipmentTable.innerHTML = "";

    if(shipments.length === 0){

        recentShipmentTable.innerHTML = `

<tr>

<td colspan="6">

No shipment records available.

</td>

</tr>

`;

        return;

    }

    const latest =

    [...shipments]

    .sort(

        (a,b)=>

        new Date(b.bookingDate)

        -

        new Date(a.bookingDate)

    )

    .slice(0,5);

    latest.forEach(shipment=>{

        recentShipmentTable.innerHTML += `

<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.destination}</td>

<td>

<span class="status-badge ${getStatusColor(shipment.status)}">

${shipment.status}

</span>

</td>

<td>${shipment.priority}</td>

<td>${formatDate(shipment.bookingDate)}</td>

</tr>

`;

    });

}

/*=========================================================
    REFRESH DASHBOARD
=========================================================*/

function refreshDashboard() {

    shipments = getShipments();

    updateDashboardCards();

    renderRecentShipments();

    refreshCharts();

    refreshAnalytics();

}
/*=========================================================
    PAGE STARTUP
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

    checkLogin();

    cacheElements();

    loadDashboard();

    console.log(

        "Dashboard Module v2.1 Loaded"

    );

});

/*=========================================================
    RECENT ACTIVITY
=========================================================*/

function renderRecentActivity() {

    const activityTable =
        document.getElementById("recentActivity");

    if (!activityTable)
        return;

    activityTable.innerHTML = "";

    if (shipments.length === 0) {

        activityTable.innerHTML = `

<tr>

<td colspan="5">

No recent activity available.

</td>

</tr>

`;

        return;

    }

    const latest = [...shipments]

        .sort((a, b) =>

            new Date(b.bookingDate) -

            new Date(a.bookingDate)

        )

        .slice(0, 10);

    latest.forEach(shipment => {

        activityTable.innerHTML += `

<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.destination}</td>

<td>

<span class="status-badge ${getStatusColor(shipment.status)}">

${shipment.status}

</span>

</td>

<td>${formatDate(shipment.bookingDate)}</td>

</tr>

`;

    });

}

/*=========================================================
    TOP ORIGINS
=========================================================*/

function getTopOrigins(limit = 5) {

    const counts = {};

    shipments.forEach(shipment => {

        counts[shipment.origin] =

            (counts[shipment.origin] || 0) + 1;

    });

    return Object.entries(counts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, limit);

}

/*=========================================================
    TOP DESTINATIONS
=========================================================*/

function getTopDestinations(limit = 5) {

    const counts = {};

    shipments.forEach(shipment => {

        counts[shipment.destination] =

            (counts[shipment.destination] || 0) + 1;

    });

    return Object.entries(counts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, limit);

}

/*=========================================================
    DISPLAY TOP LOCATIONS
=========================================================*/

function renderTopLocations() {

    const originList =
        document.getElementById("topOrigins");

    const destinationList =
        document.getElementById("topDestinations");

    if (originList) {

        originList.innerHTML = "";

        getTopOrigins().forEach(item => {

            originList.innerHTML += `

<li>

${item[0]}

<span>${item[1]}</span>

</li>

`;

        });

    }

    if (destinationList) {

        destinationList.innerHTML = "";

        getTopDestinations().forEach(item => {

            destinationList.innerHTML += `

<li>

${item[0]}

<span>${item[1]}</span>

</li>

`;

        });

    }

}

/*=========================================================
    PRIORITY DISTRIBUTION
=========================================================*/

function renderPriorityDistribution() {

    const element =
        document.getElementById("priorityDistribution");

    if (!element)
        return;

    const priorities = {

        Standard: 0,

        Express: 0,

        Overnight: 0

    };

    shipments.forEach(shipment => {

        if (priorities[shipment.priority] !== undefined) {

            priorities[shipment.priority]++;

        }

    });

    element.innerHTML = `

<div>Standard : ${priorities.Standard}</div>

<div>Express : ${priorities.Express}</div>

<div>Overnight : ${priorities.Overnight}</div>

`;

}

/*=========================================================
    EXPORT DASHBOARD DATA
=========================================================*/

function exportDashboardData() {

    const dashboardData = {

        generatedAt: new Date().toISOString(),

        totalShipments: shipments.length,

        totalRevenue: shipments.reduce(

            (sum, shipment) =>

                sum + Number(shipment.cost),

            0

        ),

        delivered:

            shipments.filter(

                s => s.status === STATUS.DELIVERED

            ).length,

        inTransit:

            shipments.filter(

                s => s.status === STATUS.TRANSIT

            ).length,

        pending:

            shipments.filter(

                s => s.status !== STATUS.DELIVERED

            ).length,

        shipments

    };

    downloadJSON(

        "dashboard-report.json",

        dashboardData

    );

    showToast(

        "Dashboard exported successfully.",

        "success"

    );

}

/*=========================================================
    PRINT DASHBOARD
=========================================================*/

function printDashboard() {

    printPage();

}

/*=========================================================
    REFRESH ANALYTICS
=========================================================*/

function refreshAnalytics() {

    renderRecentActivity();

    renderTopLocations();

    renderPriorityDistribution();

}
/*=========================================================
    AUTO REFRESH
=========================================================*/

let dashboardRefreshTimer = null;

function startAutoRefresh() {

    stopAutoRefresh();

    dashboardRefreshTimer = setInterval(() => {

        refreshDashboard();

    }, 30000);

}

function stopAutoRefresh() {

    if (dashboardRefreshTimer) {

        clearInterval(dashboardRefreshTimer);

        dashboardRefreshTimer = null;

    }

}

/*=========================================================
    PAGE VISIBILITY
=========================================================*/

document.addEventListener(

    "visibilitychange",

    function () {

        if (document.hidden) {

            stopAutoRefresh();

        } else {

            refreshDashboard();

            startAutoRefresh();

        }

    }

);

/*=========================================================
    KEYBOARD SHORTCUTS
=========================================================*/

function registerKeyboardShortcuts() {

    document.addEventListener("keydown", function (e) {

        /* Ctrl + R */

        if (e.ctrlKey && e.key.toLowerCase() === "r") {

            e.preventDefault();

            refreshDashboard();

            showToast(

                "Dashboard refreshed.",

                "success"

            );

        }

        /* Ctrl + E */

        if (e.ctrlKey && e.key.toLowerCase() === "e") {

            e.preventDefault();

            exportDashboardData();

        }

        /* Ctrl + P */

        if (e.ctrlKey && e.key.toLowerCase() === "p") {

            e.preventDefault();

            printDashboard();

        }

    });

}

/*=========================================================
    REGISTER ACTION BUTTONS
=========================================================*/

function registerDashboardButtons() {

    const refreshButton =
        document.getElementById("refreshDashboard");

    const exportButton =
        document.getElementById("exportDashboard");

    const printButton =
        document.getElementById("printDashboard");

    if (refreshButton) {

        refreshButton.addEventListener(

            "click",

            refreshDashboard

        );

    }

    if (exportButton) {

        exportButton.addEventListener(

            "click",

            exportDashboardData

        );

    }

    if (printButton) {

        printButton.addEventListener(

            "click",

            printDashboard

        );

    }

}

/*=========================================================
    DASHBOARD HEALTH
=========================================================*/

function checkDashboardHealth() {

    if (!Array.isArray(shipments)) {

        console.error(

            "Shipment data unavailable."

        );

        return;

    }

    console.log(

        `Dashboard Ready | ${shipments.length} Shipments Loaded`

    );

}

/*=========================================================
    INITIALIZATION
=========================================================*/

function initializeDashboard() {

    checkLogin();

    cacheElements();

    loadDashboard();

    refreshCharts();

    refreshAnalytics();

    registerDashboardButtons();

    registerKeyboardShortcuts();

    startAutoRefresh();

    checkDashboardHealth();

    console.log(

        "INI Logistics Dashboard v2.1 Loaded"

    );

}

/*=========================================================
    APPLICATION START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);


