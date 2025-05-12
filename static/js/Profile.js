
/*
window.onload = function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    

    document.getElementById('name-display').textContent = loggedInUser.username || 'Name not available';
    document.getElementById('email-display').textContent = loggedInUser.email || 'Email not available';
    document.getElementById('role-display').textContent = loggedInUser.accountType || 'Role not available';

    document.getElementById("logout-btn").addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "Home.html";
    });

    renderBorrowedBooks();
};

function renderBorrowedBooks() {
    const allBooks = JSON.parse(localStorage.getItem('books')) || [];
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    borrowedBooksList.innerHTML = '';

    allBooks
        .filter(book => book.isBorrowed)
        .forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
            `;
            borrowedBooksList.appendChild(row);
        });
}

function editField(field) {
    const displayElement = document.getElementById(`${field}-display`);
    const currentValue = displayElement.textContent.trim();

    const inputElement = document.createElement("input");
    inputElement.value = currentValue;
    inputElement.style.width = "100%";

    displayElement.innerHTML = "";
    displayElement.appendChild(inputElement);

    const editButton = displayElement.parentNode.querySelector("button");
    editButton.textContent = "Save";
    editButton.setAttribute("onclick", `saveField('${field}')`);
}

function saveField(field) {
    const displayElement = document.getElementById(`${field}-display`);
    const inputElement = displayElement.querySelector("input");
    const updatedValue = inputElement.value.trim();

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (field === "email") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(updatedValue)) {
            alert("Please enter a valid email address.");
            return;
        }
    }

    const userIndex = users.findIndex(user => user.username === loggedInUser.username && user.email === loggedInUser.email);

    if (userIndex !== -1) {
        if (field === "name") {
            loggedInUser.username = updatedValue;
            users[userIndex].username = updatedValue;
        } else if (field === "email") {
            loggedInUser.email = updatedValue;
            users[userIndex].email = updatedValue;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        localStorage.setItem('users', JSON.stringify(users));

        displayElement.innerHTML = updatedValue;
        const editButton = displayElement.parentNode.querySelector("button");
        editButton.textContent = "Edit";
        editButton.setAttribute("onclick", `editField('${field}')`);
    } else {
        alert("User not found in user list.");
    }
}
*/