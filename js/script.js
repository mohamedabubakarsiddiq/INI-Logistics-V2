function trackHomeShipment(){

let trackingNo =
document.getElementById("trackingNumber").value;

if(trackingNo===""){
alert("Please enter tracking number");
return;
}

window.location.href =
"tracking.html?id=" + trackingNo;

}
const counters =
document.querySelectorAll(".counter");

counters.forEach(counter => {

let updateCounter = () => {

const target =
+counter.getAttribute("data-target");

const current =
+counter.innerText;

const increment =
target / 100;

if(current < target){

counter.innerText =
Math.ceil(current + increment);

setTimeout(updateCounter,20);

}else{

counter.innerText = target;

}

};

updateCounter();

});
let slides =
document.querySelectorAll(".testimonial");

let currentSlide = 0;

setInterval(()=>{

slides[currentSlide]
.classList.remove("active");

currentSlide =
(currentSlide + 1)
% slides.length;

slides[currentSlide]
.classList.add("active");

},3000);
const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document
.querySelectorAll(".hidden")
.forEach(el=>observer.observe(el));
document
.querySelector(".hamburger")
.addEventListener("click",()=>{

document
.querySelector(".nav-links")
.classList.toggle("active");

});


function saveShipment(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let shipment={

id:
document.getElementById("shipmentId").value,

sender:
document.getElementById("sender").value,

receiver:
document.getElementById("receiver").value,

origin:
document.getElementById("origin").value,

destination:
document.getElementById("destination").value,

status:
document.getElementById("status").value

};

shipments.push(shipment);

localStorage.setItem(
"shipments",
JSON.stringify(shipments)
);

showToast(
"Shipment Created Successfully"
);

}
function searchShipment(){

let input =
document
.getElementById("searchBox")
.value
.toLowerCase();

let rows =
document
.querySelectorAll(
"#shipmentTable tr"
);

rows.forEach(row=>{

row.style.display=
row.innerText
.toLowerCase()
.includes(input)

?

""

:

"none";

});

}
function updateStatus(){

// find shipment

// update status

// save back to localStorage

}
function logout(){

sessionStorage.clear();

window.location.href=
"login.html";

}
function login(){

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();

    let error =
        document.getElementById("errorMessage");

    if(username === "admin" &&
       password === "admin123"){

        sessionStorage.setItem(
            "isLoggedIn",
            "true"
        );

        window.location.href =
            "dashboard.html";

    }else{

        error.innerHTML =
            "Invalid username or password";

    }
}

function generateShipmentId(){

return "INI" +
Math.floor(
1000 + Math.random() * 9000
);

}
function initializeShipmentPage(){

let shipmentIdField =
document.getElementById(
"shipmentId"
);

if(shipmentIdField){

shipmentIdField.value =
generateShipmentId();

}

}
function saveShipment(){

let sender =
document.getElementById(
"customerSelect"
).value;

let receiver =
document.getElementById(
"receiver"
).value.trim();

let origin =
document.getElementById(
"origin"
).value.trim();

let destination =
document.getElementById(
"destination"
).value.trim();

let weight =
document.getElementById(
"weight"
).value.trim();

if(
sender === "" ||
receiver === "" ||
origin === "" ||
destination === "" ||
weight === ""
){

alert(
"Please fill all fields"
);

return;

}

let shipment = {

id:
document.getElementById(
"shipmentId"
).value,

sender,
receiver,
origin,
destination,
weight,

status:
document.getElementById(
"status"
).value,

estimatedDelivery:
new Date(
Date.now() + 5 * 24 * 60 * 60 * 1000
).toLocaleDateString(),

createdDate:
new Date()
.toLocaleDateString(),

currentLocation: origin

};

let shipments =
JSON.parse(
localStorage.getItem(
"shipments"
)
) || [];

shipments.push(
shipment
);

localStorage.setItem(
"shipments",
JSON.stringify(shipments)
);

document.getElementById(
"message"
).innerHTML =
"✅ Shipment Created Successfully";

document.getElementById(
"message"
).style.color =
"green";

setTimeout(()=>{

location.reload();

},1500);

}
function checkLogin(){

if(
!sessionStorage.getItem("isLoggedIn")
){

window.location.href =
"login.html";

}



}
function loadShipments(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let table =
document.getElementById(
"shipmentTable"
);

if(!table) return;

table.innerHTML = "";

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

let rate = 0;

if(total > 0){

rate =
Math.round(
(delivered / total) * 100
);

}

document.getElementById(
"deliveryRate"
).innerText =
rate + "%";

table.innerHTML += `
<tr>

<td>${shipment.id}</td>

<td>${shipment.sender}</td>

<td>${shipment.receiver}</td>

<td>${shipment.origin}</td>

<td>${shipment.destination}</td>

<td>${shipment.packageType}</td>

<td>${shipment.weight} KG</td>

<td>${shipment.priority}</td>

<td>₹${shipment.cost}</td>

<td>${shipment.estimatedDelivery}</td>

<td>
<span class="status ${badgeClass}">
${shipment.status}
</span>
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
JSON.parse(
localStorage.getItem("shipments")
) || [];

if(
confirm(
"Delete this shipment?"
)
){

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

let newStatus = prompt(
`Choose Status:

Shipment Created
Picked Up
In Transit
Out For Delivery
Delivered`
);

function editShipment(index){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let newStatus = prompt(
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

localStorage.setItem(
"shipments",
JSON.stringify(shipments)
);

loadShipments();

}


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

});

document.addEventListener("DOMContentLoaded",()=>{

let trackingInput =
document.getElementById("trackingId");

if(trackingInput){

trackingInput.addEventListener(
"keypress",
function(event){

if(event.key==="Enter"){

trackShipment();

}

});

}

});
function copyTrackingId(id){

navigator.clipboard.writeText(id);

alert(
"Tracking ID Copied: " + id
);

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
<h4>Destination</h4>
<p>${shipment.destination}</p>
</div>

<div class="summary-item">
<h4>ETA</h4>
<p>${shipment.estimatedDelivery}</p>
</div>

</div>

<button
class="copy-btn"
onclick="copyTrackingId('${shipment.id}')">
Copy Tracking ID
</button>

<!-- timeline -->

<!-- history table -->

</div>
`;
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

Status: ${shipment.status}

Priority: ${shipment.priority}

Cost: ₹${shipment.cost}`

);

}
function loadCustomerDropdown(){

let customers =
JSON.parse(
localStorage.getItem("customers")
) || [];

let dropdown =
document.getElementById(
"customerSelect"
);

if(!dropdown) return;

customers.forEach(customer=>{

dropdown.innerHTML +=
`<option value="${customer.name}">
${customer.name}
</option>`;

});

}
