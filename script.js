// Game State Variables
let balance = 100;
let betAmount = 10;
let currentGame = "slotMachine";
let slotMachinePrices = { slotMachine: 20, autoSpin: 10, luckUpgrade: 50 };

// DOM Elements
const balanceDisplay = document.getElementById("balance");
const switchGameButton = document.getElementById("switchGameButton");
const slotMachineContainer = document.getElementById("slotMachineContainer");
const blackjackContainer = document.getElementById("blackjackContainer");
const playerHandEl = document.getElementById("playerHand");
const aiHandEl = document.getElementById("aiHand");
const playerTotalEl = document.getElementById("playerTotal");
const aiTotalEl = document.getElementById("aiTotal");

// Initial Setup
balanceDisplay.textContent = balance.toFixed(2);
slotMachineContainer.style.display = "block";
blackjackContainer.style.display = "none";

// Blackjack-specific Variables
let playerHand = [];
let aiHand = [];

// Blackjack Functions
function generateCard() {
  return Math.floor(Math.random() * 11) + 1; // Random card from 1 to 11
}

function calculateHandValue(hand) {
  return hand.reduce((total, card) => total + card, 0);
}

function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), "Hidden"];
  updateBlackjackDisplay();
}

function updateBlackjackDisplay() {
  playerHandEl.textContent = playerHand.join(", ");
  aiHandEl.textContent = aiHand[0] + ", " + (aiHand[1] === "Hidden" ? "?" : aiHand[1]);
  playerTotalEl.textContent = calculateHandValue(playerHand);
  aiTotalEl.textContent = aiHand.includes("Hidden") ? "?" : calculateHandValue(aiHand);
}

function hit() {
  playerHand.push(generateCard());
  updateBlackjackDisplay();
  const playerTotal = calculateHandValue(playerHand);
  
  if (playerTotal > 21) {
    endGame("Bust! You went over 21.", false);
  }
}

function stay() {
  aiHand[1] = generateCard(); // Reveal AI's hidden card
  let aiTotal = calculateHandValue(aiHand);

  while (aiTotal < 17) {
    aiHand.push(generateCard());
    aiTotal = calculateHandValue(aiHand);
  }

  updateBlackjackDisplay();
  const playerTotal = calculateHandValue(playerHand);

  if (aiTotal > 21 || playerTotal > aiTotal) {
    endGame("You won this round!", true);
  } else {
    endGame("AI won this round.", false);
  }
}

function endGame(message, playerWins) {
  updateBlackjackDisplay();
  
  if (playerWins) {
    balance += betAmount * 2;
    alert(message + " You win double your bet!");
  } else {
    balance -= betAmount;
    alert(message + " You lost your bet.");
  }

  balanceDisplay.textContent = balance.toFixed(2);
  resetHands();
}

// Switch Game Function
function switchGame() {
  if (currentGame === "slotMachine") {
    currentGame = "blackjack";
    slotMachineContainer.style.display = "none";
    blackjackContainer.style.display = "block";
    resetHands();
  } else {
    currentGame = "slotMachine";
    blackjackContainer.style.display = "none";
    slotMachineContainer.style.display = "block";
  }
}

// Event Listeners
switchGameButton.addEventListener("click", switchGame);
document.getElementById("hitButton").addEventListener("click", hit);
document.getElementById("stayButton").addEventListener("click", stay);

// Initialize Display
resetHands();
balanceDisplay.textContent = balance.toFixed(2);
