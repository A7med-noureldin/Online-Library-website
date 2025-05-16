// Create a broadcast channel for communication between pages
const bookChannel = new BroadcastChannel('book_updates');

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
            
            // If this is an add book form, update the browse page
            if (form.id === 'add-book-form') {
                // Create a new book element
                const bookElement = document.createElement('div');
                bookElement.className = 'book-item';
                
                const imgSrc = data.book.cover_image || '/static/images/default-book-image.png';
                
                bookElement.innerHTML = `
                    <div class="img-container">
                        <img src="${imgSrc}" alt="${data.book.title}">
                    </div>
                    <div class="content1">
                        <h4>${data.book.title}</h4>
                    </div>
                    <div class="Author">
                        <p>By ${data.book.author}</p>
                    </div>
                    <div class="content1_1">
                        <p>Available</p>
                    </div>
                `;

                bookElement.addEventListener('click', () => {
                    localStorage.setItem('selectedBook', JSON.stringify(data.book));
                    window.location.href = '/Details.html';
                });

                // Add the new book to the browse page
                const booksContainer = document.getElementById('books-container');
                if (booksContainer) {
                    booksContainer.appendChild(bookElement);
                }

                // Reset the form
                form.reset();
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                }

                // Broadcast the new book to all open pages
                bookChannel.postMessage({
                    type: 'new_book',
                    book: data.book
                });
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

    // Listen for book updates from other pages
    bookChannel.onmessage = function(event) {
        if (event.data.type === 'new_book') {
            const book = event.data.book;
            
            // If we're on the browse page, add the new book
            const booksContainer = document.getElementById('books-container');
            if (booksContainer) {
                const bookElement = document.createElement('div');
                bookElement.className = 'book-item';
                
                const imgSrc = book.cover_image || '/static/images/default-book-image.png';
                
                bookElement.innerHTML = `
                    <div class="img-container">
                        <img src="${imgSrc}" alt="${book.title}">
                    </div>
                    <div class="content1">
                        <h4>${book.title}</h4>
                    </div>
                    <div class="Author">
                        <p>By ${book.author}</p>
                    </div>
                    <div class="content1_1">
                        <p>Available</p>
                    </div>
                `;

                bookElement.addEventListener('click', () => {
                    localStorage.setItem('selectedBook', JSON.stringify(book));
                    window.location.href = '/Details.html';
                });

                booksContainer.appendChild(bookElement);
            }
        }
    };
}); 
