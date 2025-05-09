document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Ensure message container exists
    let messagesContainer = document.querySelector('.messages');
    if (!messagesContainer) {
        messagesContainer = document.createElement('div');
        messagesContainer.className = 'messages';
        const h2Element = document.querySelector('.login-container h2');
        if (h2Element) {
            h2Element.parentNode.insertBefore(messagesContainer, h2Element.nextSibling);
        } else {
            form.parentNode.insertBefore(messagesContainer, form); // fallback
        }
    }

    /**
     * Show user feedback message
     */
    function showMessage(message, type) {
        messagesContainer.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = `alert alert-${type}`; // success | error
        msg.textContent = message;
        messagesContainer.appendChild(msg);
        messagesContainer.style.display = 'block';
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

        if (!username) {
            showMessage("Please enter a username.", "error");
            return;
        }
        if (!password) {
            showMessage("Please enter a password.", "error");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch(form.getAttribute('action') || window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, "success");

                    // Optional: store user role for frontend use
                    if (data.user_role) {
                        sessionStorage.setItem('userRole', data.user_role);
                    }

                    // Ensure redirect updates session state
                    window.location.href = data.redirect_url || '/';
                } else {
                    showMessage(data.message || "Login failed.", "error");
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                showMessage("An unexpected error occurred.", "error");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
});
