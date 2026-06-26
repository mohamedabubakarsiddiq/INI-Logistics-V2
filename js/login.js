function login(){

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value.trim();

    const error =
    document.getElementById("errorMessage");

    error.innerHTML = "";

    if(username === "admin" && password === "admin123"){

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        localStorage.setItem(
            "loggedUser",
            username
        );

        showToast("Login Successful!");

        setTimeout(()=>{

            window.location.href =
            "dashboard.html";

        },800);

    }else{

        error.innerHTML =
        "Invalid username or password.";

        showToast(
            "Invalid username or password",
            "error"
        );

    }

}
