// Variables for balance, bets, and other game elements
let balance = 100; // Starting balance
const betAmount = 10; // Set default bet
let playerHand = [];
let aiHand = [];
const slotMachinePrice = 20;
const autoSpinPrice = 10;
const luckUpgradePrice = 50;
let playerLuck = 1; // Starting luck

// DOM Elements for slot machine and Blackjack
const balanceDisplay = document.getElementById("balance");
const slotMachinesContainer = document.getElementById("slotMachinesContainer");
const resultMessageEl = document.getElementById("resultMessage");
const blackjackContainer = document.getElementById("blackjackContainer");
const playerHandEl = document.getElementById("playerHand");
const aiHandEl = document.getElementById("aiHand");
const aiTotalEl = document.getElementById("aiTotal");

// Initialize balance display
balanceDisplay.textContent = balance.toFixed(2);

// Slot Machine Functionality
function createSlotMachine() {
  const slotMachine = document.createElement("div");
  slotMachine.classList.add("slotMachine");

  // Spin Button
  const spinButton = document.createElement("button");
  spinButton.textContent = "Spin";
  spinButton.addEventListener("click", () => spin(slotMachine));
  slotMachine.appendChild(spinButton);

  // Add to container
  slotMachinesContainer.appendChild(slotMachine);
}

// Spin function with win/lose logic
function spin(slotMachine) {
  const winChance = Math.random();
  let winnings = 0;

  if (winChance < 0.1) {
    winnings = balance === 0 ? 10 : balance * 0.1;
  } else if (winChance < 0.3) {
    winnings = balance === 0 ? 50 : balance * 0.35;
  } else if (winChance < 0.5) {
    winnings = balance === 0 ? 100 : balance * 0.65;
  } else {
    resultMessageEl.textContent = "You LOST!";
  }

  balance += winnings;
  balanceDisplay.textContent = balance.toFixed(2);
}

// Blackjack Functionality
function generateCard() {
  return Math.floor(Math.random() * 11) + 1;
}

function calculateHandValue(hand) {
  return hand.reduce((total, card) => total + card, 0);
}

function updateBlackjackDisplay() {
  playerHandEl.textContent = playerHand.join(", ");
  aiHandEl.textContent = aiHand[0] + ", Hidden";
}

function endGame(message, playerWins) {
  aiHand[1] = aiHand[1] === "Hidden" ? generateCard() : aiHand[1];
  const aiTotal = calculateHandValue(aiHand);

  resultMessageEl.textContent = message;
  aiHandEl.textContent = aiHand.join(", ");
  aiTotalEl.textContent = aiTotal;

  balance += playerWins ? betAmount * 2 : -betAmount;
  balanceDisplay.textContent = balance.toFixed(2);

  setTimeout(resetHands, 2000);
}

function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), "Hidden"];
  updateBlackjackDisplay();
  resultMessageEl.textContent = "";
}

// Wipe Save and Reset Prices
function wipeSave() {
  balance = 0;
  playerLuck = 1;
  balanceDisplay.textContent = balance.toFixed(2);
}
