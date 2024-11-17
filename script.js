// Predefined username and password pairs
const credentials = [
    { username: "admin", password: "password123", playSound: true },
    { username: "user", password: "password456", playSound: false }
];

// Sound setup
const successSound = new Audio("login-success.mp3");

// Form handling
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get input values
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    // Check credentials
    const user = credentials.find(
        (cred) => cred.username === enteredUsername && cred.password === enteredPassword
    );

    if (user) {
        if (user.playSound) {
            successSound.play();
            successSound.onended = function () {
                window.location.href = "success.html"; // Redirect after sound
            };
        } else {
            window.location.href = "success.html"; // Direct redirect
        }
    } else {
        document.getElementById("error-message").innerText = "Invalid username or password.";
    }
});
