document.addEventListener("DOMContentLoaded", function () {
  // Handle Add Book button visibility based on role
  const addBookDiv = document.querySelector(".add");
  if (addBookDiv) {
    // Show Add Book button only for admin users
    addBookDiv.style.display = "block";
  }

  loadBooks();

  document.getElementById("Sort").addEventListener("change", filterBooks);
  document
    .querySelector(".search-box input")
    .addEventListener("input", filterBooks);

  let dynamicBooks = []; // Declare globally for access

  // Create a broadcast channel for communication between pages
  const bookChannel = new BroadcastChannel("book_updates");

  // Listen for book updates from other pages
  bookChannel.onmessage = function (event) {
    if (event.data.type === "new_book") {
      const book = event.data.book;
      dynamicBooks.push(book); // Add the new book to our array
      filterBooks(); // Update the display with current filters
    }
    if (event.data.type === "update_book") {
      // Reload all books from the server to ensure data is up-to-date
      loadBooks();
    }
  };

  async function loadBooks() {
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = "";

    try {
      const response = await fetch("/api/books/");
      const data = await response.json();
      dynamicBooks = data.books || []; // Assign value to global variable

      displayBooks(dynamicBooks); // Call display function
    } catch (error) {
      booksContainer.innerHTML = `<div class="no-results"><p>Error loading books.</p></div>`;
      console.error("Failed to fetch books:", error);
    }
  }

  function filterBooks() {
    const sortValue = document.getElementById("Sort").value;
    const searchValue = document
      .querySelector(".search-box input")
      .value.toLowerCase();

    let filteredBooks = [...dynamicBooks];

    // Sorting first
    if (sortValue === "A-Z") {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "Z-A") {
      filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Then filtering
    if (searchValue) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          (book.id && book.id.toString().includes(searchValue)) ||
          book.title.toLowerCase().includes(searchValue) ||
          book.author.toLowerCase().includes(searchValue) ||
          (book.category &&
            book.category.toLowerCase().includes(searchValue)) ||
          (book.publisher && book.publisher.toLowerCase().includes(searchValue))
      );
    }

    displayBooks(filteredBooks); // Update UI
  }

  function displayBooks(books) {
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = "";

    if (books.length === 0) {
      booksContainer.innerHTML = `<div class="no-results"><p>No books available.</p></div>`;
      return;
    }

    books.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.className = "book-item";

      const imgSrc = book.cover_image || "images/default-book-image.png";

      // Determine status text and color based on isBorrowed
      const isBorrowed = book.isBorrowed === true;
      const statusText = isBorrowed ? "Borrowed" : "Available";
      const statusColor = isBorrowed ? "red" : "green";

      bookElement.innerHTML = `
        <a href="/book/${book.id}/" class="book-link">
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
            <p style="background-color: ${statusColor}; height: 100%;">${statusText}</p>
          </div>
        </a>
      `;

      booksContainer.appendChild(bookElement);
    });
  }


  // For the Add Book button
  window.addItem = function () {
    window.location.href = "Add_Book.html";
  };
});



