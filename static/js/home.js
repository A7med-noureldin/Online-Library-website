


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
