/*====================================================
    INI Logistics
    login.js - Part 1
====================================================*/

/*=========================================
    Initialize Login Page
=========================================*/

window.addEventListener("load", () => {

    hideLoader();

    loadRememberedUser();

    document
        .getElementById("loginForm")
        .addEventListener("submit", loginUser);

});

/*=========================================
    Login
=========================================*/

function loginUser(event){

    event.preventDefault();

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    const remember =
    document.getElementById("rememberMe").checked;

    const loginBtn =
    document.getElementById("loginBtn");

    const error =
    document.getElementById("errorMessage");

    error.innerHTML = "";

    if(username === ""){

        error.innerHTML = "Username is required.";

        showToast(
            "Enter username",
            "warning"
        );

        return;

    }

    if(password === ""){

        error.innerHTML = "Password is required.";

        showToast(
            "Enter password",
            "warning"
        );

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML =

    `<i class="fa-solid fa-spinner fa-spin"></i>
     Logging in...`;

    setTimeout(()=>{

        if(
            username === "admin" &&
            password === "admin123"
        ){

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "loggedUser",
                username
            );

            if(remember){

                localStorage.setItem(
                    "rememberedUser",
                    username
                );

            }else{

                localStorage.removeItem(
                    "rememberedUser"
                );

            }

            showToast(
                "Login Successful!"
            );

            setTimeout(()=>{

                window.location.href =
                "dashboard.html";

            },800);

        }else{

            loginBtn.disabled = false;

            loginBtn.innerHTML =

            `<i class="fa-solid fa-right-to-bracket"></i>
             <span>Login</span>`;

            error.innerHTML =
            "Invalid username or password.";

            showToast(
                "Invalid username or password",
                "error"
            );

        }

    },1000);

}

/*=========================================
    Remember Username
=========================================*/

function loadRememberedUser(){

    const remembered =
    localStorage.getItem(
        "rememberedUser"
    );

    if(remembered){

        document.getElementById(
            "username"
        ).value = remembered;

        document.getElementById(
            "rememberMe"
        ).checked = true;

    }

}

/*====================================================
    INI Logistics
    login.js - Part 2
====================================================*/

/*=========================================
    Show / Hide Password
=========================================*/

function togglePassword(){

    const password =
    document.getElementById("password");

    const eyeIcon =
    document.getElementById("eyeIcon");

    if(password.type === "password"){

        password.type = "text";

        eyeIcon.classList.remove("fa-eye");

        eyeIcon.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        eyeIcon.classList.remove("fa-eye-slash");

        eyeIcon.classList.add("fa-eye");

    }

}

/*=========================================
    Forgot Password
=========================================*/

function forgotPassword(){

    showToast(
        "Please contact the system administrator.",
        "warning"
    );

}

/*=========================================
    Clear Error While Typing
=========================================*/

document
.getElementById("username")
.addEventListener("input", clearError);

document
.getElementById("password")
.addEventListener("input", clearError);

function clearError(){

    document.getElementById(
        "errorMessage"
    ).innerHTML = "";

}

/*=========================================
    Enter Key Support
=========================================*/

document.addEventListener(
"keydown",
function(event){

    if(event.key === "Enter"){

        const form =
        document.getElementById(
            "loginForm"
        );

        if(document.activeElement.form === form){

            event.preventDefault();

            form.requestSubmit();

        }

    }

});

/*=========================================
    Auto Redirect
=========================================*/

function checkExistingLogin(){

    if(localStorage.getItem("loggedIn")==="true"){

        window.location.href =
        "dashboard.html";

    }

}

/*=========================================
    Auto Focus
=========================================*/

window.addEventListener("load",()=>{

    checkExistingLogin();

    document.getElementById(
        "username"
    ).focus();

});

/*=========================================
    Developer Shortcut
=========================================*/

document.addEventListener(
"keydown",
function(event){

    if(event.ctrlKey && event.key==="d"){

        event.preventDefault();

        document.getElementById(
            "username"
        ).value = "admin";

        document.getElementById(
            "password"
        ).value = "admin123";

        showToast(
            "Demo credentials filled."
        );

    }

});

/*=========================================
    Version
=========================================*/

console.log(
    "INI Logistics Login Module v2.0"
);

/*====================================================
    End login.js
====================================================*/
