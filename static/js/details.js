const navLinks = document.querySelector(".nav-links");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || "";
const userRole = loggedInUser.accountType || "user";

// Clear existing navigation links

book = JSON.parse(localStorage.getItem("selectedBook"));

const borrowBtn = document.querySelector("section .btns button:last-of-type");
const editBtn = document.querySelector("section .btns button:first-of-type");

if (loggedInUser) {
  borrowBtn.style.display = "block";
  if (book.status == "Borrowed") {
    borrowBtn.innerHTML = "Return";
  }
}
borrowBtn.onclick = function () {
  const books = [];
  JSON.parse(localStorage.getItem("books")).forEach((ele) => {
    if (book.id === ele.id) {
      if (book.status == "Borrowed") {
        ele.availability = "Available";
        ele.isBorrowed = false;
      } else {
        ele.availability = "Borrowed";
        ele.isBorrowed = true;
      }
    }
    books.push(ele);
  });
  localStorage.setItem("books", JSON.stringify(books));
  window.location.href = "Browse.html";
};


editBtn.onclick = function () {
  window.location.href = "Edit_Book.html";
};


