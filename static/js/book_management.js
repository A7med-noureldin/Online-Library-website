// Function to handle form submission for both add and edit book forms
function handleBookFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const messageDiv = document.getElementById('message');
    const saveBtn = document.getElementById('save-btn');

    // Get description content
    const description = document.getElementById('book-description').innerText;
    formData.set('description', description);

    // If this is an edit form, ensure book_id is included
    if (form.id === 'edit-book-form') {
        const bookId = document.getElementById('book-id').value;
        if (!bookId) {
            messageDiv.textContent = 'Book ID is required.';
            messageDiv.className = 'message error';
            return;
        }
        formData.set('book_id', bookId);
    }

    // Disable save button and show loading state
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Get CSRF token
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Send AJAX request
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message success';
            
            // If redirect URL is provided, redirect after a short delay
            if (data.redirect_url) {
                setTimeout(() => {
                    window.location.href = data.redirect_url;
                }, 1500);
            }
        } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message error';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
    })
    .finally(() => {
        // Re-enable save button
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    });
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const addBookForm = document.getElementById('add-book-form');
    const editBookForm = document.getElementById('edit-book-form');
    const imagePreview = document.getElementById('image-preview');
    const coverInput = document.getElementById('choose-image');

    // Preview image before upload
    if (coverInput) {
        coverInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Add form submit handlers
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleBookFormSubmit);
    }
    if (editBookForm) {
        editBookForm.addEventListener('submit', handleBookFormSubmit);
    }
}); 
