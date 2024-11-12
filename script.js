// Elements for game toggling
const switchGameButton = document.getElementById("switchGameButton");
const slotMachineGame = document.getElementById("slotMachineGame");
const blackjackGame = document.getElementById("blackjackGame");
let balance = 100;

// Initial display settings
document.getElementById("balance").textContent = balance;

// Toggle between Slot Machine and Blackjack game
switchGameButton.addEventListener("click", () => {
  if (slotMachineGame.style.display !== "none") {
    // Hide Slot Machine, show Blackjack
    slotMachineGame.style.display = "none";
    blackjackGame.style.display = "block";
    switchGameButton.textContent = "Switch to Slot Machine";
  } else {
    // Show Slot Machine, hide Blackjack
    slotMachineGame.style.display = "block";
    blackjackGame.style.display = "none";
    switchGameButton.textContent = "Switch to Blackjack";
  }
});

// Basic Blackjack functionality placeholders
const betButton = document.getElementById("betButton");
const hitButton = document.getElementById("hitButton");
const stayButton = document.getElementById("stayButton");
const resultDisplay = document.getElementById("resultDisplay");
let currentBet = 0;
let playerHand = [];
let aiHand = [];

// Update the balance display
function updateBalanceDisplay() {
  document.getElementById("balance").textContent = balance;
}

// Betting functionality
betButton.addEventListener("click", () => {
  if (balance >= 10) {  // Set minimum bet as $10
    currentBet = 10;
    balance -= currentBet;
    updateBalanceDisplay();
    document.getElementById("betDisplay").textContent = `Current Bet: $${currentBet}`;
    resultDisplay.textContent = "You placed a bet!";
  } else {
    resultDisplay.textContent = "Not enough balance!";
  }
});

// Hit functionality (adds a card to player's hand)
hitButton.addEventListener("click", () => {
  if (currentBet > 0) {
    const card = Math.floor(Math.random() * 11) + 1; // Random card between 1 and 11
    playerHand.push(card);
    document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.join(", ")}`;
    resultDisplay.textContent = `You drew a ${card}`;
    checkPlayerHand();
  } else {
    resultDisplay.textContent = "Please place a bet first!";
  }
});

// Stay functionality (triggers AI's turn and evaluates winner)
stayButton.addEventListener("click", () => {
  if (currentBet > 0) {
    aiTurn();
    evaluateWinner();
  } else {
    resultDisplay.textContent = "Please place a bet first!";
  }
});

// Check if player hand exceeds 21 (bust)
function checkPlayerHand() {
  const playerTotal = playerHand.reduce((sum, card) => sum + card, 0);
  if (playerTotal > 21) {
    resultDisplay.textContent = "Bust! You lose.";
    currentBet = 0;
    resetHands();
  }
}

// AI turn logic (basic random hand generation)
function aiTurn() {
  aiHand = [Math.floor(Math.random() * 11) + 1, Math.floor(Math.random() * 11) + 1];
  document.getElementById("aiHand").textContent = `AI Hand: ${aiHand.join(", ")}`;
}

// Evaluate winner based on hand values
function evaluateWinner() {
  const playerTotal = playerHand.reduce((sum, card) => sum + card, 0);
  const aiTotal = aiHand.reduce((sum, card) => sum + card, 0);

  if (playerTotal > 21) {
    resultDisplay.textContent = "Bust! You lose.";
  } else if (aiTotal > 21 || playerTotal > aiTotal) {
    resultDisplay.textContent = "You win!";
    balance += currentBet * 2;
  } else if (playerTotal === aiTotal) {
    resultDisplay.textContent = "It's a tie!";
    balance += currentBet;
  } else {
    resultDisplay.textContent = "You lose!";
  }

  currentBet = 0;
  resetHands();
  updateBalanceDisplay();
}

// Reset hands for next round
function resetHands() {
  playerHand = [];
  aiHand = [];
  document.getElementById("playerHand").textContent = "Player Hand:";
  document.getElementById("aiHand").textContent = "AI Hand: ?";
}
