/*=========================================================
    INI Logistics
    Version : 2.1.0
    Core Application Framework
=========================================================*/

"use strict";

/*=========================================================
    APPLICATION CONFIGURATION
=========================================================*/

const APP = {

    NAME: "INI Logistics",

    VERSION: "2.1.0",

    STORAGE: {

        SHIPMENTS: "shipments",

        CUSTOMERS: "customers",

        USERS: "users",

        CURRENT_USER: "loggedInUser"

    }

};

/*=========================================================
    SHIPMENT STATUS CONSTANTS
=========================================================*/

const STATUS = {

    CREATED: "Shipment Created",

    PICKED: "Picked Up",

    TRANSIT: "In Transit",

    DELIVERY: "Out For Delivery",

    DELIVERED: "Delivered"

};

/*=========================================================
    STORAGE MANAGER
=========================================================*/

function getData(key){

    try{

        return JSON.parse(localStorage.getItem(key)) || [];

    }

    catch(error){

        console.error("Storage Read Error:", error);

        return [];

    }

}

function saveData(key,data){

    try{

        localStorage.setItem(

            key,

            JSON.stringify(data)

        );

        return true;

    }

    catch(error){

        console.error("Storage Save Error:", error);

        return false;

    }

}

/*=========================================================
    SHIPMENTS
=========================================================*/

function getShipments(){

    return getData(APP.STORAGE.SHIPMENTS);

}

function saveShipments(shipments){

    return saveData(

        APP.STORAGE.SHIPMENTS,

        shipments

    );

}

/*=========================================================
    CUSTOMERS
=========================================================*/

function getCustomers(){

    return getData(APP.STORAGE.CUSTOMERS);

}

function saveCustomers(customers){

    return saveData(

        APP.STORAGE.CUSTOMERS,

        customers

    );

}

/*=========================================================
    USERS
=========================================================*/

function getUsers(){

    return getData(APP.STORAGE.USERS);

}

function saveUsers(users){

    return saveData(

        APP.STORAGE.USERS,

        users

    );

}

/*=========================================================
    CURRENT USER
=========================================================*/

function getCurrentUser(){

    return JSON.parse(

        sessionStorage.getItem(

            APP.STORAGE.CURRENT_USER

        )

    );

}

function setCurrentUser(user){

    sessionStorage.setItem(

        APP.STORAGE.CURRENT_USER,

        JSON.stringify(user)

    );

}

function clearCurrentUser(){

    sessionStorage.removeItem(

        APP.STORAGE.CURRENT_USER

    );

}

function isLoggedIn(){

    return getCurrentUser() !== null;

}

/*=========================================================
    DEFAULT ADMIN
=========================================================*/

function initializeUsers(){

    let users = getUsers();

    if(users.length > 0) return;

    users.push({

        id:1,

        name:"Administrator",

        username:"admin",

        password:"admin123",

        role:"Administrator"

    });

    saveUsers(users);

}

/*=========================================================
    LOGIN
=========================================================*/

function login(username,password){

    const users = getUsers();

    const user = users.find(u =>

        u.username === username &&

        u.password === password

    );

    if(!user){

        showToast(

            "Invalid username or password",

            "error"

        );

        return false;

    }

    setCurrentUser(user);

    showToast(

        "Welcome " + user.name,

        "success"

    );

    setTimeout(()=>{

        window.location.href="dashboard.html";

    },700);

    return true;

}

/*=========================================================
    LOGOUT
=========================================================*/

function logout(){

    if(!confirm(

        "Are you sure you want to logout?"

    )) return;

    clearCurrentUser();

    window.location.href="login.html";

}

/*=========================================================
    LOGIN CHECK
=========================================================*/

function checkLogin(){

    const page =

        window.location.pathname

        .split("/")

        .pop()

        .toLowerCase();

    const publicPages = [

        "",

        "index.html",

        "login.html"

    ];

    if(

        !isLoggedIn()

        &&

        !publicPages.includes(page)

    ){

        window.location.href="index.html";

        return;

    }

    if(

        isLoggedIn()

        &&

        publicPages.includes(page)

    ){

        window.location.href="dashboard.html";

    }

}

/*=========================================================
    APP STARTUP
=========================================================*/

initializeUsers();

console.log(

    APP.NAME +

    " Version " +

    APP.VERSION +

    " Loaded"

);

/*=========================================================
    TOAST NOTIFICATION
=========================================================*/

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);

    }

    toast.className = "";

    toast.classList.add("toast");
    toast.classList.add(type);

    let icon = "✅";

    switch (type) {

        case "success":
            icon = "✅";
            break;

        case "error":
            icon = "❌";
            break;

        case "warning":
            icon = "⚠️";
            break;

        case "info":
            icon = "ℹ️";
            break;

    }

    toast.innerHTML = `
        <span>${icon}</span>
        <span>${message}</span>
    `;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/*=========================================================
    LOADER
=========================================================*/

function showLoader() {

    const loader = document.getElementById("loader");

    if (loader)
        loader.style.display = "flex";

}

function hideLoader() {

    const loader = document.getElementById("loader");

    if (loader)
        loader.style.display = "none";

}

/*=========================================================
    VALIDATION
=========================================================*/

function isEmpty(value) {

    return value.trim() === "";

}

function isEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function isPhone(phone) {

    return /^[6-9]\d{9}$/.test(phone);

}

function isNumber(value) {

    return !isNaN(value);

}

function capitalize(text) {

    if (!text) return "";

    return text
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());

}

function sanitize(value) {

    return value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

}

/*=========================================================
    DATE HELPERS
=========================================================*/

function today() {

    return new Date().toISOString().split("T")[0];

}

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });

}

/*=========================================================
    CURRENCY
=========================================================*/

function formatCurrency(amount) {

    return "₹" +

        Number(amount || 0)

        .toLocaleString("en-IN");

}

/*=========================================================
    SHIPMENT ID
=========================================================*/

function generateShipmentID() {

    const shipments = getShipments();

    if (shipments.length === 0)
        return "SHP100001";

    const ids = shipments.map(shipment =>

        parseInt(

            shipment.id.replace("SHP", "")

        )

    );

    const next = Math.max(...ids) + 1;

    return "SHP" + next;

}

/*=========================================================
    SHIPPING COST
=========================================================*/

function calculateShippingCost(weight, priority) {

    weight = Number(weight);

    if (isNaN(weight))
        weight = 0;

    let cost = weight * 80;

    switch (priority) {

        case "Express":

            cost += 500;
            break;

        case "Urgent":

            cost += 1000;
            break;

        case "Standard":

        default:

            cost += 200;
            break;

    }

    return cost;

}

/*=========================================================
    DELIVERY DATE
=========================================================*/

function calculateDeliveryDate(priority) {

    const date = new Date();

    switch (priority) {

        case "Urgent":

            date.setDate(date.getDate() + 1);
            break;

        case "Express":

            date.setDate(date.getDate() + 3);
            break;

        default:

            date.setDate(date.getDate() + 7);

    }

    return date.toISOString().split("T")[0];

}

/*=========================================================
    STATUS HELPERS
=========================================================*/

function getStatusColor(status) {

    switch (status) {

        case STATUS.CREATED:
            return "created";

        case STATUS.PICKED:
            return "picked";

        case STATUS.TRANSIT:
            return "transit";

        case STATUS.DELIVERY:
            return "delivery";

        case STATUS.DELIVERED:
            return "delivered";

        default:
            return "created";

    }

}

function getStatusDescription(status) {

    switch (status) {

        case STATUS.CREATED:
            return "Shipment has been created successfully.";

        case STATUS.PICKED:
            return "Shipment has been collected from sender.";

        case STATUS.TRANSIT:
            return "Shipment is currently in transit.";

        case STATUS.DELIVERY:
            return "Shipment is out for delivery.";

        case STATUS.DELIVERED:
            return "Shipment delivered successfully.";

        default:
            return "";

    }

}

function getProgress(status) {

    switch (status) {

        case STATUS.CREATED:
            return 20;

        case STATUS.PICKED:
            return 40;

        case STATUS.TRANSIT:
            return 60;

        case STATUS.DELIVERY:
            return 80;

        case STATUS.DELIVERED:
            return 100;

        default:
            return 0;

    }

}

/*=========================================================
    EXPORT HELPERS
=========================================================*/

function downloadFile(filename, content, type) {

    const blob = new Blob(
        [content],
        { type: type }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

function downloadCSV(filename, rows) {

    if (!rows || rows.length === 0) {

        showToast(
            "No data available to export.",
            "warning"
        );

        return;

    }

    const headers = Object.keys(rows[0]);

    let csv = headers.join(",") + "\n";

    rows.forEach(row => {

        csv += headers.map(header => {

            return `"${row[header] ?? ""}"`;

        }).join(",");

        csv += "\n";

    });

    downloadFile(

        filename,

        csv,

        "text/csv"

    );

}

function downloadJSON(filename, data) {

    downloadFile(

        filename,

        JSON.stringify(data, null, 2),

        "application/json"

    );

}

/*=========================================================
    UUID GENERATOR
=========================================================*/

function uuid() {

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

        .replace(/[xy]/g, function(c){

            const r = Math.random() * 16 | 0;

            const v =

                c === "x"

                ? r

                : (r & 0x3 | 0x8);

            return v.toString(16);

        });

}

/*=========================================================
    RANDOM NUMBER
=========================================================*/

function randomNumber(min, max){

    return Math.floor(

        Math.random()

        * (max - min + 1)

    ) + min;

}

/*=========================================================
    DELAY
=========================================================*/

function delay(ms){

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/*=========================================================
    DEBOUNCE
=========================================================*/

function debounce(func, wait = 300){

    let timeout;

    return function(){

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            func.apply(this, arguments);

        }, wait);

    };

}

/*=========================================================
    COPY TO CLIPBOARD
=========================================================*/

async function copyToClipboard(text){

    try{

        await navigator.clipboard.writeText(text);

        showToast(

            "Copied to clipboard",

            "success"

        );

    }

    catch(error){

        console.error(error);

        showToast(

            "Copy failed",

            "error"

        );

    }

}

/*=========================================================
    SCROLL TO TOP
=========================================================*/

function scrollTopPage(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*=========================================================
    PRINT PAGE
=========================================================*/

function printPage(){

    window.print();

}

/*=========================================================
    PAGE TITLE
=========================================================*/

function setPageTitle(title){

    document.title =

        title +

        " | " +

        APP.NAME;

}

/*=========================================================
    FOOTER YEAR
=========================================================*/

function updateCopyrightYear(){

    const year =

        document.getElementById(

            "currentYear"

        );

    if(year){

        year.textContent =

            new Date()

            .getFullYear();

    }

}

/*=========================================================
    GLOBAL ERROR HANDLER
=========================================================*/

window.onerror = function(message, source, line, column, error){

    console.error("Application Error");

    console.error({

        message,

        source,

        line,

        column,

        error

    });

    showToast(

        "An unexpected error occurred.",

        "error"

    );

    return false;

};

/*=========================================================
    ONLINE / OFFLINE STATUS
=========================================================*/

window.addEventListener("online", () => {

    showToast(

        "Internet connection restored.",

        "success"

    );

});

window.addEventListener("offline", () => {

    showToast(

        "You are currently offline.",

        "warning"

    );

});

/*=========================================================
    GLOBAL KEYBOARD SHORTCUTS
=========================================================*/

document.addEventListener("keydown", function(e){

    /* ESC = Close loader */

    if(e.key === "Escape"){

        hideLoader();

    }

    /* Ctrl + P */

    if(e.ctrlKey && e.key.toLowerCase() === "p"){

        e.preventDefault();

        printPage();

    }

    /* Ctrl + Home */

    if(e.ctrlKey && e.key === "Home"){

        e.preventDefault();

        scrollTopPage();

    }

});

/*=========================================================
    VERIFY STORAGE
=========================================================*/

function verifyStorage(){

    if(!localStorage.getItem(APP.STORAGE.SHIPMENTS)){

        saveShipments([]);

    }

    if(!localStorage.getItem(APP.STORAGE.CUSTOMERS)){

        saveCustomers([]);

    }

    if(!localStorage.getItem(APP.STORAGE.USERS)){

        initializeUsers();

    }

}

/*=========================================================
    APP INITIALIZATION
=========================================================*/

function initApp(){

    console.group(APP.NAME);

    console.log("Version :", APP.VERSION);

    console.log("Initializing application...");

    verifyStorage();

    checkLogin();

    updateCopyrightYear();

    hideLoader();

    console.log("Initialization completed.");

    console.groupEnd();

}

/*=========================================================
    DOM READY
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    initApp();

});

/*=========================================================
    GLOBAL HELPERS
=========================================================*/

window.APP = APP;
window.STATUS = STATUS;

window.getShipments = getShipments;
window.saveShipments = saveShipments;

window.getCustomers = getCustomers;
window.saveCustomers = saveCustomers;

window.getUsers = getUsers;
window.saveUsers = saveUsers;

window.login = login;
window.logout = logout;
window.checkLogin = checkLogin;

window.showToast = showToast;

window.showLoader = showLoader;
window.hideLoader = hideLoader;

window.generateShipmentID = generateShipmentID;
window.calculateShippingCost = calculateShippingCost;
window.calculateDeliveryDate = calculateDeliveryDate;

window.formatCurrency = formatCurrency;
window.formatDate = formatDate;

window.getStatusColor = getStatusColor;
window.getStatusDescription = getStatusDescription;
window.getProgress = getProgress;

window.downloadCSV = downloadCSV;
window.downloadJSON = downloadJSON;

window.copyToClipboard = copyToClipboard;

window.randomNumber = randomNumber;
window.uuid = uuid;
window.delay = delay;
window.debounce = debounce;

window.scrollTopPage = scrollTopPage;
window.printPage = printPage;

/*=========================================================
    APPLICATION READY
=========================================================*/

console.log(
    `${APP.NAME} v${APP.VERSION} Ready`
);

