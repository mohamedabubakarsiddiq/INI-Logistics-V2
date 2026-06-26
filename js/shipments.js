function loadShipments(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

document.getElementById(
"shipmentCount"
).innerText =
shipments.length;

let table =
document.getElementById(
"shipmentTable"
);

if(!table) return;

table.innerHTML = "";


if(shipments.length === 0){

table.innerHTML = `
<tr>
<td colspan="12">

<div class="empty-state">

📦

<h3>No Shipments Found</h3>

<p>
Create your first shipment.
</p>

</div>

</td>
</tr>
`;

return;

}

shipments.forEach(
(shipment,index)=>{

let badgeClass = "";

switch(shipment.status){

case "Shipment Created":
badgeClass = "created";
break;

case "Picked Up":
badgeClass = "picked";
break;

case "In Transit":
badgeClass = "transit";
break;

case "Out For Delivery":
badgeClass = "delivery";
break;

case "Delivered":
badgeClass = "delivered";
break;

}

table.innerHTML += `

<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.receiver}</td>

<td>${shipment.origin}</td>

<td>${shipment.destination}</td>

<td>${shipment.packageType || "-"}</td>

<td>${shipment.weight} KG</td>

<td>${shipment.priority || "-"}</td>

<td>₹${shipment.cost || 0}</td>

<td>${shipment.estimatedDelivery}</td>

<td>
<select
    class="status-dropdown"
    onchange="updateStatus(${index}, this.value)"
>
    <option value="Shipment Created" ${shipment.status === "Shipment Created" ? "selected" : ""}>Shipment Created</option>

    <option value="Picked Up" ${shipment.status === "Picked Up" ? "selected" : ""}>Picked Up</option>

    <option value="In Transit" ${shipment.status === "In Transit" ? "selected" : ""}>In Transit</option>

    <option value="Out For Delivery" ${shipment.status === "Out For Delivery" ? "selected" : ""}>Out For Delivery</option>

    <option value="Delivered" ${shipment.status === "Delivered" ? "selected" : ""}>Delivered</option>
</select>
</td>

<td>

<button
class="action-btn"
onclick="viewShipment(${index})">
View
</button>

<button
class="action-btn edit-btn"
onclick="editShipment(${index})">
Edit
</button>

<button
class="action-btn delete-btn"
onclick="deleteShipment(${index})">
Delete
</button>

</td>

</tr>

`;

});

}
function deleteShipment(index){

    let shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    if(confirm("Are you sure you want to delete this shipment?")){

        shipments.splice(index,1);

        localStorage.setItem(
            "shipments",
            JSON.stringify(shipments)
        );

        loadShipments();
    }
}
function searchShipment(){

let input =
document
.getElementById(
"searchBox"
)
.value
.toLowerCase();

let rows =
document
.querySelectorAll(
"#shipmentTable tr"
);

rows.forEach(row=>{

row.style.display =

row.innerText
.toLowerCase()
.includes(input)

?

""

:

"none";

});

}
function editShipment(index){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let newStatus =
prompt(

`Choose Status:

Shipment Created
Picked Up
In Transit
Out For Delivery
Delivered`

);

if(newStatus){

shipments[index].status =
newStatus;

localStorage.setItem(
"shipments",
JSON.stringify(shipments)
);

loadShipments();

}

}
function viewShipment(index){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let shipment =
shipments[index];

alert(

`Shipment ID: ${shipment.id}

Sender: ${shipment.sender}

Receiver: ${shipment.receiver}

Origin: ${shipment.origin}

Destination: ${shipment.destination}

Package: ${shipment.packageType}

Weight: ${shipment.weight} KG

Priority: ${shipment.priority}

Cost: ₹${shipment.cost}

Status: ${shipment.status}`

);

}
function filterShipments(){

let filter =
document.getElementById(
"statusFilter"
).value.toLowerCase();

let rows =
document.querySelectorAll(
"#shipmentTable tr"
);

rows.forEach(row=>{

if(filter === ""){

row.style.display = "";

return;

}

row.style.display =
row.innerText.toLowerCase()
.includes(filter)

?

""

:

"none";

});

}
function exportCSV(){

    let shipments =
    JSON.parse(
    localStorage.getItem("shipments")
    ) || [];

    let csv =
    "ID,Sender,Receiver,Origin,Destination,Status\n";

    shipments.forEach(shipment=>{

        csv +=
        `${shipment.id},
${shipment.sender},
${shipment.receiver},
${shipment.origin},
${shipment.destination},
${shipment.status}\n`;

    });

    let blob =
    new Blob([csv],
    {type:"text/csv"});

    let link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "shipments.csv";

    link.click();

}
function exportToExcel(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

if(shipments.length === 0){

alert("No shipment data");

return;

}

let csv =

"ID,Sender,Receiver,Origin,Destination,Weight,Package Type,Priority,Cost,Status\n";

shipments.forEach(shipment=>{

csv +=

`${shipment.id},
${shipment.sender},
${shipment.receiver},
${shipment.origin},
${shipment.destination},
${shipment.weight},
${shipment.packageType},
${shipment.priority},
${shipment.cost},
${shipment.status}\n`;

});

let blob = new Blob(
[csv],
{
type:"text/csv"
}
);

let url =
window.URL.createObjectURL(blob);

let a =
document.createElement("a");

a.href = url;

a.download =
"INI_Shipments.csv";

a.click();

}
function updateStatus(index, status){

    let shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    shipments[index].status = element.value;

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

    setStatusColor(element);
    loadShipments();

    showToast("Shipment status updated successfully!");
}
document.querySelectorAll(".status-dropdown").forEach(select=>{
    setStatusColor(select)
});


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
