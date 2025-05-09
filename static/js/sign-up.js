document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const email = document.getElementById('email').value.trim();
        const accountType = document.querySelector('input[name="account_type"]:checked').value;
        
        // Client-side validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
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
        
        // Prepare data for AJAX request
        const formData = {
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            email: email,
            accountType: accountType
        };
        
        // Get CSRF token
        const csrftoken = getCookie('csrftoken');
        
        // Send AJAX request to server
        fetch('/Sign-Up.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = "/Login.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during sign up. Please try again.');
        });
    });
    
    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});