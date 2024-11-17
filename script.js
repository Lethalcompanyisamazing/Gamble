// Change these to set the username and password
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "mypassword";

// Function to handle form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Check if the entered credentials match the valid ones
    if (enteredUsername === VALID_USERNAME && enteredPassword === VALID_PASSWORD) {
        errorMessage.textContent = "";
        alert("Login successful!");
        window.location.href = "success.html"; // Redirect on success
    } else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
    }
});
