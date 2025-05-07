const navLinks = document.querySelector(".nav-links");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || '';
const userRole = loggedInUser.accountType || "user";

// Clear existing navigation links
navLinks.innerHTML = "";

// Add common links
navLinks.innerHTML += `
        <a href="Home.html"><i class="fas fa-home"></i> Home</a>           
        <a href="Browse.html" class="active"><i class="fas fa-book-reader"></i> Browse</a>           
    `;

// Add conditional links based on login status
if (loggedInUser) {
  navLinks.innerHTML += `
            <a href="Profile.html"><i class="fas fa-user-circle"></i> My Account</a>
            <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</a>
        `;

  // Add event listener for logout button
  document.addEventListener("click", function (e) {
    if (
      e.target &&
      (e.target.id === "logout-btn" || e.target.closest("#logout-btn"))
    ) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("accountType"); // Also remove the userRole
      window.location.href = "Home.html";
    }
  });
} else {
  navLinks.innerHTML += `
            <a href="Login.html"><i class="fas fa-sign-in-alt"></i> Log In</a>
            <a href="Sign-Up.html"><i class="fas fa-user-plus"></i> Sign Up</a>
        `;
}
book = JSON.parse(localStorage.getItem("selectedBook"));
document.getElementsByClassName("image")[0].children[0].src = book.image.data;

document.getElementsByClassName(
  "tags"
)[0].children[0].children[0].firstElementChild.innerHTML = book.author;
document.getElementsByClassName(
  "tags"
)[0].children[0].children[1].firstElementChild.innerHTML = book.category;
document.getElementsByClassName(
  "tags"
)[0].children[0].children[1].firstElementChild.innerHTML = book.category;
document.getElementsByClassName(
  "tags"
)[0].children[0].children[2].firstElementChild.innerHTML = book.status;
document.getElementsByClassName(
  "tags"
)[0].children[0].children[3].firstElementChild.innerHTML = book.id;
document.getElementsByClassName(
  "tags"
)[0].children[0].children[3].firstElementChild.innerHTML = book.id;
if (book.status == "Borrowed") {
  document.getElementsByClassName(
    "tags"
  )[0].children[0].children[2].firstElementChild.style.color = "red";
}
document.getElementById("description").innerText = book.description;

document.getElementsByClassName("text")[0].children[0].innerHTML = book.title;

const borrowBtn = document.querySelector("section .btns button:last-of-type");
const deleteBtn = document.querySelector("section .btns button:nth-of-type(2)");
const editBtn = document.querySelector("section .btns button:first-of-type");

if (loggedInUser) {
  borrowBtn.style.display = "block";
  if (book.status == "Borrowed") {
    borrowBtn.innerHTML = "Return";
    console.log("peter");
  }
}
if (userRole == "admin") {
  deleteBtn.style.display = "block";
  editBtn.style.display = "block";
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
deleteBtn.onclick = function () {
  const books = [];
  JSON.parse(localStorage.getItem("books")).forEach((ele) => {
    if (book.id != ele.id) {
      books.push(ele);
    }
  });
  localStorage.setItem("books", JSON.stringify(books));
  window.location.href = "Browse.html";
};

editBtn.onclick = function () {
  window.location.href = "Edit_Book.html";
};
