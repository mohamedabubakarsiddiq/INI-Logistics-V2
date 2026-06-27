/*=========================================================
    INI Logistics
    New Shipment Module
    Version 2.1.0
=========================================================*/

"use strict";

/*=========================================================
    GLOBAL VARIABLES
=========================================================*/

let shipmentForm = null;

let shipmentId = null;

let sender = null;

let receiver = null;

let origin = null;

let destination = null;

let packageType = null;

let weight = null;

let priority = null;

let shipmentCost = null;

let estimatedDelivery = null;

let submitButton = null;

/*=========================================================
    CACHE DOM ELEMENTS
=========================================================*/

function cacheElements(){

    shipmentForm =
    document.getElementById("shipmentForm");

    shipmentId =
    document.getElementById("shipmentId");

    sender =
    document.getElementById("sender");

    receiver =
    document.getElementById("receiver");

    origin =
    document.getElementById("origin");

    destination =
    document.getElementById("destination");

    packageType =
    document.getElementById("packageType");

    weight =
    document.getElementById("weight");

    priority =
    document.getElementById("priority");

    shipmentCost =
    document.getElementById("cost");

    estimatedDelivery =
    document.getElementById("estimatedDelivery");

    submitButton =
    document.getElementById("saveShipment");

}

/*=========================================================
    INITIALIZE FORM
=========================================================*/

function initializeForm(){

    shipmentId.value =
    generateShipmentID();

    shipmentCost.value =
    formatCurrency(0);

    estimatedDelivery.value =
    calculateDeliveryDate("Standard");

}

/*=========================================================
    LIVE CALCULATIONS
=========================================================*/

function updateShipmentDetails(){

    const cost =
    calculateShippingCost(

        weight.value,

        priority.value

    );

    shipmentCost.value =
    formatCurrency(cost);

    estimatedDelivery.value =
    calculateDeliveryDate(

        priority.value

    );

}

/*=========================================================
    EVENT LISTENERS
=========================================================*/

function registerEvents(){

    weight.addEventListener(

        "input",

        updateShipmentDetails

    );

    priority.addEventListener(

        "change",

        updateShipmentDetails

    );

    shipmentForm.addEventListener(

        "submit",

        saveShipment

    );

}

/*=========================================================
    FORM VALIDATION
=========================================================*/

function validateShipmentForm() {

    if (isEmpty(sender.value)) {

        showToast("Sender name is required.", "warning");
        sender.focus();
        return false;

    }

    if (isEmpty(receiver.value)) {

        showToast("Receiver name is required.", "warning");
        receiver.focus();
        return false;

    }

    if (isEmpty(origin.value)) {

        showToast("Origin is required.", "warning");
        origin.focus();
        return false;

    }

    if (isEmpty(destination.value)) {

        showToast("Destination is required.", "warning");
        destination.focus();
        return false;

    }

    if (origin.value.trim().toLowerCase() ===
        destination.value.trim().toLowerCase()) {

        showToast(
            "Origin and Destination cannot be the same.",
            "warning"
        );

        destination.focus();

        return false;

    }

    if (packageType.value === "") {

        showToast("Please select a package type.", "warning");
        packageType.focus();
        return false;

    }

    if (!isNumber(weight.value) || Number(weight.value) <= 0) {

        showToast("Please enter a valid weight.", "warning");
        weight.focus();
        return false;

    }

    if (priority.value === "") {

        showToast("Please select a priority.", "warning");
        priority.focus();
        return false;

    }

    return true;

}

/*=========================================================
    CREATE SHIPMENT OBJECT
=========================================================*/

function buildShipment() {

    return {

        id: shipmentId.value,

        sender: capitalize(
            sanitize(sender.value)
        ),

        receiver: capitalize(
            sanitize(receiver.value)
        ),

        origin: capitalize(
            sanitize(origin.value)
        ),

        destination: capitalize(
            sanitize(destination.value)
        ),

        packageType: packageType.value,

        weight: Number(weight.value),

        priority: priority.value,

        cost: calculateShippingCost(

            weight.value,

            priority.value

        ),

        estimatedDelivery:

            calculateDeliveryDate(

                priority.value

            ),

        bookingDate: today(),

        status: STATUS.CREATED,

        trackingHistory: [

            {

                status: STATUS.CREATED,

                date: new Date().toLocaleString(),

                location: capitalize(origin.value),

                remarks: "Shipment has been created."

            }

        ]

    };

}

/*=========================================================
    SAVE SHIPMENT
=========================================================*/

function saveShipment(event) {

    event.preventDefault();

    if (!validateShipmentForm())
        return;

    showLoader();

    let shipments = getShipments();

    const shipment = buildShipment();

    const exists = shipments.some(item =>

        item.id === shipment.id

    );

    if (exists) {

        hideLoader();

        showToast(

            "Shipment ID already exists.",

            "error"

        );

        shipmentId.value = generateShipmentID();

        return;

    }

    shipments.push(shipment);

    saveShipments(shipments);

    hideLoader();

    showToast(

        "Shipment created successfully!",

        "success"

    );

    setTimeout(() => {

        resetShipmentForm();

    }, 800);

}

/*=========================================================
    RESET FORM
=========================================================*/

function resetShipmentForm() {

    shipmentForm.reset();

    shipmentId.value =
        generateShipmentID();

    shipmentCost.value =
        formatCurrency(0);

    estimatedDelivery.value =
        calculateDeliveryDate("Standard");

    clearDraft();

    sender.focus();

}

/*=========================================================
    SHIPMENT PREVIEW
=========================================================*/

function previewShipment() {

    if (!validateShipmentForm())
        return;

    const shipment = buildShipment();

    const message = `

Shipment ID : ${shipment.id}

Sender      : ${shipment.sender}

Receiver    : ${shipment.receiver}

Origin      : ${shipment.origin}

Destination : ${shipment.destination}

Package     : ${shipment.packageType}

Weight      : ${shipment.weight} kg

Priority    : ${shipment.priority}

Cost        : ${formatCurrency(shipment.cost)}

Delivery    : ${formatDate(shipment.estimatedDelivery)}

Status      : ${shipment.status}

`;

    alert(message);

}

/*=========================================================
    COPY SHIPMENT ID
=========================================================*/

function copyShipmentID() {

    if (!shipmentId.value) return;

    copyToClipboard(shipmentId.value);

}

/*=========================================================
    PRINT RECEIPT
=========================================================*/

function printShipmentReceipt() {

    if (!validateShipmentForm())
        return;

    window.print();

}

/*=========================================================
    DRAFT STORAGE
=========================================================*/

const DRAFT_KEY = "shipmentDraft";

/*=========================================================
    SAVE DRAFT
=========================================================*/

function saveDraft() {

    const draft = {

        sender: sender.value,

        receiver: receiver.value,

        origin: origin.value,

        destination: destination.value,

        packageType: packageType.value,

        weight: weight.value,

        priority: priority.value

    };

    localStorage.setItem(

        DRAFT_KEY,

        JSON.stringify(draft)

    );

}

/*=========================================================
    RESTORE DRAFT
=========================================================*/

function restoreDraft() {

    const draft = JSON.parse(

        localStorage.getItem(DRAFT_KEY)

    );

    if (!draft)
        return;

    sender.value =
        draft.sender || "";

    receiver.value =
        draft.receiver || "";

    origin.value =
        draft.origin || "";

    destination.value =
        draft.destination || "";

    packageType.value =
        draft.packageType || "";

    weight.value =
        draft.weight || "";

    priority.value =
        draft.priority || "Standard";

    updateShipmentDetails();

}

/*=========================================================
    CLEAR DRAFT
=========================================================*/

function clearDraft() {

    localStorage.removeItem(DRAFT_KEY);

}

/*=========================================================
    AUTO SAVE
=========================================================*/

function enableAutoSave() {

    const controls = [

        sender,

        receiver,

        origin,

        destination,

        packageType,

        weight,

        priority

    ];

    controls.forEach(control => {

        control.addEventListener(

            "input",

            debounce(saveDraft, 500)

        );

        control.addEventListener(

            "change",

            debounce(saveDraft, 500)

        );

    });

}

/*=========================================================
    EXPORT SHIPMENT
=========================================================*/

function exportShipment() {

    if (!validateShipmentForm())
        return;

    downloadJSON(

        `${shipmentId.value}.json`,

        buildShipment()

    );

    showToast(

        "Shipment exported successfully.",

        "success"

    );

}

/*=========================================================
    KEYBOARD SHORTCUTS
=========================================================*/

function registerKeyboardShortcuts() {

    document.addEventListener("keydown", function (e) {

        /* Ctrl + S = Save Shipment */

        if (e.ctrlKey && e.key.toLowerCase() === "s") {

            e.preventDefault();

            shipmentForm.requestSubmit();

        }

        /* Ctrl + Shift + P = Preview */

        if (

            e.ctrlKey &&

            e.shiftKey &&

            e.key.toLowerCase() === "p"

        ) {

            e.preventDefault();

            previewShipment();

        }

        /* Ctrl + E = Export */

        if (e.ctrlKey && e.key.toLowerCase() === "e") {

            e.preventDefault();

            exportShipment();

        }

        /* Esc = Reset Form */

        if (e.key === "Escape") {

            if (

                confirm(

                    "Clear the shipment form?"

                )

            ) {

                resetShipmentForm();

            }

        }

    });

}

/*=========================================================
    UNSAVED CHANGES WARNING
=========================================================*/

let formChanged = false;

function trackFormChanges() {

    const controls = [

        sender,

        receiver,

        origin,

        destination,

        packageType,

        weight,

        priority

    ];

    controls.forEach(control => {

        control.addEventListener("input", () => {

            formChanged = true;

        });

        control.addEventListener("change", () => {

            formChanged = true;

        });

    });

    window.addEventListener(

        "beforeunload",

        function (e) {

            if (!formChanged)
                return;

            e.preventDefault();

            e.returnValue = "";

        }

    );

}

/*=========================================================
    REGISTER OPTIONAL BUTTONS
=========================================================*/

function registerActionButtons() {

    const previewBtn =
        document.getElementById("previewShipment");

    const copyBtn =
        document.getElementById("copyShipmentId");

    const exportBtn =
        document.getElementById("exportShipment");

    const printBtn =
        document.getElementById("printShipment");

    if (previewBtn)
        previewBtn.addEventListener(
            "click",
            previewShipment
        );

    if (copyBtn)
        copyBtn.addEventListener(
            "click",
            copyShipmentID
        );

    if (exportBtn)
        exportBtn.addEventListener(
            "click",
            exportShipment
        );

    if (printBtn)
        printBtn.addEventListener(
            "click",
            printShipmentReceipt
        );

}

/*=========================================================
    INITIALIZATION
=========================================================*/

function initializeShipmentPage() {

    checkLogin();

    cacheElements();

    initializeForm();

    restoreDraft();

    registerEvents();

    registerActionButtons();

    registerKeyboardShortcuts();

    enableAutoSave();

    trackFormChanges();

    console.log(

        "INI Logistics Shipment Module v2.1 Loaded"

    );

}

/*=========================================================
    START APPLICATION
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeShipmentPage

);

