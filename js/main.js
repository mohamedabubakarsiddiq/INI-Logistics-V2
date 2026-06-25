// Logout

function logout(){

    sessionStorage.clear();

    window.location.href = "login.html";

}

// Login Protection

function checkLogin(){

    if(!sessionStorage.getItem("isLoggedIn")){

        window.location.href = "login.html";

    }

}
function showToast(message){

let toast =
document.getElementById("toast");

toast.innerHTML = message;

toast.style.display = "block";

setTimeout(()=>{

toast.style.display = "none";

},3000);

}
function toggleTheme(){

document.body.classList.toggle(
"dark-mode"
);

localStorage.setItem(
"theme",
document.body.classList.contains(
"dark-mode"
)
);

}
window.onload = () => {

if(
localStorage.getItem("theme")
=== "true"
){

document.body.classList.add(
"dark-mode"
);

}

};
function sendMessage(){

showToast(
"Message Sent Successfully!"
);

document.querySelector(
".contact-form form"
).reset();

}
function showNotification(){

let count =
localStorage.getItem(
"notifyCount"
) || 0;

count++;

localStorage.setItem(
"notifyCount",
count
);

document.getElementById(
"notifyCount"
).innerText =
count;

}
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
