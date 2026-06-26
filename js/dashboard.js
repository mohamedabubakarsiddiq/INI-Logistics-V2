/*====================================================
    INI Logistics Dashboard
    dashboard.js - Part 1
====================================================*/

let revenueChart = null;
let shipmentChart = null;

/*=========================================
    Dashboard Loader
=========================================*/

function loadDashboard(){

    try{

        const shipments =
        JSON.parse(localStorage.getItem("shipments")) || [];

        const customers =
        JSON.parse(localStorage.getItem("customers")) || [];

        updateDashboardCards(shipments, customers);

        loadRecentShipments(shipments);

        loadRecentActivity(shipments);

        createRevenueChart(shipments);

        createShipmentChart(shipments);

        updateCurrentDate();

        updateLastUpdated();

    }

    catch(error){

        console.error(error);

        showToast("Unable to load dashboard.");

    }

}

/*=========================================
    Dashboard Cards
=========================================*/

function updateDashboardCards(shipments, customers){

    const total =
    shipments.length;

    const delivered =
    shipments.filter(s=>s.status==="Delivered").length;

    const transit =
    shipments.filter(s=>s.status==="In Transit").length;

    const pending =
    shipments.filter(s=>
        s.status==="Shipment Created" ||
        s.status==="Picked Up" ||
        s.status==="Out For Delivery"
    ).length;

    const today =
    getTodayShipments(shipments);

    const revenue =
    calculateRevenue(shipments);

    const rate =
    total===0
    ?0
    :Math.round((delivered/total)*100);

    animateCounter(
        "totalShipments",
        total
    );

    animateCounter(
        "deliveredShipments",
        delivered
    );

    animateCounter(
        "transitShipments",
        transit
    );

    animateCounter(
        "pendingShipments",
        pending
    );

    animateCounter(
        "todayShipments",
        today
    );

    animateCounter(
        "totalCustomers",
        customers.length
    );

    document.getElementById(
        "deliveryRate"
    ).innerText = rate + "%";

    document.getElementById(
        "totalRevenue"
    ).innerText =
    "₹" + revenue.toLocaleString("en-IN");

}

/*=========================================
    Revenue
=========================================*/

function calculateRevenue(shipments){

    return shipments.reduce((sum, shipment)=>{

        return sum +
        Number(shipment.cost || 0);

    },0);

}

/*=========================================
    Today's Shipments
=========================================*/

function getTodayShipments(shipments){

    const today =
    new Date().toISOString().split("T")[0];

    return shipments.filter(shipment=>{

        return shipment.date === today;

    }).length;

}

/*=========================================
    Counter Animation
=========================================*/

function animateCounter(id, value){

    const element =
    document.getElementById(id);

    if(!element) return;

    let current = 0;

    const increment =
    Math.max(1, Math.ceil(value/40));

    const timer =
    setInterval(()=>{

        current += increment;

        if(current >= value){

            current = value;

            clearInterval(timer);

        }

        element.innerText =
        current.toLocaleString("en-IN");

    },20);

}

/*=========================================
    Date
=========================================*/

function updateCurrentDate(){

    const element =
    document.getElementById("currentDate");

    if(!element) return;

    element.innerText =
    new Date().toLocaleDateString(
        "en-IN",
        {
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );

}

/*=========================================
    Last Updated
=========================================*/

function updateLastUpdated(){

    const element =
    document.getElementById("lastUpdated");

    if(!element) return;

    element.innerText =
    "Last Updated : " +
    new Date().toLocaleTimeString();

}
/*====================================================
    Charts
====================================================*/

/*=========================================
    Monthly Revenue Chart
=========================================*/

function createRevenueChart(shipments){

    const ctx =
    document.getElementById("revenueChart");

    if(!ctx) return;

    const monthlyRevenue =
    new Array(12).fill(0);

    shipments.forEach(shipment=>{

        const amount =
        Number(shipment.cost || 0);

        let month =
        new Date().getMonth();

        if(shipment.date){

            const d =
            new Date(shipment.date);

            if(!isNaN(d)){
                month = d.getMonth();
            }

        }

        monthlyRevenue[month] += amount;

    });

    if(revenueChart){

        revenueChart.destroy();

    }

    revenueChart =
    new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
            ],

            datasets:[{

                label:"Revenue",

                data:monthlyRevenue,

                borderWidth:1,

                borderRadius:8,

                backgroundColor:[
                    "#0d6efd","#0d6efd","#0d6efd",
                    "#0d6efd","#0d6efd","#0d6efd",
                    "#198754","#198754","#198754",
                    "#198754","#198754","#198754"
                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}

/*=========================================
    Shipment Status Chart
=========================================*/

function createShipmentChart(shipments){

    const ctx =
    document.getElementById("shipmentChart");

    if(!ctx) return;

    const created =
    shipments.filter(s=>s.status==="Shipment Created").length;

    const picked =
    shipments.filter(s=>s.status==="Picked Up").length;

    const transit =
    shipments.filter(s=>s.status==="In Transit").length;

    const delivery =
    shipments.filter(s=>s.status==="Out For Delivery").length;

    const delivered =
    shipments.filter(s=>s.status==="Delivered").length;

    if(shipmentChart){

        shipmentChart.destroy();

    }

    shipmentChart =
    new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[

                "Created",
                "Picked Up",
                "In Transit",
                "Out For Delivery",
                "Delivered"

            ],

            datasets:[{

                data:[

                    created,
                    picked,
                    transit,
                    delivery,
                    delivered

                ],

                backgroundColor:[

                    "#6c757d",
                    "#17a2b8",
                    "#0d6efd",
                    "#fd7e14",
                    "#198754"

                ],

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    position:"bottom"
                }

            }

        }

    });

}

/*=========================================
    Refresh Dashboard
=========================================*/

function refreshDashboard(){

    showLoader();

    setTimeout(()=>{

        loadDashboard();

        hideLoader();

        showToast(
            "Dashboard refreshed successfully!"
        );

    },700);

}

/*=========================================
    Auto Refresh
=========================================*/

setInterval(()=>{

    if(document.visibilityState==="visible"){

        loadDashboard();

    }

},60000);
/*====================================================
    Recent Shipments
====================================================*/

function loadRecentShipments(shipments){

    const table =
    document.getElementById("recentTable");

    if(!table) return;

    table.innerHTML = "";

    if(shipments.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="5">
                No Shipments Available
            </td>
        </tr>
        `;

        return;
    }

    const recent =
    [...shipments].reverse().slice(0,5);

    recent.forEach(shipment=>{

        table.innerHTML += `

        <tr>

            <td>${shipment.id}</td>

            <td>${shipment.sender}</td>

            <td>${shipment.receiver}</td>

            <td>${shipment.destination}</td>

            <td>

                <span class="status-badge ${getStatusClass(shipment.status)}">

                    ${shipment.status}

                </span>

            </td>

        </tr>

        `;

    });

}

/*====================================================
    Recent Activity
====================================================*/

function loadRecentActivity(shipments){

    const feed =
    document.getElementById("activityFeed");

    if(!feed) return;

    feed.innerHTML = "";

    if(shipments.length === 0){

        feed.innerHTML = `

        <div class="activity-item">

            <div class="activity-icon">

                📦

            </div>

            <div>

                <h4>

                    No Recent Activity

                </h4>

                <p>

                    Create your first shipment.

                </p>

            </div>

        </div>

        `;

        return;

    }

    [...shipments]
    .reverse()
    .slice(0,5)
    .forEach(shipment=>{

        feed.innerHTML += `

        <div class="activity-item">

            <div class="activity-icon">

                🚚

            </div>

            <div>

                <h4>

                    ${shipment.id}

                </h4>

                <p>

                    ${shipment.sender}

                    →

                    ${shipment.receiver}

                </p>

                <small>

                    ${shipment.status}

                </small>

            </div>

        </div>

        `;

    });

}

/*====================================================
    Status Badge
====================================================*/

function getStatusClass(status){

    switch(status){

        case "Shipment Created":
            return "created";

        case "Picked Up":
            return "picked";

        case "In Transit":
            return "transit";

        case "Out For Delivery":
            return "delivery";

        case "Delivered":
            return "delivered";

        default:
            return "";
    }

}

/*====================================================
    Notifications
====================================================*/

function showNotification(){

    const shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    const pending =
    shipments.filter(s=>s.status !== "Delivered").length;

    showToast(

        pending===0

        ?

        "🎉 All shipments delivered."

        :

        `${pending} shipment(s) require attention.`

    );

}

/*====================================================
    Update Notification Count
====================================================*/

function updateNotificationCount(){

    const shipments =
    JSON.parse(localStorage.getItem("shipments")) || [];

    const pending =
    shipments.filter(
        s=>s.status!=="Delivered"
    ).length;

    const badge =
    document.getElementById("notifyCount");

    if(badge){

        badge.innerText = pending;

    }

}

/*====================================================
    Dashboard Initialization
====================================================*/

window.addEventListener("load",()=>{

    updateNotificationCount();

    loadDashboard();

});

/*====================================================
    Dashboard Refresh Button
====================================================*/

document.addEventListener("visibilitychange",()=>{

    if(document.visibilityState==="visible"){

        loadDashboard();

    }

});

/*====================================================
    End dashboard.js
====================================================*/
