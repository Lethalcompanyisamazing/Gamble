// Game Switching Elements
const switchGameButton = document.getElementById("switchGameButton");
const slotMachineGame = document.getElementById("slotMachineGame");
const blackjackGame = document.getElementById("blackjackGame");

// Initial balance and display
let balance = 100;
document.getElementById("balance").textContent = balance;

// Toggle between Slot Machine and Blackjack game
switchGameButton.addEventListener("click", () => {
  if (slotMachineGame.style.display !== "none") {
    slotMachineGame.style.display = "none";
    blackjackGame.style.display = "block";
    switchGameButton.textContent = "Switch to Slot Machine";
  } else {
    slotMachineGame.style.display = "block";
    blackjackGame.style.display = "none";
    switchGameButton.textContent = "Switch to Blackjack";
  }
});

// Blackjack Elements
const betButton = document.getElementById("betButton");
const hitButton = document.getElementById("hitButton");
const stayButton = document.getElementById("stayButton");
const resultDisplay = document.getElementById("resultDisplay");
let currentBet = 0;
let playerHand = [];
let aiHand = [];

// Update balance display
function updateBalanceDisplay() {
  document.getElementById("balance").textContent = balance;
}

// Deal starter cards when placing a bet
betButton.addEventListener("click", () => {
  if (balance >= 10) {  // Minimum bet of $10
    currentBet = 10;
    balance -= currentBet;
    updateBalanceDisplay();
    document.getElementById("betDisplay").textContent = `Current Bet: $${currentBet}`;
    resultDisplay.textContent = "You placed a bet!";
    
    // Deal two starter cards to each player
    playerHand = [getRandomCard(), getRandomCard()];
    aiHand = [getRandomCard(), getRandomCard()];
    
    // Display the hands
    document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.join(", ")}`;
    document.getElementById("aiHand").textContent = "AI Hand: ?";
  } else {
    resultDisplay.textContent = "Not enough balance!";
  }
});

// Function to generate a random card value
function getRandomCard() {
  return Math.floor(Math.random() * 11) + 1;
}

// "Hit" functionality
hitButton.addEventListener("click", () => {
  if (currentBet > 0) {
    const card = getRandomCard();
    playerHand.push(card);
    document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.join(", ")}`;
    resultDisplay.textContent = `You drew a ${card}`;
    checkPlayerHand();
  } else {
    resultDisplay.textContent = "Please place a bet first!";
  }
});

// "Stay" functionality to finish the turn
stayButton.addEventListener("click", () => {
  if (currentBet > 0) {
    aiTurn();
    evaluateWinner();
  } else {
    resultDisplay.textContent = "Please place a bet first!";
  }
});

// Check for player bust (exceeding 21)
function checkPlayerHand() {
  const playerTotal = playerHand.reduce((sum, card) => sum + card, 0);
  if (playerTotal > 21) {
    resultDisplay.textContent = "Bust! You lose.";
    currentBet = 0;
    resetHands();
  }
}

// Basic AI turn logic
function aiTurn() {
  document.getElementById("aiHand").textContent = `AI Hand: ${aiHand.join(", ")}`;
}

// Evaluate winner based on totals
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

// Reset hands for the next round
function resetHands() {
  playerHand = [];
  aiHand = [];
  document.getElementById("playerHand").textContent = "Player Hand:";
  document.getElementById("aiHand").textContent = "AI Hand: ?";
}

// Slot Machine Elements and Logic
const buySlotButton = document.getElementById("buySlotButton");
const spinButton = document.getElementById("spinButton");

// Function to spin the slot machine reels
function spinSlotMachine() {
  const reels = document.querySelectorAll('.reel'); // Ensure each reel has the "reel" class
  reels.forEach(reel => {
    reel.textContent = getRandomEmoji(); // Populate each reel with a random emoji
  });
}

// Function to get a random emoji (or symbol)
function getRandomEmoji() {
  const emojis = ["🍒", "🍋", "🔔", "🍉", "⭐", "💎"]; // Define your symbols here
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Trigger spin when spin button is clicked
spinButton.addEventListener("click", spinSlotMachine);

// Buying Slot Machine Functionality (if applicable)
buySlotButton.addEventListener("click", () => {
  if (balance >= 20) {
    balance -= 20;
    updateBalanceDisplay();
    const newSlotMachine = document.createElement("div");
    newSlotMachine.classList.add("reel");
    newSlotMachine.textContent = getRandomEmoji();
    document.getElementById("slotMachinesContainer").appendChild(newSlotMachine);
  } else {
    alert("Not enough balance to buy a slot machine!");
  }
});
