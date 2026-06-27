/*=====================================================
    INI Logistics V2
    Shipment Tracking Module
=====================================================*/

let currentShipment = null;

/*=====================================================
    PAGE LOAD
=====================================================*/

window.addEventListener("load", () => {

    checkLogin();

    const trackingInput =
        document.getElementById("trackingId");

    if (trackingInput) {

        trackingInput.focus();

        trackingInput.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                trackShipment();

            }

        });

    }

});

/*=====================================================
    TRACK SHIPMENT
=====================================================*/

function trackShipment() {

    const trackingId =
        document.getElementById("trackingId")
        .value
        .trim()
        .toUpperCase();

    if (trackingId === "") {

        showToast("Please enter a Shipment ID.", "warning");

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
            "trackingContainer"
        ).style.display = "none";

        document.getElementById(
            "trackingNotFound"
        ).style.display = "block";

        showToast("Shipment not found.", "error");

        return;

    }

    currentShipment = shipment;

    document.getElementById(
        "trackingContainer"
    ).style.display = "block";

    document.getElementById(
        "trackingNotFound"
    ).style.display = "none";

    populateShipment(shipment);

}

/*=====================================================
    POPULATE SHIPMENT
=====================================================*/

function populateShipment(shipment) {

    document.getElementById("shipmentId").innerText =
        shipment.id;

    document.getElementById("senderName").innerText =
        shipment.sender;

    document.getElementById("receiverName").innerText =
        shipment.receiver;

    document.getElementById("originCity").innerText =
        shipment.origin;

    document.getElementById("destinationCity").innerText =
        shipment.destination;

    document.getElementById("packageType").innerText =
        shipment.packageType || "-";

    document.getElementById("shipmentWeight").innerText =
        shipment.weight + " KG";

    document.getElementById("shipmentPriority").innerText =
        shipment.priority || "-";

    document.getElementById("shipmentCost").innerText =
        "₹" +
        Number(shipment.cost || 0)
        .toLocaleString("en-IN");

    document.getElementById("estimatedDelivery").innerText =
        shipment.estimatedDelivery || "-";

    document.getElementById("deliveryDate").innerText =
        shipment.estimatedDelivery || "-";

    document.getElementById("deliveryWeight").innerText =
        shipment.weight + " KG";

    document.getElementById("deliveryCost").innerText =
        "₹" +
        Number(shipment.cost || 0)
        .toLocaleString("en-IN");

    updateStatusBadge(shipment.status);

    updateProgress(shipment.status);

    updateTimeline(shipment.status);

    updateLocation(shipment.status);

    generateHistory(shipment);

}
/*=====================================================
    STATUS BADGE
=====================================================*/

function updateStatusBadge(status) {

    const badge =
        document.getElementById("statusBadge");

    if (!badge) return;

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

        default:
            badge.classList.add("created");

    }

}

/*=====================================================
    DELIVERY PROGRESS
=====================================================*/

function updateProgress(status) {

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");

    const currentStatus =
        document.getElementById("currentStatus");

    const statusDescription =
        document.getElementById("statusDescription");

    if (
        !progressFill ||
        !progressPercent ||
        !currentStatus ||
        !statusDescription
    ) {
        return;
    }

    let percent = 20;

    let description =
        "Shipment has been created successfully.";

    switch (status) {

        case "Shipment Created":

            percent = 20;

            description =
                "Shipment has been created successfully.";

            break;

        case "Picked Up":

            percent = 40;

            description =
                "Shipment has been picked up from sender.";

            break;

        case "In Transit":

            percent = 60;

            description =
                "Shipment is currently in transit.";

            break;

        case "Out For Delivery":

            percent = 80;

            description =
                "Shipment is out for delivery.";

            break;

        case "Delivered":

            percent = 100;

            description =
                "Shipment delivered successfully.";

            break;

    }

    progressFill.style.width = percent + "%";

    progressPercent.innerText =
        percent + "%";

    currentStatus.innerText =
        status;

    statusDescription.innerText =
        description;

}

/*=====================================================
    TIMELINE
=====================================================*/

function updateTimeline(status) {

    document
        .querySelectorAll(".timeline-step")
        .forEach(step => {

            step.classList.remove(
                "active",
                "completed"
            );

        });

    let activeStep = 1;

    switch (status) {

        case "Shipment Created":
            activeStep = 1;
            break;

        case "Picked Up":
            activeStep = 2;
            break;

        case "In Transit":
            activeStep = 3;
            break;

        case "Out For Delivery":
            activeStep = 4;
            break;

        case "Delivered":
            activeStep = 5;
            break;

    }

    for (let i = 1; i <= activeStep; i++) {

        const step =
            document.getElementById(
                "step" + i
            );

        if (!step) continue;

        if (i === activeStep) {

            step.classList.add("active");

        } else {

            step.classList.add("completed");

        }

    }

}

/*=====================================================
    CURRENT LOCATION
=====================================================*/

function updateLocation(status) {

    const location =
        document.getElementById(
            "currentLocation"
        );

    if (!location) return;

    switch (status) {

        case "Shipment Created":

            location.innerText =
                "Origin Warehouse";

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

        default:

            location.innerText =
                "Unknown";

    }

}
/*=====================================================
    TRACKING HISTORY
=====================================================*/

function generateHistory(shipment) {

    const history =
        document.getElementById("trackingHistory");

    if (!history) return;

    history.innerHTML = "";

    const events = [

        {
            status: "Shipment Created",
            icon: "fa-file-circle-plus",
            message: "Shipment has been created successfully."
        },

        {
            status: "Picked Up",
            icon: "fa-box",
            message: "Shipment collected from sender."
        },

        {
            status: "In Transit",
            icon: "fa-truck-fast",
            message: "Shipment is moving through our logistics network."
        },

        {
            status: "Out For Delivery",
            icon: "fa-map-location-dot",
            message: "Shipment is out for delivery."
        },

        {
            status: "Delivered",
            icon: "fa-circle-check",
            message: "Shipment delivered successfully."
        }

    ];

    const currentIndex = events.findIndex(
        event => event.status === shipment.status
    );

    events.forEach((event, index) => {

        const completed = index <= currentIndex;

        history.innerHTML += `

        <div class="history-item ${completed ? "completed" : ""}">

            <div class="history-icon">

                <i class="fa-solid ${event.icon}"></i>

            </div>

            <div class="history-content">

                <h4>${event.status}</h4>

                <p>${event.message}</p>

            </div>

        </div>

        `;

    });

}

/*=====================================================
    CLEAR TRACKING
=====================================================*/

function clearTracking() {

    const input =
        document.getElementById("trackingId");

    if (input) {

        input.value = "";

        input.focus();

    }

    const container =
        document.getElementById("trackingContainer");

    const notFound =
        document.getElementById("trackingNotFound");

    if (container)
        container.style.display = "none";

    if (notFound)
        notFound.style.display = "none";

    currentShipment = null;

}

/*=====================================================
    AUTO REFRESH
=====================================================*/

setInterval(() => {

    if (!currentShipment) return;

    const shipments =
        JSON.parse(
            localStorage.getItem("shipments")
        ) || [];

    const updated =
        shipments.find(
            shipment => shipment.id === currentShipment.id
        );

    if (!updated) return;

    currentShipment = updated;

    populateShipment(updated);

}, 5000);

/*=====================================================
    SHORTCUT KEYS
=====================================================*/

document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {

        clearTracking();

    }

    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        const input =
            document.getElementById("trackingId");

        if (input)
            input.focus();

    }

});

/*=====================================================
    DEMO FEATURE
=====================================================*/

function loadLatestShipment() {

    const shipments =
        JSON.parse(
            localStorage.getItem("shipments")
        ) || [];

    if (shipments.length === 0)
        return;

    const latest =
        shipments[shipments.length - 1];

    const input =
        document.getElementById("trackingId");

    if (input)
        input.value = latest.id;

}

/*=====================================================
    PAGE INITIALIZATION
=====================================================*/

window.addEventListener("load", () => {

    loadLatestShipment();

    console.log(
        "INI Logistics Tracking Module v3.0 Loaded"
    );

});




