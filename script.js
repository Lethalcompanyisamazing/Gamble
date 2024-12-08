let playerMoney = localStorage.getItem('playerMoney') ? parseInt(localStorage.getItem('playerMoney')) : 100;  // Default to 100 if no saved money
let betAmount = 0;
let gameState = 'waiting';

// Display initial player money
document.getElementById("player-money").innerText = playerMoney;

// Button Event Listeners
document.getElementById("fold-button").addEventListener("click", function() {
    if (gameState === 'waiting') {
        alert("You folded!");
        gameState = 'folded';  // Update game state to folded
        updateGame();
    }
});

document.getElementById("raise-button").addEventListener("click", function() {
    if (gameState === 'waiting') {
        let raiseAmount = prompt("Enter amount to raise:", 10);  // Prompt user for raise amount
        raiseAmount = parseInt(raiseAmount);

        if (isNaN(raiseAmount) || raiseAmount <= 0 || raiseAmount > playerMoney) {
            alert("Invalid raise amount!");
        } else {
            betAmount += raiseAmount;
            playerMoney -= raiseAmount;
            localStorage.setItem('playerMoney', playerMoney);  // Save updated money to localStorage
            alert("You raised: $" + raiseAmount);
            gameState = 'raised';  // Update state after raising
            updateGame();
        }
    }
});

document.getElementById("check-button").addEventListener("click", function() {
    if (gameState === 'waiting') {
        alert("You checked!");
        gameState = 'checked';  // Update state after checking
        updateGame();
    }
});

// Function to update the game based on state
function updateGame() {
    if (gameState === 'folded') {
        alert("Game over, you folded!");
        resetGame();
    } else if (gameState === 'raised') {
        document.getElementById("money-display").innerText = `Money: $${playerMoney}`;
        document.getElementById("bet-controls").style.display = "none"; // Hide controls after raising
        // Continue game logic like dealer actions, etc.
    } else if (gameState === 'checked') {
        // Proceed to next phase after check
        // Continue game logic for next round
    }
}

// Function to reset the game (after fold or round end)
function resetGame() {
    playerMoney = 100;  // Reset money or adjust based on game rules
    localStorage.setItem('playerMoney', playerMoney);  // Save reset money to localStorage
    document.getElementById("player-money").innerText = playerMoney;
    betAmount = 0;
    gameState = 'waiting';  // Reset state for next round
    document.getElementById("bet-controls").style.display = "inline"; // Show buttons again
}

// Example for generating a random card
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function generateCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank} of ${suit}`;
}

// Display the player's initial two cards
function startBlackjack() {
    const playerCard1 = generateCard();
    const playerCard2 = generateCard();

    // Display cards in the HTML
    document.getElementById("player-card-1").innerText = playerCard1;
    document.getElementById("player-card-2").innerText = playerCard2;
}

// Call the startBlackjack function to show cards when the game starts
startBlackjack();
