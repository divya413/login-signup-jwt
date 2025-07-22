// Switch between forms
document.getElementById("show-signup").addEventListener("click", function(){
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function(){
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});

// Check if user is already logged in (token exists)
const token = localStorage.getItem('token');
if(token){
  fetch('http://localhost:3000/profile', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector(".container").innerHTML = `
      <h2>${data.message}</h2>
      <button id="logout-btn">Logout</button>
    `;
    logoutListener();
  });
}

// Signup form submit
document.getElementById("signup-form").addEventListener("submit", function(e){
  e.preventDefault();

  const fullname = document.getElementById("signup-fullname").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if(password !== confirmPassword){
    alert("Passwords do not match!");
    return;
  }

  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if(data.success){
      document.getElementById("signup-form").reset();
      document.getElementById("signup-form").style.display = "none";
      document.getElementById("login-form").style.display = "block";
    }
  });
});

// Login form submit
document.getElementById("login-form").addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      localStorage.setItem('token', data.token);
      document.querySelector(".container").innerHTML = `
        <h2>Hello, ${data.fullname}</h2>
        <button id="logout-btn">Logout</button>
      `;
      logoutListener();
    } else {
      alert(data.message);
    }
  });
});

// Logout function
function logoutListener(){
  document.getElementById("logout-btn").addEventListener("click", function(){
    localStorage.removeItem('token');
    location.reload();
  });
}