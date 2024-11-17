// Predefined username and password
const correctUsername = "admin";
const correctPassword = "password123";

// Sound setup
const successSound = new Audio("login-success.mp3");

// Form handling
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get input values
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    // Check credentials
    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
        successSound.play(); // Play the success sound
        successSound.onended = () => {
            window.location.href = "success.html"; // Redirect to the next page
        };
    } else {
        document.getElementById("error-message").innerText = "Invalid username or password.";
    }
});
