function togglePassword(inputId, eyeIconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeIconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

document.getElementById("change-password-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const oldPass = document.getElementById("oldPass").value.trim();
    const newPass = document.getElementById("newPass").value.trim();
    const confirmPass = document.getElementById("confirmPass").value.trim();

    clearMessages();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // if (!loggedInUser) {
    //     showError("No logged in user found.");
    //     return;
    // }

    const userIndex = users.findIndex(user => user.username === loggedInUser.username);

    // if (userIndex === -1) {
    //     showError("User not found.");
    //     return;
    // }

    const user = users[userIndex];

    // Debugging - log stored and entered passwords
    console.log("Entered old password:", oldPass);
    console.log("Stored password:", user.password);

    // If you used password hashing (optional), use this:
    // if (hashPassword(oldPass) !== user.password) {
    if (user.password !== oldPass) {
        showError("Old password is incorrect.");
        return;
    }

    let isValid = true;

    if (newPass.length < 8) {
        showError("New password must be at least 8 characters.");
        isValid = false;
    }

    if (!isStrongPassword(newPass)) {
        showError("Password must include uppercase, lowercase, digit, and special character.");
        isValid = false;
    }

    if (newPass !== confirmPass) {
        showError("New password and confirmation do not match.");
        isValid = false;
    }

    if (oldPass === newPass) {
        showError("New password must be different from old password.");
        isValid = false;
    }

    if (isValid) {
        // If using password hashing:
        // const hashedPassword = hashPassword(newPass);
        // user.password = hashedPassword;
        // loggedInUser.password = hashedPassword;

        user.password = newPass;
        loggedInUser.password = newPass;

        users[userIndex] = user;

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        showSuccess("Password changed successfully!");
        setTimeout(() => location.reload(), 1000);
    }
});

function clearMessages() {
    document.querySelectorAll(".error-message, .success-message").forEach(el => el.remove());
}

function showError(message) {
    const form = document.getElementById("change-password-form");
    const error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.marginTop = "5px";
    error.textContent = message;
    form.prepend(error);
}

function showSuccess(message) {
    const form = document.getElementById("change-password-form");
    const success = document.createElement("div");
    success.className = "success-message";
    success.style.color = "green";
    success.style.marginTop = "5px";
    success.style.fontWeight = "bold";
    success.textContent = message;
    form.prepend(success);
}

function isStrongPassword(password) {
    let lowerCase = false;
    let uppercase = false;
    let isDigit = false;
    let specialChar = false;

    const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?/`~";

    for (let char of password) {
        if (char >= 'a' && char <= 'z') lowerCase = true;
        else if (char >= 'A' && char <= 'Z') uppercase = true;
        else if (char >= '0' && char <= '9') isDigit = true;
        else if (specialChars.includes(char)) specialChar = true;
    }
    return lowerCase && uppercase && isDigit && specialChar;
}

// Optional basic encoding function if you want to hash passwords (not secure, but better than plain text)
function hashPassword(password) {
    return btoa(password); // basic base64 encoding
}
