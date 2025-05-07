//nav part
const navLinks = document.getElementById('nav-links');
const loggedInUser = localStorage.getItem('loggedInUser'); 

navLinks.innerHTML = '';

navLinks.innerHTML += `
    <li><a href="Home.html" class="active"><i class="fas fa-home"></i> Home</a></li>
    <li><a href="Browse.html"><i class="fas fa-book-reader"></i> Browse</a></li>
`;

if (loggedInUser) {
    navLinks.innerHTML += `
        <li><a href="Profile.html"><i class="fas fa-user-circle"></i> My Account</a></li>
        <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</a></li>
    `;
} else {
    navLinks.innerHTML += `
        <li><a href="Login.html"><i class="fas fa-sign-in-alt"></i> Log In</a></li>
        <li><a href="Sign-Up.html"><i class="fas fa-user-plus"></i> Sign Up</a></li>
    `;
}


//sign out button
document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn') {
        localStorage.removeItem('loggedInUser'); 
        location.reload(); 
    }
});

// delete join now button if user is logged in
const joinNowBtn = document.querySelector('.button-group a[href="Sign-Up.html"]');
if (loggedInUser && joinNowBtn) joinNowBtn.style.display = 'none';


//if user logged in delete start now section
if (loggedInUser){
    const startSection = document.getElementById('start-section');
    startSection.style.display = 'none';
}
