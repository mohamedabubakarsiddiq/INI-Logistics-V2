/*=========================================================
    INI Logistics
    Core Module
    Version 2.1.1
=========================================================*/

"use strict";

/*=========================================================
    APPLICATION
=========================================================*/

const APP = {

    NAME: "INI Logistics",

    VERSION: "2.1.1",

    STORAGE: {

        CURRENT_USER: "currentUser",

        SHIPMENTS: "shipments",

        REMEMBER_USER: "rememberedUser"

    },

    SESSION_TIMEOUT: 60 * 60 * 1000 // 1 Hour

};

/*=========================================================
    STATUS CONSTANTS
=========================================================*/

const STATUS = {

    CREATED: "Created",

    PICKED: "Picked Up",

    TRANSIT: "In Transit",

    DELIVERY: "Out For Delivery",

    DELIVERED: "Delivered"

};

/*=========================================================
    PRIORITY
=========================================================*/

const PRIORITY = {

    STANDARD: "Standard",

    EXPRESS: "Express",

    OVERNIGHT: "Overnight"

};

/*=========================================================
    AUTHENTICATION
=========================================================*/

function login(username, password) {

    username = username.trim();

    password = password.trim();

    if (

        username === "admin" &&

        password === "admin123"

    ) {

        const user = {

            username,

            loginTime: Date.now()

        };

        sessionStorage.setItem(

            APP.STORAGE.CURRENT_USER,

            JSON.stringify(user)

        );

        return true;

    }

    return false;

}

/*=========================================================
    CURRENT USER
=========================================================*/

function getCurrentUser() {

    const data = sessionStorage.getItem(

        APP.STORAGE.CURRENT_USER

    );

    return data ? JSON.parse(data) : null;

}

/*=========================================================
    LOGIN STATUS
=========================================================*/

function isLoggedIn() {

    const user = getCurrentUser();

    if (!user)
        return false;

    const expired =

        Date.now() - user.loginTime >

        APP.SESSION_TIMEOUT;

    if (expired) {

        logout(false);

        return false;

    }

    return true;

}

/*=========================================================
    PAGE PROTECTION
=========================================================*/

function checkLogin() {

    if (!isLoggedIn()) {

        window.location.replace(

            "login.html"

        );

        return false;

    }

    return true;

}

/*=========================================================
    LOGOUT
=========================================================*/

function logout(showMessage = true) {

    sessionStorage.removeItem(

        APP.STORAGE.CURRENT_USER

    );

    if (showMessage) {

        localStorage.removeItem(

            APP.STORAGE.REMEMBER_USER

        );

    }

    window.location.replace(

        "login.html"

    );

}

/*=========================================================
    STORAGE
=========================================================*/

function getShipments() {

    return JSON.parse(

        localStorage.getItem(

            APP.STORAGE.SHIPMENTS

        ) || "[]"

    );

}

function saveShipments(shipments) {

    localStorage.setItem(

        APP.STORAGE.SHIPMENTS,

        JSON.stringify(shipments)

    );

}

/*=========================================================
    SESSION REFRESH
=========================================================*/

function refreshSession() {

    const user = getCurrentUser();

    if (!user)
        return;

    user.loginTime = Date.now();

    sessionStorage.setItem(

        APP.STORAGE.CURRENT_USER,

        JSON.stringify(user)

    );

}

/*=========================================================
    SESSION EVENTS
=========================================================*/

["click","keydown","mousemove"]

.forEach(eventName => {

    document.addEventListener(

        eventName,

        debounce(refreshSession,1000)

    );

});

/*=========================================================
    BACK BUTTON PROTECTION
=========================================================*/

window.addEventListener(

    "pageshow",

    function(){

        if(

            !window.location.pathname

            .includes("login.html")

        ){

            checkLogin();

        }

    }

);

console.log(

`${APP.NAME} Version ${APP.VERSION}`

);

/*=========================================================
    LOADER
=========================================================*/

function showLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoader() {

    const loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

}

/*=========================================================
    TOAST NOTIFICATION
=========================================================*/

function showToast(message, type = "info", duration = 3000) {

    let container = document.getElementById("toastContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "toastContainer";

        container.className = "toast-container";

        document.body.appendChild(container);

    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    const icons = {

        success: "✔",

        error: "✖",

        warning: "⚠",

        info: "ℹ"

    };

    toast.innerHTML = `

<div class="toast-content">

<span class="toast-icon">

${icons[type] || icons.info}

</span>

<span>${message}</span>

</div>

`;

    container.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, duration);

}

/*=========================================================
    CONFIRM DIALOG
=========================================================*/

function confirmAction(message) {

    return window.confirm(message);

}

/*=========================================================
    ALERT
=========================================================*/

function alertMessage(message) {

    window.alert(message);

}

/*=========================================================
    DOM HELPERS
=========================================================*/

function $(id) {

    return document.getElementById(id);

}

function $all(selector) {

    return document.querySelectorAll(selector);

}

/*=========================================================
    ENABLE / DISABLE
=========================================================*/

function enableElement(element) {

    if (element) {

        element.disabled = false;

    }

}

function disableElement(element) {

    if (element) {

        element.disabled = true;

    }

}

/*=========================================================
    SHOW / HIDE
=========================================================*/

function showElement(element) {

    if (element) {

        element.style.display = "";

    }

}

function hideElement(element) {

    if (element) {

        element.style.display = "none";

    }

}

/*=========================================================
    LOADING BUTTON
=========================================================*/

function setButtonLoading(button, loading, text = "Loading...") {

    if (!button) return;

    if (loading) {

        button.dataset.originalText = button.innerHTML;

        button.disabled = true;

        button.innerHTML = `

<span class="spinner"></span>

${text}

`;

    } else {

        button.disabled = false;

        button.innerHTML =

            button.dataset.originalText ||

            button.innerHTML;

    }

}

/*=========================================================
    PAGE TITLE
=========================================================*/

function setPageTitle(title) {

    document.title =

        `${title} | ${APP.NAME}`;

}

/*=========================================================
    VERSION
=========================================================*/

function showVersion() {

    console.log(

        `${APP.NAME} v${APP.VERSION}`

    );

}

/*=========================================================
    DATE & TIME UTILITIES
=========================================================*/

function today() {

    return new Date().toISOString().split("T")[0];

}

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }

    );

}

function formatDateTime(date) {

    if (!date) return "-";

    return new Date(date).toLocaleString(

        "en-IN"

    );

}

/*=========================================================
    CURRENCY
=========================================================*/

function formatCurrency(amount) {

    amount = Number(amount) || 0;

    return amount.toLocaleString(

        "en-IN",

        {

            style: "currency",

            currency: "INR"

        }

    );

}

/*=========================================================
    NUMBER FORMAT
=========================================================*/

function formatNumber(number) {

    return Number(number || 0)

        .toLocaleString("en-IN");

}

/*=========================================================
    TEXT HELPERS
=========================================================*/

function capitalize(text = "") {

    return text

        .trim()

        .toLowerCase()

        .replace(/\b\w/g,

            char => char.toUpperCase()

        );

}

function sanitize(text = "") {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML.trim();

}

function escapeHTML(text = "") {

    return sanitize(text);

}

/*=========================================================
    DEBOUNCE
=========================================================*/

function debounce(callback, delay = 300) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}

/*=========================================================
    CLIPBOARD
=========================================================*/

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast(

            "Copied to clipboard",

            "success"

        );

    }

    catch {

        showToast(

            "Clipboard unavailable",

            "warning"

        );

    }

}

/*=========================================================
    RANDOM ID
=========================================================*/

function generateRandomString(length = 8) {

    const chars =

        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result = "";

    for (

        let i = 0;

        i < length;

        i++

    ) {

        result += chars.charAt(

            Math.floor(

                Math.random() * chars.length

            )

        );

    }

    return result;

}

/*=========================================================
    SHIPMENT ID
=========================================================*/

function generateShipmentID() {

    const shipments = getShipments();

    let max = 100000;

    shipments.forEach(shipment => {

        const number = parseInt(

            shipment.id.replace(/\D/g, ""),

            10

        );

        if (number > max)

            max = number;

    });

    return `SHP${max + 1}`;

}

/*=========================================================
    DELIVERY DATE
=========================================================*/

function calculateDeliveryDate(priority) {

    const delivery = new Date();

    switch (priority) {

        case PRIORITY.OVERNIGHT:

            delivery.setDate(

                delivery.getDate() + 1

            );

            break;

        case PRIORITY.EXPRESS:

            delivery.setDate(

                delivery.getDate() + 3

            );

            break;

        default:

            delivery.setDate(

                delivery.getDate() + 7

            );

    }

    return delivery.toISOString().split("T")[0];

}

/*=========================================================
    STATUS DESCRIPTION
=========================================================*/

function getStatusDescription(status) {

    switch (status) {

        case STATUS.CREATED:

            return "Shipment created.";

        case STATUS.PICKED:

            return "Shipment picked up.";

        case STATUS.TRANSIT:

            return "Shipment is in transit.";

        case STATUS.DELIVERY:

            return "Out for delivery.";

        case STATUS.DELIVERED:

            return "Shipment delivered.";

        default:

            return "Unknown status.";

    }

}

/*=========================================================
    STATUS COLOR
=========================================================*/

function getStatusColor(status) {

    switch (status) {

        case STATUS.CREATED:

            return "primary";

        case STATUS.PICKED:

            return "warning";

        case STATUS.TRANSIT:

            return "info";

        case STATUS.DELIVERY:

            return "secondary";

        case STATUS.DELIVERED:

            return "success";

        default:

            return "dark";

    }

}

/*=========================================================
    DOWNLOAD FILE
=========================================================*/

function downloadFile(content, fileName, mimeType) {

    const blob = new Blob(

        [content],

        { type: mimeType }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/*=========================================================
    EXPORT JSON
=========================================================*/

function downloadJSON(fileName, data) {

    downloadFile(

        JSON.stringify(data, null, 2),

        fileName,

        "application/json"

    );

}

/*=========================================================
    EXPORT CSV
=========================================================*/

function downloadCSV(fileName, data) {

    if (!Array.isArray(data) || data.length === 0) {

        showToast(

            "No data available to export.",

            "warning"

        );

        return;

    }

    const headers = Object.keys(data[0]);

    const rows = data.map(row =>

        headers.map(header => {

            const value = row[header] ?? "";

            return `"${String(value).replace(/"/g, '""')}"`;

        }).join(",")

    );

    const csv = [

        headers.join(","),

        ...rows

    ].join("\n");

    downloadFile(

        csv,

        fileName,

        "text/csv;charset=utf-8"

    );

}

/*=========================================================
    PRINT PAGE
=========================================================*/

function printPage() {

    window.print();

}

/*=========================================================
    SEARCH
=========================================================*/

function searchByKeyword(data, keyword, fields) {

    if (!keyword)

        return [...data];

    keyword = keyword.toLowerCase();

    return data.filter(item =>

        fields.some(field =>

            String(item[field] || "")

                .toLowerCase()

                .includes(keyword)

        )

    );

}

/*=========================================================
    SORT
=========================================================*/

function sortData(data, field, ascending = true) {

    return [...data].sort((a, b) => {

        let valueA = a[field];

        let valueB = b[field];

        if (typeof valueA === "string") {

            valueA = valueA.toLowerCase();

            valueB = valueB.toLowerCase();

        }

        if (valueA < valueB)

            return ascending ? -1 : 1;

        if (valueA > valueB)

            return ascending ? 1 : -1;

        return 0;

    });

}

/*=========================================================
    FILTER
=========================================================*/

function filterData(data, predicate) {

    return data.filter(predicate);

}

/*=========================================================
    TOTAL REVENUE
=========================================================*/

function calculateTotalRevenue(shipments) {

    return shipments.reduce(

        (total, shipment) =>

            total + Number(shipment.cost || 0),

        0

    );

}

/*=========================================================
    SHIPMENT COUNT
=========================================================*/

function countShipmentsByStatus(shipments, status) {

    return shipments.filter(

        shipment => shipment.status === status

    ).length;

}

/*=========================================================
    UNIQUE VALUES
=========================================================*/

function uniqueValues(data, field) {

    return [

        ...new Set(

            data.map(item => item[field])

        )

    ].sort();

}

/*=========================================================
    RELOAD DATA
=========================================================*/

function reloadShipments() {

    return getShipments();

}

/*=========================================================
    SAVE DATA
=========================================================*/

function updateShipmentList(shipments) {

    saveShipments(shipments);

    return getShipments();

}

/*=========================================================
    GLOBAL ERROR HANDLER
=========================================================*/

let hasShownCriticalError = false;

window.addEventListener("error", function (event) {

    console.error(event);

    if (!hasShownCriticalError) {

        hasShownCriticalError = true;

        showToast(
            "Unexpected application error.",
            "error"
        );

    }

});
/*=========================================================
    UNHANDLED PROMISE REJECTIONS
=========================================================*/

window.addEventListener(

    "unhandledrejection",

    function (event) {

        console.error(

            "Unhandled Promise:",

            event.reason

        );

        showToast(

            "Unexpected application error.",

            "error"

        );

    }

);

/*=========================================================
    SESSION EXPIRATION CHECK
=========================================================*/

function monitorSession() {

    setInterval(function () {

        if (!isLoggedIn()) {

            showToast(

                "Session expired. Please login again.",

                "warning"

            );

            setTimeout(function () {

                logout(false);

            }, 1000);

        }

    }, 60000);

}

/*=========================================================
    ONLINE / OFFLINE STATUS
=========================================================*/

window.addEventListener("online", function () {

    showToast(

        "Internet connection restored.",

        "success"

    );

});

window.addEventListener("offline", function () {

    showToast(

        "You are currently offline.",

        "warning"

    );

});

/*=========================================================
    PERFORMANCE TIMER
=========================================================*/

const appStartTime = performance.now();

window.addEventListener(

    "load",

    function () {

        const loadTime =

            performance.now() -

            appStartTime;

        console.log(

            `Application loaded in ${loadTime.toFixed(2)} ms`

        );

    }

);

/*=========================================================
    STORAGE CHECK
=========================================================*/

function checkStorageSupport() {

    try {

        localStorage.setItem(

            "__storage_test__",

            "1"

        );

        localStorage.removeItem(

            "__storage_test__"

        );

        return true;

    }

    catch {

        showToast(

            "Browser storage unavailable.",

            "error"

        );

        return false;

    }

}

/*=========================================================
    APPLICATION HEALTH
=========================================================*/

function checkApplicationHealth() {

    const shipmentCount =

        getShipments().length;

    const user = getCurrentUser();

    console.group(

        `${APP.NAME} Health Check`

    );

    console.log(

        "Version:",

        APP.VERSION

    );

    console.log(

        "Current User:",

        user ? user.username : "None"

    );

    console.log(

        "Shipments:",

        shipmentCount

    );

    console.log(

        "Storage:",

        checkStorageSupport()

            ? "Available"

            : "Unavailable"

    );

    console.groupEnd();

}

/*=========================================================
    MEMORY CLEANUP
=========================================================*/

function cleanupApplication() {

    console.log(

        "Cleaning temporary resources..."

    );

}

/*=========================================================
    BEFORE PAGE UNLOAD
=========================================================*/

window.addEventListener(

    "beforeunload",

    cleanupApplication

);

/*=========================================================
    LOG APPLICATION INFO
=========================================================*/

function logApplicationInfo() {

    console.log(

        `${APP.NAME} v${APP.VERSION}`

    );

    console.log(

        "Session Active:",

        isLoggedIn()

    );

    console.log(

        "Current User:",

        getCurrentUser()

    );

}

/*=========================================================
    APPLICATION INITIALIZATION
=========================================================*/

function initializeApplication() {

    console.group(`${APP.NAME} Initialization`);

    logApplicationInfo();

    checkStorageSupport();

    checkApplicationHealth();

    monitorSession();

    hideLoader();

    console.log("Application initialized successfully.");

    console.groupEnd();

}

/*=========================================================
    GLOBAL FUNCTIONS
=========================================================*/

window.APP = APP;

window.STATUS = STATUS;

window.PRIORITY = PRIORITY;

window.login = login;

window.logout = logout;

window.checkLogin = checkLogin;

window.isLoggedIn = isLoggedIn;

window.getCurrentUser = getCurrentUser;

window.getShipments = getShipments;

window.saveShipments = saveShipments;

window.generateShipmentID = generateShipmentID;

window.calculateDeliveryDate = calculateDeliveryDate;

window.getStatusDescription = getStatusDescription;

window.getStatusColor = getStatusColor;

window.showToast = showToast;

window.showLoader = showLoader;

window.hideLoader = hideLoader;

window.downloadCSV = downloadCSV;

window.downloadJSON = downloadJSON;

window.printPage = printPage;

window.copyToClipboard = copyToClipboard;

window.formatDate = formatDate;

window.formatDateTime = formatDateTime;

window.formatCurrency = formatCurrency;

window.formatNumber = formatNumber;

window.capitalize = capitalize;

window.sanitize = sanitize;

window.debounce = debounce;

window.today = today;

window.reloadShipments = reloadShipments;

window.updateShipmentList = updateShipmentList;

window.searchByKeyword = searchByKeyword;

window.sortData = sortData;

window.filterData = filterData;

window.calculateTotalRevenue = calculateTotalRevenue;

window.countShipmentsByStatus = countShipmentsByStatus;

window.uniqueValues = uniqueValues;

/*=========================================================
    DOM READY
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});

/*=========================================================
    APP READY
=========================================================*/

window.addEventListener("load", () => {

    console.log(

        `${APP.NAME} ${APP.VERSION} Ready`

    );

});

/*=========================================================
    DEBUG
=========================================================*/

window.appInfo = function () {

    console.table({

        Name: APP.NAME,

        Version: APP.VERSION,

        User: getCurrentUser()?.username || "Guest",

        LoggedIn: isLoggedIn(),

        Shipments: getShipments().length

    });

};

/*=========================================================
    END OF FILE
=========================================================*/

console.log(

    "==================================="

);

console.log(

    `${APP.NAME} Core Loaded`

);

console.log(

    `Version : ${APP.VERSION}`

);

console.log(

    "==================================="

);



