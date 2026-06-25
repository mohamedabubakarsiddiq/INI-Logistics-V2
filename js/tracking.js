function trackShipment(){

    

switch(status){

case "Picked Up":
shipment.currentLocation =
shipment.origin;
break;

case "In Transit":
shipment.currentLocation =
"Distribution Center";
break;

case "Out For Delivery":
shipment.currentLocation =
shipment.destination;
break;

case "Delivered":
shipment.currentLocation =
shipment.destination;
break;

}

let trackingId =
document.getElementById(
"trackingId"
).value.trim();

let shipments =
JSON.parse(
localStorage.getItem(
"shipments"
)
) || [];

let shipment =
shipments.find(
s => s.id === trackingId
);

let result =
document.getElementById(
"trackingResult"
);


let status =
shipment.status;

let created =
true;

let picked =
[
"Picked Up",
"In Transit",
"Out For Delivery",
"Delivered"
].includes(status);

let transit =
[
"In Transit",
"Out For Delivery",
"Delivered"
].includes(status);

let delivery =
[
"Out For Delivery",
"Delivered"
].includes(status);

let delivered =
status === "Delivered";

result.innerHTML = `

<div class="tracking-card">

<h2>${shipment.id}</h2>

<p>
<strong>Sender:</strong>
${shipment.sender}
</p>

<p>
<strong>Receiver:</strong>
${shipment.receiver}
</p>

<p>
<strong>Origin:</strong>
${shipment.origin}
</p>

<p>
<strong>Destination:</strong>
${shipment.destination}
</p>

<div class="timeline">

<div class="step ${created ? "active" : ""}">
✓ Shipment Created
</div>

<div class="step ${picked ? "active" : ""}">
✓ Picked Up
</div>

<div class="step ${transit ? "active" : ""}">
✓ In Transit
</div>

<div class="step ${delivery ? "active" : ""}">
✓ Out For Delivery
</div>

<div class="step ${delivered ? "active" : ""}">
✓ Delivered
</div>

</div>

</div>

`;

let badgeClass = "";

switch(status){

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

let progress = 20;

switch(status){

case "Picked Up":
progress = 40;
break;

case "In Transit":
progress = 60;
break;

case "Out For Delivery":
progress = 80;
break;

case "Delivered":
progress = 100;
break;

}

setTimeout(()=>{

document.getElementById(
"progressBar"
).style.width =
progress + "%";

},100);

}
window.addEventListener("load", () => {

    const trackingField =
        document.getElementById("trackingId");

    if(trackingField){

        let params =
            new URLSearchParams(window.location.search);

        let id = params.get("id");

        if(id){

            trackingField.value = id;

            trackShipment();

        }
    }

    let progress = 20;

switch(shipment.status){

case "Picked Up":
progress = 40;
break;

case "In Transit":
progress = 60;
break;

case "Out For Delivery":
progress = 80;
break;

case "Delivered":
progress = 100;
break;

}

result.innerHTML = `

<div class="tracking-card">

<div class="summary-grid">

<div class="summary-item">
<h4>Tracking ID</h4>
<p>${shipment.id}</p>
</div>

<div class="summary-item">
<h4>Status</h4>
<p>${shipment.status}</p>
</div>

<div class="summary-item">
<h4>Current Location</h4>
<p>${shipment.currentLocation}</p>
</div>

<div class="summary-item">
<h4>ETA</h4>
<p>${shipment.estimatedDelivery}</p>
</div>

</div>

<div class="progress-container">

<div
class="progress-bar"
style="width:${progress}%">
</div>

</div>

<button
class="copy-btn"
onclick="copyTrackingId('${shipment.id}')">

Copy Tracking ID

</button>

</div>

`;

});
function copyTrackingId(id){

navigator.clipboard.writeText(id);

alert(
"Tracking ID Copied: " + id
);

}
