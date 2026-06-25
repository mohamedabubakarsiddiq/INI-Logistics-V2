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
"sender"
).value.trim();



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

let cost =
document.getElementById(
"cost"
).value.trim();

if(
sender === "" ||
receiver === "" ||
origin === "" ||
destination === "" ||
weight === "" ||
cost === ""     
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
senderPhone:
document.getElementById("senderPhone").value,
receiver,
receiverPhone:
document.getElementById("receiverPhone").value,
origin,
destination,
weight,

packageType:
document.getElementById(
"packageType"
).value,

priority:
document.getElementById(
"priority"
).value,

cost:
document.getElementById(
"cost"
).value,

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

notes:
document.getElementById(
"notes"
).value,

currentLocation: origin

};

let shipments =
JSON.parse(
localStorage.getItem(
"shipments"
)   
)
;

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

showNotification();

document.getElementById(
"message"
).style.color =
"green";

setTimeout(()=>{

location.reload();

},1500);

}
