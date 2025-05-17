
document.addEventListener('DOMContentLoaded', function() {
    const bookIdInput = document.getElementById('book-id');
    const bookTitleInput = document.getElementById('book-title');
    const bookAuthorInput = document.getElementById('book-author');
    const bookCategorySelect = document.getElementById('book-category');
    const bookDescriptionDiv = document.getElementById('book-description');
    const chooseImageInput = document.getElementById('choose-image');
    const imagePreview = document.getElementById('image-preview');
    const saveBtn = document.getElementById('save-btn');
    const footer = document.getElementById('footer');
    const bookAvailabilitySelect = document.getElementById('book-availability');
    const bookBorrowedCheckbox = document.getElementById('book-borrowed');
    const navLinks = document.getElementById('nav-links');
    initializeLocalStorage();
    setupNavbar();
    setupBookDescription();
    setupImagePreview();
    setupBookEditing();

    function initializeLocalStorage() {
        if (!localStorage.getItem('books')) {
            localStorage.setItem('books', JSON.stringify([]));
        }
    }


    function setupBookDescription() {
        bookDescriptionDiv.setAttribute('data-placeholder', 'Enter the book description');
        
        bookDescriptionDiv.addEventListener('focus', function() {
            if (this.textContent === this.getAttribute('data-placeholder')) {
                this.textContent = '';
            }
        });
        
        bookDescriptionDiv.addEventListener('blur', function() {
            if (this.textContent === '') {
                this.textContent = this.getAttribute('data-placeholder');
            }
        });

        if (bookDescriptionDiv.textContent.trim() === '') {
            bookDescriptionDiv.textContent = bookDescriptionDiv.getAttribute('data-placeholder');
        }
    }

    function setupImagePreview() {
        chooseImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = '';
                imagePreview.style.display = 'none';
            }
        });
    }

    function setupBookEditing() {
        saveBtn.addEventListener('click', handleSaveBook);
        
        const urlParams = new URLSearchParams(window.location.search);
        const bookIdToEdit = urlParams.get('id');
        bookIdToEdit ? loadBookData(bookIdToEdit) : showManualIdInput();
    }

    function showManualIdInput() {
        document.querySelector('.container').style.display = 'none';
        
        const idForm = document.createElement('div');
        idForm.className = 'manual-id-form';
        idForm.innerHTML = `
            <h3>Enter the Book ID</h3>
            <input type="text" id="manual-book-id" placeholder="Book ID">
            <button id="load-book-btn" class="green-btn-label">Load Book</button>
            <button id="cancel-btn" class="cancel-btn">Cancel</button>
            <div id="id-error" class="error-message"></div>
        `;
        
        footer.parentNode.insertBefore(idForm, footer);
        
        document.getElementById('load-book-btn').addEventListener('click', loadBookById);
        document.getElementById('cancel-btn').addEventListener('click', () => {
            window.location.href = 'Browse.html';
        });
    }

    function loadBookById() {
        const manualId = document.getElementById('manual-book-id').value.trim();
        if (!manualId) {
            document.getElementById('id-error').textContent = 'Please enter a book ID';
            return;
        }

        const books = JSON.parse(localStorage.getItem('books')) || [];
        if (books.some(book => book.id === manualId)) {
            loadBookData(manualId);
            document.querySelector('.manual-id-form').remove();
            document.querySelector('.container').style.display = 'block';
        } else {
            document.getElementById('id-error').textContent = 'Book not found';
        }
    }

    function loadBookData(bookId) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const bookToEdit = books.find(book => book.id === bookId);
        
        if (!bookToEdit) {
            showErrorNotification('Book not found');
            showManualIdInput();
            return;
        }

        bookIdInput.value = bookToEdit.id;
        bookTitleInput.value = bookToEdit.title;
        bookAuthorInput.value = bookToEdit.author;
        bookCategorySelect.value = bookToEdit.category;
        
        bookDescriptionDiv.textContent = bookToEdit.description || 
                                      bookDescriptionDiv.getAttribute('data-placeholder');
        
        if (bookToEdit.image?.data) {
            imagePreview.src = bookToEdit.image.data;
            imagePreview.style.display = 'block';
        }

        if (bookAvailabilitySelect) {
            bookAvailabilitySelect.value = bookToEdit.availability || 'available';
        }

        if (bookBorrowedCheckbox) {
            bookBorrowedCheckbox.checked = bookToEdit.isBorrowed || false;
        }
    }
    
    async function handleSaveBook(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            const bookData = await prepareBookData();
            saveBookToLocalStorage(bookData);
            alert('Book saved successfully');
        } catch (error) {
            console.error('Error saving book:', error);
            showErrorNotification('Error saving book. Please try again.');
        }
    }

    function validateForm() {
        let isValid = true;
        
        clearErrors();
        
        if (!bookIdInput.value.trim()) {
            showError(bookIdInput, 'Book ID is required');
            isValid = false;
        }
        
        if (!bookTitleInput.value.trim()) {
            showError(bookTitleInput, 'Book title is required');
            isValid = false;
        }
        
        if (!bookAuthorInput.value.trim()) {
            showError(bookAuthorInput, 'Author name is required');
            isValid = false;
        }
        
        if (bookDescriptionDiv.textContent.trim() === '' || 
            bookDescriptionDiv.textContent === bookDescriptionDiv.getAttribute('data-placeholder')) {
            showError(bookDescriptionDiv, 'Book description is required');
            isValid = false;
        }
        
        return isValid;
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    async function prepareBookData() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const existingBook = books.find(book => book.id === bookIdInput.value);
        
        let imageData = null;
        if (chooseImageInput.files[0]) {
            imageData = await getImageData(chooseImageInput.files[0]);
        } else if (existingBook?.image) {
            imageData = existingBook.image;
        }

        return {
            id: bookIdInput.value,
            title: bookTitleInput.value,
            author: bookAuthorInput.value,
            category: bookCategorySelect.value,
            description: bookDescriptionDiv.textContent === bookDescriptionDiv.getAttribute('data-placeholder') 
                         ? '' 
                         : bookDescriptionDiv.textContent,
            image: imageData,
            addedDate: existingBook?.addedDate || new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            availability: bookAvailabilitySelect?.value || 'available',
            isBorrowed: bookBorrowedCheckbox?.checked || false
        };
    }

    function getImageData(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result
                });
            };
            reader.readAsDataURL(file);
        });
    }

    function saveBookToLocalStorage(bookData) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const existingIndex = books.findIndex(book => book.id === bookData.id);
        
        if (existingIndex >= 0) {
            books[existingIndex] = bookData;
        } else {
            books.push(bookData);
        }
        
        localStorage.setItem('books', JSON.stringify(books));
        return true;
    }

    function showError(element, message) {
        element.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8em';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    }

    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i> ${message}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});
 
