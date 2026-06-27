/*====================================================
    INI Logistics
    login.js
====================================================*/

window.addEventListener("load", () => {

    hideLoader();

    checkExistingLogin();

    loadRememberedUser();

    document
        .getElementById("username")
        .focus();

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

    if(username===""){

        error.innerHTML="Please enter username.";

        showToast(
            "Username is required.",
            "warning"
        );

        return;

    }

    if(password===""){

        error.innerHTML="Please enter password.";

        showToast(
            "Password is required.",
            "warning"
        );

        return;

    }

    loginBtn.disabled=true;

    loginBtn.innerHTML=`
    <i class="fas fa-spinner fa-spin"></i>
    Logging in...
    `;

    showLoader();

    setTimeout(()=>{

        hideLoader();

      const success = login(username, password);

if (success) {

    if (remember) {

        localStorage.setItem(
            "rememberedUser",
            username
        );

    } else {

        localStorage.removeItem(
            "rememberedUser"
        );

    }

    return;

}

loginBtn.disabled = false;

loginBtn.innerHTML = `
<i class="fas fa-right-to-bracket"></i>
<span>Login</span>
`;

error.innerHTML = "Invalid username or password.";

            showToast(
                "Login Successful!",
                "success"
            );

            setTimeout(()=>{

                window.location.href=
                "dashboard.html";

            },800);

        }

        else{

            loginBtn.disabled=false;

            loginBtn.innerHTML=`
            <i class="fas fa-right-to-bracket"></i>
            <span>Login</span>
            `;

            error.innerHTML=
            "Invalid username or password.";

            showToast(
                "Invalid username or password.",
                "error"
            );

            document
            .getElementById("password")
            .value="";

            document
            .getElementById("password")
            .focus();

        }

    },1000);

}

/*=========================================
    Show / Hide Password
=========================================*/

function togglePassword(){

    const password =
    document.getElementById("password");

    const icon =
    document.getElementById("eyeIcon");

    if(password.type==="password"){

        password.type="text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }

    else{

        password.type="password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}

/*=========================================
    Forgot Password
=========================================*/

function forgotPassword(){

    alert(
`Demo Login Credentials

Username : admin

Password : admin123

For production,
please contact the system administrator.`);

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

/*=========================================
    Already Logged In
=========================================*/

function checkExistingLogin() {

    if (isLoggedIn()) {

        window.location.href = "dashboard.html";

    }

}

/*=========================================
    Enter Key
=========================================*/

document.addEventListener(
"keydown",

function(event){

    if(event.key==="Enter"){

        const form=
        document.getElementById(
            "loginForm"
        );

        if(document.activeElement.form===form){

            event.preventDefault();

            form.requestSubmit();

        }

    }

});

/*=========================================
    Clear Error While Typing
=========================================*/

document
.getElementById("username")
.addEventListener("input",clearError);

document
.getElementById("password")
.addEventListener("input",clearError);

function clearError(){

    document.getElementById(
        "errorMessage"
    ).innerHTML="";

}

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
        ).value="admin";

        document.getElementById(
            "password"
        ).value="admin123";

        showToast(
            "Demo credentials loaded."
        );

    }

});

/*=========================================
    Version
=========================================*/

console.log(
"INI Logistics Login Module v3.0 Loaded"
);
