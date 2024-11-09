let balance = 100;
let currentGame = "slotMachine";

// Elements
const slotMachineContainer = document.getElementById('slotMachineContainer');
const blackjackContainer = document.getElementById('blackjackContainer');
const switchGameButton = document.getElementById('switchGameButton');
const balanceDisplay = document.getElementById('balance');
const playerHandEl = document.getElementById('playerHand');
const aiHandEl = document.getElementById('aiHand');
const playerTotalEl = document.getElementById('playerTotal');
const aiTotalEl = document.getElementById('aiTotal');
const blackjackResultEl = document.getElementById('blackjackResult');

// Blackjack Logic
let playerHand = [];
let aiHand = [];
let betAmount = 0;

function getCardValue(card) {
  if (["J", "Q", "K"].includes(card)) return 10;
  if (card === "A") return 11; // Adjust ace later if necessary
  return parseInt(card);
}

function calculateHandValue(hand) {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  if (total > 21 && hand.includes("A")) total -= 10; // Convert Ace from 11 to 1 if over 21
  return total;
}

function generateCard() {
  const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return cards[Math.floor(Math.random() * cards.length)];
}

function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), generateCard()];
  updateBlackjackDisplay();
}

function updateBlackjackDisplay() {
  playerHandEl.textContent = playerHand.join(", ");
  aiHandEl.textContent = aiHand.join(", ");
  playerTotalEl.textContent = calculateHandValue(playerHand);
  aiTotalEl.textContent = calculateHandValue(aiHand);
}

function hit() {
  playerHand.push(generateCard());
  updateBlackjackDisplay();
  checkForBust();
}

function stay() {
  let aiTotal = calculateHandValue(aiHand);
  while (aiTotal < 17) {
    aiHand.push(generateCard());
    aiTotal = calculateHandValue(aiHand);
  }
  updateBlackjackDisplay();
  determineWinner();
}

function checkForBust() {
  if (calculateHandValue(playerHand) > 21) {
    blackjackResultEl.textContent = "You busted! AI wins.";
    balance -= betAmount;
    updateBalance();
  }
}

function determineWinner() {
  const playerTotal = calculateHandValue(playerHand);
  const aiTotal = calculateHandValue(aiHand);
  if (playerTotal > 21) {
    blackjackResultEl.textContent = "You busted! AI wins.";
  } else if (aiTotal > 21 || playerTotal > aiTotal) {
    blackjackResultEl.textContent = "You win!";
    balance += betAmount * 2;
  } else if (aiTotal === playerTotal) {
    blackjackResultEl.textContent = "It's a tie!";
  } else {
    blackjackResultEl.textContent = "AI wins.";
    balance -= betAmount;
  }
  updateBalance();
}

function placeBet() {
  betAmount = 10; // Example fixed bet
  resetHands();
  blackjackResultEl.textContent = "";
}

// Game Switching
switchGameButton.addEventListener('click', () => {
  if (currentGame === "slotMachine") {
    slotMachineContainer.style.display = "none";
    blackjackContainer.style.display = "block";
    currentGame = "blackjack";
  } else {
    slotMachineContainer.style.display = "block";
    blackjackContainer.style.display = "none";
    currentGame = "slotMachine";
  }
});

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Initialize
updateBalance();
document.getElementById('hitButton').addEventListener('click', hit);
document.getElementById('stayButton').addEventListener('click', stay);
document.getElementById('betButton').addEventListener('click', placeBet);
