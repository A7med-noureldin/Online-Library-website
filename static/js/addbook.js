document.addEventListener('DOMContentLoaded', function() {
    const bookIdInput = document.getElementById('book-id');
    const bookTitleInput = document.getElementById('book-title');
    const bookAuthorInput = document.getElementById('book-author');
    const bookCategorySelect = document.getElementById('book-category');
    const bookDescriptionDiv = document.getElementById('book-description');
    const chooseImageInput = document.getElementById('choose-image');
    const imagePreview = document.getElementById('image-preview');
    const saveBtn = document.getElementById('save-btn');
    const bookAvailabilitySelect = document.getElementById('book-availability');
    const navLinks = document.getElementById('nav-links');
    const loggedInUser = localStorage.getItem('loggedInUser');
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
        bookDescriptionDiv.setAttribute('data-placeholder', 'enter book description here');
        
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
    }

    async function handleSaveBook(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            const bookData = await prepareBookData();
            saveBookToLocalStorage(bookData);
            showSuccessMessage();
            resetForm();
        } catch (error) {
            console.error('Error saving book:', error);
            alert('error try again');
        }
    }

    function validateForm() {
        let isValid = true;
        
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        if (!bookIdInput.value || isNaN(bookIdInput.value) || bookIdInput.value < 1) {
            showError(bookIdInput, 'enter positive num please');
            isValid = false;
        }
        
        if (!bookTitleInput.value.trim() || bookTitleInput.value === 'Book Title') {
            showError(bookTitleInput, 'enter the book title');
            isValid = false;
        } else if (bookTitleInput.value.trim().length > 100) {
            showError(bookTitleInput, 'The book title must be less than 100 characters');
            isValid = false;
        }
        
        if (!bookAuthorInput.value.trim() || bookAuthorInput.value === 'Author') {
            showError(bookAuthorInput, 'enter the book author');
            isValid = false;
        }
        
        if (bookDescriptionDiv.textContent.trim() === '' || 
            bookDescriptionDiv.textContent === bookDescriptionDiv.getAttribute('data-placeholder')) {
            showError(bookDescriptionDiv, 'enter the book description');
            isValid = false;
        }
        
        return isValid;
    }

    async function prepareBookData() {
        let imageData = null;
        if (chooseImageInput.files[0]) {
            imageData = await getImageData(chooseImageInput.files[0]);
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
            addedDate: new Date().toISOString(),
            availability: bookAvailabilitySelect ? bookAvailabilitySelect.value : "available",
            isBorrowed: false
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
    }

    function showError(element, message) {
        element.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8em';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    }

    function showSuccessMessage() {
        alert('the book saved successfully');
    }

    function resetForm() {
        bookIdInput.value = '';
        bookTitleInput.value = 'Book Title';
        bookAuthorInput.value = 'Author';
        bookCategorySelect.value = 'technology';
        bookDescriptionDiv.textContent = bookDescriptionDiv.getAttribute('data-placeholder');
        chooseImageInput.value = '';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        if (bookAvailabilitySelect) {
            bookAvailabilitySelect.value = 'available';
        }
    }
});
