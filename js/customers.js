function saveCustomer(){

let customer = {

name:
document.getElementById(
"customerName"
).value,

email:
document.getElementById(
"customerEmail"
).value,

phone:
document.getElementById(
"customerPhone"
).value

};

let customers =
JSON.parse(
localStorage.getItem(
"customers"
)
) || [];

customers.push(customer);

localStorage.setItem(
"customers",
JSON.stringify(customers)
);

alert(
"Customer Added"
);

location.reload();

}

function loadCustomers(){

let customers =
JSON.parse(
localStorage.getItem(
"customers"
)
) || [];

let table =
document.getElementById(
"customerTable"
);

table.innerHTML = "";

customers.forEach(
(customer,index)=>{

table.innerHTML += `

<tr>

<td>${customer.name}</td>
<td>${customer.email}</td>
<td>${customer.phone}</td>

<td>

<button
onclick="deleteCustomer(${index})">

Delete

</button>

</td>

</tr>

`;

});

}

function deleteCustomer(index){

let customers =
JSON.parse(
localStorage.getItem(
"customers"
)
) || [];

customers.splice(index,1);

localStorage.setItem(
"customers",
JSON.stringify(customers)
);

loadCustomers();

}
function searchCustomer(){

let value =
document.getElementById(
"customerSearch"
).value.toLowerCase();

let rows =
document.querySelectorAll(
"#customerTable tr"
);

rows.forEach(row=>{

row.style.display =

row.innerText
.toLowerCase()
.includes(value)

?

""

:

"none";

});

}
