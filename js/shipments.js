/* =====================================================
   INI Logistics - Shipment Management
   Part 1
=====================================================*/

// Global Variables
let shipments = [];
let filteredShipments = [];

const STATUS = [
    "Shipment Created",
    "Picked Up",
    "In Transit",
    "Out For Delivery",
    "Delivered"
];

// ---------------------------
// Load Shipments
// ---------------------------
function loadShipments() {

    shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

    filteredShipments = [...shipments];

    document.getElementById("shipmentCount").textContent =
        shipments.length;

    renderTable(filteredShipments);

}

// ---------------------------
// Render Table
// ---------------------------
function renderTable(data) {

    const table =
        document.getElementById("shipmentTable");

    if (!table) return;

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="12">
                <div class="empty-state">
                    📦
                    <h3>No Shipments Found</h3>
                    <p>Create your first shipment.</p>
                </div>
            </td>
        </tr>
        `;

        return;
    }

    data.forEach((shipment, index) => {

        table.innerHTML += renderShipmentRow(
            shipment,
            index
        );

    });

    document
        .querySelectorAll(".status-dropdown")
        .forEach(setStatusColor);

}

// ---------------------------
// Render Single Row
// ---------------------------
function renderShipmentRow(shipment, index) {

    const cost =
        Number(shipment.cost || 0)
        .toLocaleString("en-IN");

    return `

<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.receiver}</td>

<td>${shipment.origin}</td>

<td>${shipment.destination}</td>

<td>${shipment.packageType || "-"}</td>

<td>${shipment.weight} KG</td>

<td>${shipment.priority || "-"}</td>

<td>₹${cost}</td>

<td>${shipment.estimatedDelivery || "-"}</td>

<td>

<select
class="status-dropdown"
onchange="updateStatus(${index},this)">

${STATUS.map(status => `

<option
value="${status}"
${shipment.status===status ? "selected":""}>

${status}

</option>

`).join("")}

</select>

<div class="progress-wrapper">

${createProgressBar(shipment.status)}

</div>

</td>

<td>

<button
class="icon-btn view-btn"
title="View Shipment"
onclick="viewShipment(${index})">

👁

</button>

<button
class="icon-btn edit-btn"
title="Edit Shipment"
onclick="editShipment(${index})">

✏️

</button>

<button
class="icon-btn delete-btn"
title="Delete Shipment"
onclick="deleteShipment(${index})">

🗑

</button>

</td>

</tr>

`;

}

// ---------------------------
// Update Status
// ---------------------------
function updateStatus(index, element) {

    shipments[index].status =
        element.value;

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

    setStatusColor(element);

    loadShipments();

    showToast("Shipment updated successfully.");

}

// ---------------------------
// Delete Shipment
// ---------------------------
function deleteShipment(index) {

    if (!confirm(
        "Delete this shipment?"
    )) return;

    shipments.splice(index, 1);

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

    loadShipments();

    showToast("Shipment deleted.");

}

// ---------------------------
// Search Shipment
// ---------------------------
function searchShipment() {

    const keyword =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    filteredShipments =
        shipments.filter(shipment =>

            shipment.id.toLowerCase().includes(keyword)

            ||

            shipment.sender.toLowerCase().includes(keyword)

            ||

            shipment.receiver.toLowerCase().includes(keyword)

        );

    renderTable(filteredShipments);

}

/* =====================================================
   INI Logistics - Shipment Management
   Part 2
=====================================================*/

// ---------------------------
// Filter Shipments
// ---------------------------
function filterShipments() {

    const status = document
        .getElementById("statusFilter")
        .value;

    if (status === "") {
        filteredShipments = [...shipments];
    } else {
        filteredShipments = shipments.filter(
            shipment => shipment.status === status
        );
    }

    renderTable(filteredShipments);

}

// ---------------------------
// View Shipment
// ---------------------------
function viewShipment(index) {

    const shipment = shipments[index];

    alert(

`Shipment Details

Shipment ID : ${shipment.id}

Sender : ${shipment.sender}

Receiver : ${shipment.receiver}

Origin : ${shipment.origin}

Destination : ${shipment.destination}

Package Type : ${shipment.packageType}

Weight : ${shipment.weight} KG

Priority : ${shipment.priority}

Cost : ₹${Number(shipment.cost || 0).toLocaleString("en-IN")}

ETA : ${shipment.estimatedDelivery}

Status : ${shipment.status}`

    );

}

// ---------------------------
// Edit Shipment
// ---------------------------
function editShipment(index){

    localStorage.setItem(
        "editShipmentIndex",
        index
    );

    window.location.href =
        "shipment.html";

}

// ---------------------------
// Export CSV
// ---------------------------
function exportCSV(){

    if(shipments.length===0){

        alert("No shipment data available.");

        return;

    }

    let csv =
"Shipment ID,Sender,Receiver,Origin,Destination,Weight,Priority,Cost,Status\n";

    shipments.forEach(shipment=>{

        csv +=
`${shipment.id},
${shipment.sender},
${shipment.receiver},
${shipment.origin},
${shipment.destination},
${shipment.weight},
${shipment.priority},
${shipment.cost},
${shipment.status}\n`;

    });

    const blob =
        new Blob(
            [csv],
            {
                type:"text/csv"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "INI_Logistics_Shipments.csv";

    a.click();

}

// ---------------------------
// Export Excel
// ---------------------------
function exportToExcel(){

    exportCSV();

}

// ---------------------------
// Status Colors
// ---------------------------
function setStatusColor(select){

    select.classList.remove(
        "created",
        "picked",
        "transit",
        "delivery",
        "delivered"
    );

    switch(select.value){

        case "Shipment Created":

            select.classList.add("created");

            break;

        case "Picked Up":

            select.classList.add("picked");

            break;

        case "In Transit":

            select.classList.add("transit");

            break;

        case "Out For Delivery":

            select.classList.add("delivery");

            break;

        case "Delivered":

            select.classList.add("delivered");

            break;

    }

}

// ---------------------------
// Progress Bar
// ---------------------------
function createProgressBar(status){

    const progress = {

        "Shipment Created":20,

        "Picked Up":40,

        "In Transit":60,

        "Out For Delivery":80,

        "Delivered":100

    };

    return `

<div class="progress">

<div
class="progress-fill"
style="width:${progress[status] || 0}%">

</div>

</div>

`;

}

// ---------------------------
// Toast Notification
// ---------------------------
function showToast(message){

    const toast =
        document.getElementById("toast");

    if(!toast){

        console.log(message);

        return;

    }

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ---------------------------
// Sort by Column
// ---------------------------
function sortShipments(column){

    filteredShipments.sort((a,b)=>{

        return String(a[column])
            .localeCompare(
                String(b[column])
            );

    });

    renderTable(filteredShipments);

}

// ---------------------------
// Pagination (Ready)
// ---------------------------

const rowsPerPage = 10;

let currentPage = 1;

function changePage(page){

    currentPage = page;

    renderTable(filteredShipments);

}

// ---------------------------
// Initialize
// ---------------------------
window.onload = function(){

    loadShipments();

};
