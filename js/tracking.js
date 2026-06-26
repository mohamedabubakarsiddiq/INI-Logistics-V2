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

