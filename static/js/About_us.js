const navLinks = document.getElementById('nav-links');
const loggedInUser = localStorage.getItem('loggedInUser'); 

navLinks.innerHTML = '';

navLinks.innerHTML += `
    <a href="Home.html"><i class="fas fa-home"></i> Home</a>
    <a href="Browse.html"><i class="fas fa-book-reader"></i> Browse</a>
`;


if (loggedInUser) {
    navLinks.innerHTML += `
        <a href="Profile.html"><i class="fas fa-user-circle"></i> My Account</a>
        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</a>
    `;
} else {
    navLinks.innerHTML += `
        <a href="Login.html"><i class="fas fa-sign-in-alt"></i> Log In</a>
        <a href="Sign-Up.html"><i class="fas fa-user-plus"></i> Sign Up</a>
    `;
}

//sign out button
document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn') {
        localStorage.removeItem('loggedInUser'); 
        location.reload(); 
    }
});

