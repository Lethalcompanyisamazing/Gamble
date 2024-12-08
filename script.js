// Initialize money (load from localStorage or start at 100)
let money = parseInt(localStorage.getItem('money')) || 100;
const moneyDisplay = document.getElementById('money-display');
const betButton = document.getElementById('bet-button');
const gameLog = document.getElementById('game-log');

// Update money display
function updateMoneyDisplay() {
  moneyDisplay.textContent = `Money: $${money}`;
}

// Save money to localStorage
function saveMoney() {
  localStorage.setItem('money', money);
}

// Blackjack game simulation
function playBlackjack(betAmount) {
  const playerScore = Math.floor(Math.random() * 11) + 16; // Simulate a score between 16-26
  const dealerScore = Math.floor(Math.random() * 11) + 16; // Simulate a score between 16-26

  gameLog.textContent = `You scored ${playerScore}, dealer scored ${dealerScore}.`;

  if (playerScore > 21) {
    gameLog.textContent += " You busted! You lose the bet.";
    return -betAmount; // Lose bet
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    gameLog.textContent += " You win! Your bet is doubled.";
    return betAmount; // Win bet
  } else if (playerScore === dealerScore) {
    gameLog.textContent += " It's a tie. You keep your bet.";
    return 0; // Tie
  } else {
    gameLog.textContent += " You lose! Dealer wins.";
    return -betAmount; // Lose bet
  }
}

// Handle betting
betButton.addEventListener('click', () => {
  const betAmount = parseInt(prompt("Enter your bet amount:"));

  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Please enter a valid bet amount.");
    return;
  }

  if (betAmount > money) {
    alert("You don't have enough money to make this bet!");
    return;
  }

  // Play the game and update money based on result
  const result = playBlackjack(betAmount);
  money += result;
  saveMoney();
  updateMoneyDisplay();

  if (money <= 0) {
    alert("You're out of money! Resetting your balance to $100.");
    money = 100;
    saveMoney();
    updateMoneyDisplay();
  }
});

// Initial display
updateMoneyDisplay();
