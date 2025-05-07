const form = document.getElementById('login-form');

form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    if (password === "") {
        alert("Please enter password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid username or password.");
        return;
    }

    alert("Login successful as " + user.accountType + "!");

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "Home.html";
});
