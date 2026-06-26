/*====================================================
    INI Logistics
    main.js - Part 1
====================================================*/

/*=========================================
    Session Management
=========================================*/

function loginUser(event){

    event.preventDefault();

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    if(username === "admin" && password === "admin123"){

        localStorage.setItem("loggedIn","true");

        localStorage.setItem("loggedUser",username);

        showToast("Login Successful");

        setTimeout(()=>{

            window.location.href="dashboard.html";

        },1000);

    }else{

        showToast("Invalid Username or Password","error");

    }

}

function checkLogin(){

    if(localStorage.getItem("loggedIn") !== "true"){

        window.location.href="index.html";

    }

}

function logout(){

    if(!confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loggedUser");

    window.location.href="index.html";

}

function checkLogin(){

    const loggedIn =
    localStorage.getItem("loggedIn");

    if(loggedIn !== "true"){

        window.location.href = "index.html";

    }

}

/*=========================================
    Loader
=========================================*/

function showLoader(){

    const loader =
    document.getElementById("loader");

    if(loader){

        loader.style.display = "block";

    }

}

function hideLoader(){

    const loader =
    document.getElementById("loader");

    if(loader){

        loader.style.display = "none";

    }

}

/*=========================================
    Toast Notification
=========================================*/

function showToast(message, type="success"){

    const toast =
    document.getElementById("toast");

    if(!toast){

        alert(message);

        return;

    }

    toast.innerText = message;

    toast.className = "show";

    switch(type){

        case "success":

            toast.style.background = "#198754";

            break;

        case "error":

            toast.style.background = "#dc3545";

            break;

        case "warning":

            toast.style.background = "#fd7e14";

            break;

        default:

            toast.style.background = "#0d6efd";

    }

    setTimeout(()=>{

        toast.className = "";

    },3000);

}

/*=========================================
    Theme
=========================================*/

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    const dark =
    document.body.classList.contains(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );

}

function loadTheme(){

    const theme =
    localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }

}

/*=========================================
    Page Loading
=========================================*/

window.addEventListener("load",()=>{

    loadTheme();

    hideLoader();

});

/*=========================================
    Common Confirmation
=========================================*/

function confirmAction(message){

    return confirm(
        message || "Are you sure?"
    );

}
/*====================================================
    INI Logistics
    main.js - Part 2
====================================================*/

/*=========================================
    Shipment Storage
=========================================*/

function getShipments(){

    return JSON.parse(
        localStorage.getItem("shipments")
    ) || [];

}

function saveShipments(shipments){

    localStorage.setItem(
        "shipments",
        JSON.stringify(shipments)
    );

}

/*=========================================
    Customer Storage
=========================================*/

function getCustomers(){

    return JSON.parse(
        localStorage.getItem("customers")
    ) || [];

}

function saveCustomers(customers){

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

}

/*=========================================
    Generate Shipment ID
=========================================*/

function generateShipmentID(){

    const date =
    new Date();

    const year =
    date.getFullYear();

    const random =
    Math.floor(
        1000 +
        Math.random() * 9000
    );

    return `INI-${year}-${random}`;

}

/*=========================================
    Currency Formatter
=========================================*/

function formatCurrency(amount){

    return "₹" +
    Number(amount || 0)
    .toLocaleString("en-IN");

}

/*=========================================
    Date Formatter
=========================================*/

function formatDate(date){

    if(!date) return "-";

    return new Date(date)
    .toLocaleDateString(
        "en-IN",
        {
            day:"2-digit",
            month:"short",
            year:"numeric"
        }
    );

}

/*=========================================
    Time Formatter
=========================================*/

function formatTime(date){

    return new Date(date)
    .toLocaleTimeString(
        "en-IN",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}

/*=========================================
    Refresh Page
=========================================*/

function refreshPage(){

    location.reload();

}

/*=========================================
    Reset Form
=========================================*/

function resetForm(formId){

    const form =
    document.getElementById(formId);

    if(form){

        form.reset();

    }

}

/*=========================================Required Field Validation=========================================*/

function validateRequiredFields(formId){

    const form =
    document.getElementById(formId);

    if(!form) return true;

    const fields =
    form.querySelectorAll(
        "[required]"
    );

    for(const field of fields){

        if(field.value.trim()===""){

            field.focus();

            showToast(
                `${field.name || field.id} is required`,
                "warning"
            );

            return false;

        }

    }

    return true;

}

/*=========================================Search Helper========================================*/

function searchTable(inputId, tableId){

    const input =
    document
    .getElementById(inputId)
    .value
    .toLowerCase();

    const rows =
    document.querySelectorAll(
        `#${tableId} tr`
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

/*========================================Debounce=========================================*/

function debounce(func, delay){

    let timer;

    return function(){

        clearTimeout(timer);

        timer =
        setTimeout(

            ()=>func.apply(this,arguments),

            delay

        );

    };

}
/*====================================================
    INI Logistics
    main.js - Part 3
====================================================*/

/*=========================================
    Internet Status
=========================================*/

window.addEventListener("online",()=>{

    showToast(
        "Internet connection restored.",
        "success"
    );

});

window.addEventListener("offline",()=>{

    showToast(
        "You are offline.",
        "warning"
    );

});

/*=========================================
    Browser Notification
=========================================*/

function notify(title,message){

    if(!("Notification" in window)) return;

    if(Notification.permission==="granted"){

        new Notification(title,{
            body:message,
            icon:"images/logo.png"
        });

    }
    else if(Notification.permission!=="denied"){

        Notification.requestPermission();

    }

}

/*=========================================
    Storage Statistics
=========================================*/

function getStorageStatistics(){

    const shipments = getShipments();

    const customers = getCustomers();

    return{

        shipments:shipments.length,

        customers:customers.length,

        revenue:shipments.reduce(
            (sum,s)=>sum+Number(s.cost||0),
            0
        )

    };

}

/*=========================================
    Export Local Storage Backup
=========================================*/

function backupApplicationData(){

    const backup = {

        shipments:getShipments(),

        customers:getCustomers(),

        exportedOn:new Date().toISOString()

    };

    const blob = new Blob(

        [JSON.stringify(backup,null,2)],

        {type:"application/json"}

    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "INI_Logistics_Backup.json";

    link.click();

    showToast(
        "Backup downloaded successfully."
    );

}

/*=========================================
    Clear Application Data
=========================================*/

function clearApplicationData(){

    if(!confirmAction(
        "Delete all shipment and customer data?"
    )) return;

    localStorage.removeItem("shipments");

    localStorage.removeItem("customers");

    showToast(
        "Application data cleared.",
        "warning"
    );

    setTimeout(()=>{

        location.reload();

    },1000);

}

/*=========================================
    Keyboard Shortcuts
=========================================*/

document.addEventListener("keydown",(event)=>{

    if(event.ctrlKey && event.key==="r"){

        event.preventDefault();

        refreshPage();

    }

    if(event.ctrlKey && event.key==="l"){

        event.preventDefault();

        logout();

    }

});

/*=========================================
    Application Initializer
=========================================*/

function initializeApplication(){

    loadTheme();

    hideLoader();

    console.log(

        "%cINI Logistics v2.0",

        "color:#0d6efd;font-size:18px;font-weight:bold"

    );

}

window.addEventListener("load",initializeApplication);

/*=========================================
    Global Error Handler
=========================================*/

window.onerror=function(message,file,line){

    console.error(

        "Application Error:",

        message,

        file,

        line

    );

    showToast(

        "Unexpected error occurred.",

        "error"

    );

};

/*=========================================
    Utility Helpers
=========================================*/

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

function copyToClipboard(text){

    navigator.clipboard.writeText(text);

    showToast(

        "Copied to clipboard."

    );

}

/*=========================================
    Version
=========================================*/

const APP_VERSION = "2.0.0";

console.log(
    "INI Logistics Version:",
    APP_VERSION
);

/*====================================================
    End of main.js
====================================================*/
