const form = document.getElementById('signup-form');

const users = JSON.parse(localStorage.getItem('users')) || [];


form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value.trim();
    const accountType = document.querySelector('input[name="account_type"]:checked').value;


    if (username === "") {
        alert("Please enter a username.");
        return;
    }
    if (username.length < 8) {
        alert("Username must be at least 8 characters long.");
        return;
    }
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }


    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        alert("Username or email already exists.");
        return;
    }


    
    alert("Sign up successful as " + accountType + "!");
    

    const newUser = {
        username: username,
        password: password,
        email: email,
        accountType: accountType
    };

    
    users.push(newUser);

    localStorage.setItem('users' , JSON.stringify(users));

    form.reset(); 
    window.location.href = "login.html";
});







