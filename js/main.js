// js/main.js

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
    const toast = document.getElementById("toast");
    if(!toast) return; // guard
    toast.innerHTML = message;
    toast.style.display = "block";

    setTimeout(()=>{
        toast.style.display = "none";
    },3000);
}

function toggleTheme(){
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode"));
}

// Use addEventListener to avoid overwriting other load handlers (e.g., dashboard.js)
window.addEventListener('load', () => {
    if(localStorage.getItem("theme") === "true"){
        document.body.classList.add("dark-mode");
    }
});

function sendMessage(){
    showToast("Message Sent Successfully!");
    const form = document.querySelector(".contact-form form");
    if(form) form.reset();
}

function showNotification(){
    let count = Number(localStorage.getItem("notifyCount") || 0);
    count++;
    localStorage.setItem("notifyCount", count);
    const el = document.getElementById("notifyCount");
    if(el) el.innerText = count;
}

// Mobile hamburger nav
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// Reveal hidden elements on scroll
const hiddenElements = document.querySelectorAll(".hidden");
window.addEventListener("scroll", () => {
    hiddenElements.forEach((element) => {
        const top = element.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            element.classList.add("show");
        }
    });
});

// On DOM ready, reveal any elements marked hidden (non-blocking)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".hidden").forEach(el => {
        el.classList.add("show");
    });
});
