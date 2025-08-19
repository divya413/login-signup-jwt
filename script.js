// Switch forms
function showForm(formId) {
  ["signup-form","login-form","forgot-form"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(formId).style.display = "block";
}

document.getElementById("show-signup").addEventListener("click", () => showForm("signup-form"));
document.getElementById("show-login").addEventListener("click", () => showForm("login-form"));
document.getElementById("show-login-2").addEventListener("click", () => showForm("login-form"));
document.getElementById("show-forgot").addEventListener("click", () => showForm("forgot-form"));

// Signup
document.getElementById("signup-form").addEventListener("submit", function(e){
  e.preventDefault();
  const fullname = document.getElementById("signup-fullname").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if(data.success) showForm("login-form");
  });
});

// Login
document.getElementById("login-form").addEventListener("submit", function(e){
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      localStorage.setItem('token', data.token);
      document.querySelector(".container").innerHTML = `
        <h2>Hello, ${data.fullname} 👋</h2>
        <p>Welcome to your personal tracker dashboard.</p>
        <button onclick="logout()">Logout</button>
      `;
    } else {
      alert(data.message);
    }
  });
});

// Forgot password
document.getElementById("forgot-form").addEventListener("submit", function(e){
  e.preventDefault();
  const email = document.getElementById("forgot-email").value;

  fetch('/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    showForm("login-form");
  });
});

function logout(){
  localStorage.removeItem('token');
  location.reload();
}
