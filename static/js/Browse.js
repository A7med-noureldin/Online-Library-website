document.addEventListener("DOMContentLoaded", function () {
  // Navigation handling
  const navLinks = document.querySelector(".nav-links");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || '';
  const userRole = loggedInUser.accountType || "user";

  // Clear existing navigation links



  // Handle Add Book button visibility based on role
  const addBookDiv = document.querySelector(".add");
  if (addBookDiv) {
    // Show Add Book button only for admin users
    addBookDiv.style.display = "block";
  }

  initializeLocalStorage();
  loadBooks();

  // Add event listener for sorting
  document.getElementById("Sort").addEventListener("change", function () {
    filterBooks();
  });

  // Add event listener for search input
  document
    .querySelector(".search-box input")
    .addEventListener("input", function () {
      filterBooks();
    });

  function initializeLocalStorage() {
    if (!localStorage.getItem("books")) {
      localStorage.setItem("books", JSON.stringify([]));
    }
  }

  function loadBooks() {
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = ""; // Clear previous books

    // Retrieve dynamic books from local storage
    let dynamicBooks = JSON.parse(localStorage.getItem("books")) || [];

    // Filter books based on user role
    if (userRole === "admin") {
      // Admins should only see available books
      dynamicBooks = dynamicBooks.filter((book) => book.status !== "Borrowed");
    }

    if (dynamicBooks.length === 0) {
      booksContainer.innerHTML = `
                <div class="no-results">
                    <p>No books available.</p>
                </div>
            `;
      return;
    }

    // Loop through stored books and display them
    dynamicBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.className = "book-item";

      const imgSrc = book.image
        ? book.image.data
        : "images/default-book-image.png";

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
                <div class="${
                  book.availability === "Borrowed" ? "content1_2" : "content1_1"
                }">
                    <p>${book.availability || "Available"}</p>
                </div>
            `;

      bookElement.addEventListener("click", () => {
        const bookData = {
          id: book.id,
          category: book.category,
          title: book.title,
          author: book.author,
          status: book.availability || "Available",
          image: { data: imgSrc },
          description: book.description || "No description available.",
        };

        localStorage.setItem("selectedBook", JSON.stringify(bookData));
        window.location.href = "Details.html";
      });

      booksContainer.appendChild(bookElement);
    });
  }

  function filterBooks() {
    const sortValue = document.getElementById("Sort").value;
    const searchValue = document
      .querySelector(".search-box input")
      .value.toLowerCase();

    // Retrieve dynamic books from local storage
    let dynamicBooks = JSON.parse(localStorage.getItem("books")) || [];

    // Handle filtering based on user role
    if (userRole === "admin") {
      dynamicBooks = dynamicBooks.filter((book) => book.status !== "Borrowed"); // Admin sees only available books
    }

    // Apply search filtering
    if (searchValue !== "") {
      dynamicBooks = dynamicBooks.filter(
        (book) =>
          (book.id && book.id.toString().includes(searchValue))||
          book.title.toLowerCase().includes(searchValue) ||
          book.author.toLowerCase().includes(searchValue) ||
          (book.category && book.category.toLowerCase().includes(searchValue))
      );
    }

    // Apply sorting
    if (sortValue === "A-Z") {
      dynamicBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "Z-A") {
      dynamicBooks.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Display the filtered books
    const booksContainer = document.getElementById("books-container");
    booksContainer.innerHTML = ""; // Clear previous books

    if (dynamicBooks.length === 0) {
      booksContainer.innerHTML = `
                <div class="no-results">
                    <p>No books found matching your search criteria.</p>
                </div>
            `;
      return;
    }

    dynamicBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.className = "book-item";

      const imgSrc = book.image
        ? book.image.data
        : "images/default-book-image.png";

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
                <div class="${
                  book.availability === "Borrowed" ? "content1_2" : "content1_1"
                }">
                    <p>${book.availability || "Available"}</p>
                </div>
            `;

      bookElement.addEventListener("click", () => {
        const bookData = {
          title: book.title,
          author: book.author,
          status: book.availability || "Available",
          image: { data: imgSrc },
          description: book.description || "No description available.",
        };

        localStorage.setItem("selectedBook", JSON.stringify(bookData));
        window.location.href = "Details.html";
      });

      booksContainer.appendChild(bookElement);
    });
  }

  // For the Add Book button
  window.addItem = function () {
    window.location.href = "Add_Book.html";
  };
});
