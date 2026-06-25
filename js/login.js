function login(){

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();

    let error =
        document.getElementById("errorMessage");

    if(
        username === "admin" &&
        password === "admin123"
    ){

        sessionStorage.setItem(
            "isLoggedIn",
            "true"
        );

        window.location.href =
            "dashboard.html";

    }else{

        error.innerHTML =
            "Invalid username or password";

    }

}
