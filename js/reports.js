function loadReports(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let total = shipments.length;

let delivered =
shipments.filter(
s => s.status === "Delivered"
).length;

let transit =
shipments.filter(
s => s.status === "In Transit"
).length;

let revenue = 0;

shipments.forEach(s=>{

revenue += Number(s.cost || 0);

});

document.getElementById(
"totalReportsShipments"
).innerText = total;

document.getElementById(
"deliveredReports"
).innerText = delivered;

document.getElementById(
"transitReports"
).innerText = transit;

document.getElementById(
"revenueReports"
).innerText = "₹" + revenue;

createReportChart(
delivered,
transit,
total - delivered - transit
);

}

function createReportChart(
delivered,
transit,
pending
){

new Chart(

document.getElementById(
"reportChart"
),

{
type:"bar",

data:{
labels:[
"Delivered",
"In Transit",
"Pending"
],

datasets:[{
label:"Shipments",
data:[
delivered,
transit,
pending
]
}]
}
});

}

function downloadReport(){

let shipments =
JSON.parse(
localStorage.getItem("shipments")
) || [];

let content =
JSON.stringify(
shipments,
null,
2
);

let blob =
new Blob(
[content],
{type:"application/json"}
);

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"INI_Report.json";

a.click();

}
