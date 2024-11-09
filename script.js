// Slot Machine Game Variables
let balance = 100;
let currentGame = "slotMachine";
let slotMachinePrices = { slotMachine: 20, autoSpin: 10, luckUpgrade: 50 };

// Blackjack Variables
let playerHand = [];
let aiHand = [];
const suits = ["♠", "♣", "♥", "♦"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// HTML Elements
const balanceDisplay = document.getElementById("balance");
const slotMachinesContainer = document.getElementById("slotMachinesContainer");
const switchGameButton = document.getElementById("switchGameButton");
const playerHandEl = document.getElementById("playerHand");
const aiHandEl = document.getElementById("aiHand");
const playerTotalEl = document.getElementById("playerTotal");
const aiTotalEl = document.getElementById("aiTotal");

// Blackjack Functions
function generateCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return `${value}${suit}`;
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  hand.forEach(card => {
    const cardValue = card.slice(0, -1); // Get value part of the card
    if (["J", "Q", "K"].includes(cardValue)) value += 10;
    else if (cardValue === "A") {
      aces += 1;
      value += 11;
    } else value += parseInt(cardValue);
  });

  // Adjust for Aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
}

function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), "Hidden"]; // Hide the AI's second card initially
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
  if (calculateHandValue(playerHand) > 21) {
    endGame("You bust! You lose.");
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
  determineWinner();
}

function determineWinner() {
  const playerTotal = calculateHandValue(playerHand);
  const aiTotal = calculateHandValue(aiHand);

  if (aiTotal > 21 || playerTotal > aiTotal) endGame("You win!");
  else if (playerTotal === aiTotal) endGame("It's a tie!");
  else endGame("You lose.");
}

function endGame(message) {
  alert(message);
  resetHands();
}

// Game Switch
function switchGame() {
  if (currentGame === "slotMachine") {
    slotMachinesContainer.style.display = "none";
    document.getElementById("blackjackContainer").style.display = "block";
    resetHands();
    currentGame = "blackjack";
  } else {
    slotMachinesContainer.style.display = "flex";
    document.getElementById("blackjackContainer").style.display = "none";
    currentGame = "slotMachine";
  }
}

// Event Listeners
switchGameButton.addEventListener("click", switchGame);
document.getElementById("hitButton").addEventListener("click", hit);
document.getElementById("stayButton").addEventListener("click", stay);

// Initialize balance and display
balanceDisplay.textContent = balance.toFixed(2);
resetHands();
