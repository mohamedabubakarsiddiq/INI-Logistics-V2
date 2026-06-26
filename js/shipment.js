/*====================================================
    INI Logistics
    shipment.js - Part 1
====================================================*/

/*=========================================
    Initialize Form
=========================================*/

function initializeShipmentForm(){

    generateNewShipmentID();

    setBookingDate();

    calculateETA();

    calculateShippingCost();

    restoreDraft();

    document
    .getElementById("weight")
    .addEventListener("input", calculateShippingCost);

    document
    .getElementById("priority")
    .addEventListener("change", calculateShippingCost);

    document
    .getElementById("shipmentForm")
    .addEventListener("submit", saveShipment);

}

/*=========================================
    Shipment ID
=========================================*/

function generateNewShipmentID(){

    document.getElementById("shipmentId").value =
    generateShipmentID();

}

/*=========================================
    Booking Date
=========================================*/

function setBookingDate(){

    const today =
    new Date().toISOString().split("T")[0];

    document.getElementById("bookingDate").value =
    today;

}

/*=========================================
    ETA Calculation
=========================================*/

function calculateETA(){

    const booking =
    document.getElementById("bookingDate").value;

    if(!booking) return;

    const priority =
    document.getElementById("priority").value;

    const eta =
    new Date(booking);

    switch(priority){

        case "Urgent":
            eta.setDate(eta.getDate()+1);
            break;

        case "Express":
            eta.setDate(eta.getDate()+3);
            break;

        default:
            eta.setDate(eta.getDate()+7);

    }

    document.getElementById("estimatedDelivery").value =
    eta.toISOString().split("T")[0];

}

document
.getElementById("priority")
.addEventListener("change",()=>{

    calculateETA();

    calculateShippingCost();

});

/*=========================================
    Shipping Cost
=========================================*/

function calculateShippingCost(){

    const weight =
    Number(
        document.getElementById("weight").value
    ) || 0;

    const priority =
    document.getElementById("priority").value;

    let cost =
    weight * 50;

    switch(priority){

        case "Express":

            cost += 300;

            break;

        case "Urgent":

            cost += 600;

            break;

        default:

            cost += 100;

    }

    document.getElementById("cost").value =
    cost;

}

/*=========================================
    Validation
=========================================*/

function validateShipment(){

    if(!validateRequiredFields("shipmentForm")){

        return false;

    }

    const senderPhone =
    document.getElementById("senderPhone").value;

    const receiverPhone =
    document.getElementById("receiverPhone").value;

    const phonePattern =
    /^[6-9]\d{9}$/;

    if(!phonePattern.test(senderPhone)){

        showToast(
            "Invalid sender phone number.",
            "warning"
        );

        return false;

    }

    if(!phonePattern.test(receiverPhone)){

        showToast(
            "Invalid receiver phone number.",
            "warning"
        );

        return false;

    }

    return true;

}

/*====================================================
    shipment.js - Part 2
====================================================*/

/*=========================================
    Save Shipment
=========================================*/

function saveShipment(event){

    event.preventDefault();

    if(!validateShipment()){

        return;

    }

    let shipments =
    getShipments();

    const shipment = {

        id:
        document.getElementById("shipmentId").value,

        date:
        document.getElementById("bookingDate").value,

        sender:
        document.getElementById("sender").value.trim(),

        senderPhone:
        document.getElementById("senderPhone").value.trim(),

        senderAddress:
        document.getElementById("senderAddress").value.trim(),

        receiver:
        document.getElementById("receiver").value.trim(),

        receiverPhone:
        document.getElementById("receiverPhone").value.trim(),

        receiverAddress:
        document.getElementById("receiverAddress").value.trim(),

        origin:
        document.getElementById("origin").value.trim(),

        destination:
        document.getElementById("destination").value.trim(),

        packageType:
        document.getElementById("packageType").value,

        weight:
        Number(document.getElementById("weight").value),

        length:
        Number(document.getElementById("length").value) || 0,

        width:
        Number(document.getElementById("width").value) || 0,

        height:
        Number(document.getElementById("height").value) || 0,

        priority:
        document.getElementById("priority").value,

        cost:
        Number(document.getElementById("cost").value),

        estimatedDelivery:
        document.getElementById("estimatedDelivery").value,

        status:
        document.getElementById("status").value,

        paymentStatus:
        document.getElementById("paymentStatus").value,

        remarks:
        document.getElementById("remarks").value.trim()

    };

    const exists =
    shipments.some(s=>s.id===shipment.id);

    if(exists){

        showToast(
            "Shipment ID already exists.",
            "error"
        );

        generateNewShipmentID();

        return;

    }

    shipments.push(shipment);

    saveShipments(shipments);

    localStorage.removeItem("shipmentDraft");

    showToast(
        "Shipment created successfully!"
    );

    setTimeout(()=>{

        window.location.href =
        "shipments.html";

    },1000);

}

/*=========================================
    Save Draft
=========================================*/

function saveDraft(){

    const draft = {

        bookingDate:
        document.getElementById("bookingDate").value,

        priority:
        document.getElementById("priority").value,

        packageType:
        document.getElementById("packageType").value,

        sender:
        document.getElementById("sender").value,

        senderPhone:
        document.getElementById("senderPhone").value,

        senderAddress:
        document.getElementById("senderAddress").value,

        receiver:
        document.getElementById("receiver").value,

        receiverPhone:
        document.getElementById("receiverPhone").value,

        receiverAddress:
        document.getElementById("receiverAddress").value,

        origin:
        document.getElementById("origin").value,

        destination:
        document.getElementById("destination").value,

        weight:
        document.getElementById("weight").value,

        length:
        document.getElementById("length").value,

        width:
        document.getElementById("width").value,

        height:
        document.getElementById("height").value,

        remarks:
        document.getElementById("remarks").value

    };

    localStorage.setItem(
        "shipmentDraft",
        JSON.stringify(draft)
    );

    showToast(
        "Draft saved successfully."
    );

}

/*=========================================
    Restore Draft
=========================================*/

function restoreDraft(){

    const draft =
    JSON.parse(
        localStorage.getItem("shipmentDraft")
    );

    if(!draft) return;

    Object.keys(draft).forEach(key=>{

        const field =
        document.getElementById(key);

        if(field){

            field.value = draft[key];

        }

    });

    calculateETA();

    calculateShippingCost();

}

/*=========================================
    Reset Form
=========================================*/

function clearShipmentForm(){

    if(!confirmAction(
        "Clear the shipment form?"
    )) return;

    document
    .getElementById("shipmentForm")
    .reset();

    generateNewShipmentID();

    setBookingDate();

    calculateETA();

    calculateShippingCost();

    localStorage.removeItem(
        "shipmentDraft"
    );

}

/*=========================================
    Auto Save Draft
=========================================*/

document.addEventListener(
"input",

debounce(()=>{

    saveDraft();

},1500)

);

/*=========================================
    Initialize
=========================================*/

window.addEventListener("load",()=>{

    initializeShipmentForm();

});

/*====================================================
    End shipment.js
====================================================*/
