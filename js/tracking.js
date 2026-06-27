/*====================================================
    INI Logistics
    tracking.js
====================================================*/

window.addEventListener("load", () => {

    checkLogin();

    document
        .getElementById("trackingId")
        .focus();

    document
        .getElementById("trackingId")
        .addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                trackShipment();

            }

        });

});

/*=========================================
    Track Shipment
=========================================*/

function trackShipment() {

    const trackingId = document
        .getElementById("trackingId")
        .value
        .trim()
        .toUpperCase();

    if (trackingId === "") {

        showToast(
            "Please enter Shipment ID.",
            "warning"
        );

        return;

    }

    const shipments =
        JSON.parse(
            localStorage.getItem("shipments")
        ) || [];

    const shipment =
        shipments.find(s =>
            s.id.toUpperCase() === trackingId
        );

    if (!shipment) {

        document.getElementById(
            "trackingResult"
        ).style.display = "none";

        document.getElementById(
            "noTrackingFound"
        ).style.display = "block";

        showToast(
            "Shipment not found.",
            "error"
        );

        return;

    }

    document.getElementById(
        "noTrackingFound"
    ).style.display = "none";

    document.getElementById(
        "trackingResult"
    ).style.display = "block";

    populateShipment(shipment);

}

/*=========================================
    Populate Shipment Details
=========================================*/

function populateShipment(shipment) {

    document.getElementById(
        "trackShipmentId"
    ).innerText = shipment.id;

    document.getElementById(
        "trackSender"
    ).innerText = shipment.sender;

    document.getElementById(
        "trackReceiver"
    ).innerText = shipment.receiver;

    document.getElementById(
        "trackOrigin"
    ).innerText = shipment.origin;

    document.getElementById(
        "trackDestination"
    ).innerText = shipment.destination;

    document.getElementById(
        "trackPackage"
    ).innerText =
        shipment.packageType || "-";

    document.getElementById(
        "trackWeight"
    ).innerText =
        shipment.weight + " KG";

    document.getElementById(
        "trackPriority"
    ).innerText =
        shipment.priority || "-";

    document.getElementById(
        "trackCost"
    ).innerText =
        "₹" +
        Number(
            shipment.cost || 0
        ).toLocaleString("en-IN");

    document.getElementById(
        "trackETA"
    ).innerText =
        shipment.estimatedDelivery;

    updateStatusBadge(shipment.status);

    updateProgress(shipment.status);

    updateTimeline(shipment.status);

    updateLocation(shipment.status);

    generateHistory(shipment);

}
/*====================================================
    STATUS BADGE
====================================================*/

function updateStatusBadge(status) {

    const badge =
    document.getElementById("trackingBadge");

    badge.innerText = status;

    badge.className = "status-badge";

    switch (status) {

        case "Shipment Created":
            badge.classList.add("created");
            break;

        case "Picked Up":
            badge.classList.add("picked");
            break;

        case "In Transit":
            badge.classList.add("transit");
            break;

        case "Out For Delivery":
            badge.classList.add("delivery");
            break;

        case "Delivered":
            badge.classList.add("delivered");
            break;

    }

}

/*====================================================
    DELIVERY PROGRESS
====================================================*/

function updateProgress(status) {

    const progress =
    document.getElementById("trackingProgressFill");

    const current =
    document.getElementById("currentStatus");

    const message =
    document.getElementById("progressText");

    let percent = 20;

    let text = "";

    switch (status) {

        case "Shipment Created":

            percent = 20;

            text =
            "Shipment has been created successfully.";

            break;

        case "Picked Up":

            percent = 40;

            text =
            "Package has been collected from sender.";

            break;

        case "In Transit":

            percent = 60;

            text =
            "Shipment is currently in transit.";

            break;

        case "Out For Delivery":

            percent = 80;

            text =
            "Courier is out for delivery.";

            break;

        case "Delivered":

            percent = 100;

            text =
            "Shipment delivered successfully.";

            break;

    }

    progress.style.width =
    percent + "%";

    progress.innerText =
    percent + "%";

    current.innerText =
    status;

    message.innerText =
    text;

}

/*====================================================
    TIMELINE
====================================================*/

function updateTimeline(status) {

    document
    .querySelectorAll(".timeline-step")
    .forEach(step => {

        step.classList.remove("active");

        step.classList.remove("completed");

    });

    let completed = 1;

    switch (status) {

        case "Shipment Created":

            completed = 1;

            break;

        case "Picked Up":

            completed = 2;

            break;

        case "In Transit":

            completed = 3;

            break;

        case "Out For Delivery":

            completed = 4;

            break;

        case "Delivered":

            completed = 5;

            break;

    }

    for (let i = 1; i <= completed; i++) {

        const step =
        document.getElementById(
            "step" + i
        );

        if (step) {

            if (i === completed) {

                step.classList.add("active");

            } else {

                step.classList.add("completed");

            }

        }

    }

}

/*====================================================
    CURRENT LOCATION
====================================================*/

function updateLocation(status) {

    const location =
    document.getElementById(
        "currentLocation"
    );

    switch (status) {

        case "Shipment Created":

            location.innerText =
            "Warehouse";

            break;

        case "Picked Up":

            location.innerText =
            "Pickup Hub";

            break;

        case "In Transit":

            location.innerText =
            "Regional Distribution Center";

            break;

        case "Out For Delivery":

            location.innerText =
            "Local Delivery Hub";

            break;

        case "Delivered":

            location.innerText =
            "Delivered to Receiver";

            break;

    }

}
/*====================================================
    TRACKING HISTORY
====================================================*/

function generateHistory(shipment) {

    const history =
    document.getElementById("trackingHistory");

    history.innerHTML = "";

    const steps = [

        {
            status: "Shipment Created",
            icon: "fa-file-circle-plus",
            message: "Shipment has been created."
        },

        {
            status: "Picked Up",
            icon: "fa-box",
            message: "Shipment picked up from sender."
        },

        {
            status: "In Transit",
            icon: "fa-truck-fast",
            message: "Shipment is moving to destination."
        },

        {
            status: "Out For Delivery",
            icon: "fa-map-location-dot",
            message: "Courier is out for delivery."
        },

        {
            status: "Delivered",
            icon: "fa-circle-check",
            message: "Shipment delivered successfully."
        }

    ];

    let completed = 1;

    switch (shipment.status) {

        case "Shipment Created":
            completed = 1;
            break;

        case "Picked Up":
            completed = 2;
            break;

        case "In Transit":
            completed = 3;
            break;

        case "Out For Delivery":
            completed = 4;
            break;

        case "Delivered":
            completed = 5;
            break;

    }

    steps.forEach((step, index) => {

        history.innerHTML += `

        <div class="history-item ${index < completed ? "completed" : ""}">

            <div class="history-icon">

                <i class="fas ${step.icon}"></i>

            </div>

            <div class="history-content">

                <h4>${step.status}</h4>

                <p>${step.message}</p>

            </div>

        </div>

        `;

    });

}

/*====================================================
    CLEAR TRACKING
====================================================*/

function clearTracking() {

    document.getElementById("trackingId").value = "";

    document.getElementById("trackingResult").style.display = "none";

    document.getElementById("noTrackingFound").style.display = "none";

    document.getElementById("trackingId").focus();

}

/*====================================================
    AUTO REFRESH
====================================================*/

let currentTrackingId = "";

const originalTrackShipment = trackShipment;

trackShipment = function () {

    currentTrackingId = document
        .getElementById("trackingId")
        .value
        .trim()
        .toUpperCase();

    originalTrackShipment();

};

setInterval(() => {

    if (currentTrackingId !== "") {

        const shipments =
            JSON.parse(
                localStorage.getItem("shipments")
            ) || [];

        const shipment =
            shipments.find(s =>
                s.id.toUpperCase() === currentTrackingId
            );

        if (shipment) {

            populateShipment(shipment);

        }

    }

}, 5000);

/*====================================================
    SEARCH SHORTCUT
====================================================*/

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        clearTracking();

    }

});

/*====================================================
    DEMO TRACKING
====================================================*/

function loadLatestShipment() {

    const shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    if (shipments.length > 0) {

        document.getElementById("trackingId").value =
            shipments[shipments.length - 1].id;

    }

}

/*====================================================
    PAGE READY
====================================================*/

window.addEventListener("load", () => {

    loadLatestShipment();

});

/*====================================================
    VERSION
====================================================*/

console.log("INI Logistics Tracking Module v3.0 Loaded");
