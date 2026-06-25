function loadDashboard(){

document.getElementById(
"welcomeMessage"
).innerHTML =
"Welcome Back, Logistics Administrator";

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let total =
shipments.length;

let delivered =
shipments.filter(
s => s.status === "Delivered"
).length;

let transit =
shipments.filter(
s => s.status === "In Transit"
).length;

let pending =
total - delivered - transit;

document.getElementById(
"totalShipments"
).innerText = total;

document.getElementById(
"deliveredShipments"
).innerText = delivered;

document.getElementById(
"transitShipments"
).innerText = transit;

document.getElementById(
"pendingShipments"
).innerText = pending;

/* Recent Shipments */

let table =
document.getElementById(
"recentTable"
);

if(table){

table.innerHTML="";

shipments
.slice(-5)
.reverse()
.forEach(shipment=>{

table.innerHTML += `
<tr>
<td>${shipment.id}</td>
<td>${shipment.sender}</td>
<td>${shipment.receiver}</td>
<td>${shipment.destination}</td>
<td>${shipment.status}</td>
</tr>
`;

});

}

if(shipments.length === 0){

table.innerHTML = `
<tr>
<td colspan="5">
No Shipments Available
</td>
</tr>
`;

}

/* Chart */

let chartCanvas =
document.getElementById(
"shipmentChart"
);

if(chartCanvas){

new Chart(chartCanvas,{

type:"pie",

data:{

labels:[
"Delivered",
"In Transit",
"Pending"
],

datasets:[{

data:[
delivered,
transit,
pending
]

}]

}

});

}

}
window.onload = function(){

if(
window.location.pathname
.includes("dashboard.html")
){

loadDashboard();

}

if(
window.location.pathname
.includes("shipment.html")
){

initializeShipmentPage();

}

if(
window.location.pathname
.includes("shipments.html")
){

loadShipments();

}

};

if(shipments.length === 0){

document.getElementById(
"recentTable"
).innerHTML = `

<tr>
<td colspan="5">

No Recent Shipments

</td>
</tr>

`;

}

document.getElementById(
"currentDate"
).innerHTML =
new Date().toDateString();

let revenue = 0;

shipments.forEach(s=>{

revenue += Number(
s.cost || 0
);

});

document.getElementById(
"totalRevenue"
).innerText =
"₹" + revenue;

new Chart(

document.getElementById(
"revenueChart"
),

{
type:"doughnut",

data:{
labels:[
"Revenue",
"Remaining"
],

datasets:[{
data:[
revenue,
100000 - revenue
]
}]
}

});
let customers =
JSON.parse(
localStorage.getItem(
"customers"
)
) || [];

document.getElementById(
"totalCustomers"
).innerText =
customers.length;

const counters =
document.querySelectorAll(".counter");

counters.forEach(counter=>{

const update=()=>{

const target =
+counter.dataset.target;

const count =
+counter.innerText;

const speed = target/100;

if(count < target){
counter.innerText =
Math.ceil(count + speed);
setTimeout(update,20);
}else{
counter.innerText = target;
}

};

update();

});
