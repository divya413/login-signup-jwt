// Switch between forms
document.getElementById("show-login").addEventListener("click", function(){
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});

document.getElementById("show-signup").addEventListener("click", function(){
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
});

// Signup form validation
document.getElementById("signup-form").addEventListener("submit", function(e){
    e.preventDefault();
    let password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("signup-confirm-password").value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
    } else {
        alert("Account created!");
    }
});

// Login form validation
document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
    alert("Login successful!");
});
