const switchButton = document.getElementById("switchButton");
const slotMachineContainer = document.getElementById("slotMachineContainer");
const blackjackContainer = document.getElementById("blackjackContainer");
let balance = 100;  // Set an initial balance

document.getElementById("balance").textContent = balance;
document.getElementById("blackjackBalance").textContent = balance;

// Toggle games when the switch button is clicked
switchButton.addEventListener("click", () => {
  const isSlotVisible = slotMachineContainer.style.display !== "none";
  slotMachineContainer.style.display = isSlotVisible ? "none" : "block";
  blackjackContainer.style.display = isSlotVisible ? "block" : "none";
});

// Blackjack gameplay
const hitButton = document.getElementById("hitButton");
const stayButton = document.getElementById("stayButton");
const resultDisplay = document.getElementById("resultDisplay");
let playerHand = [];
let aiHand = [];

// Helper function to get card value
function getRandomCard() {
  return Math.floor(Math.random() * 10) + 1;
}

// Update hand displays
function updateHands() {
  document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.join(", ")}`;
}

// Hit - Add a card to the player's hand
hitButton.addEventListener("click", () => {
  playerHand.push(getRandomCard());
  updateHands();
  checkGameEnd();
});

// Stay - End the game and calculate the AI's hand
stayButton.addEventListener("click", () => {
  aiHand = [getRandomCard(), getRandomCard()];
  const playerTotal = playerHand.reduce((acc, card) => acc + card, 0);
  const aiTotal = aiHand.reduce((acc, card) => acc + card, 0);

  if (playerTotal > 21) {
    resultDisplay.textContent = `You Busted! AI wins. AI's hand: ${aiHand.join(", ")}`;
  } else if (aiTotal > 21 || playerTotal > aiTotal) {
    balance += 20;
    resultDisplay.textContent = `You Win! AI's hand: ${aiHand.join(", ")}`;
  } else {
    balance -= 20;
    resultDisplay.textContent = `AI Wins! AI's hand: ${aiHand.join(", ")}`;
  }
  document.getElementById("balance").textContent = balance;
  document.getElementById("blackjackBalance").textContent = balance;
  resetGame();
});

// Check if player has busted
function checkGameEnd() {
  const playerTotal = playerHand.reduce((acc, card) => acc + card, 0);
  if (playerTotal > 21) {
    resultDisplay.textContent = "You Busted!";
    balance -= 20;
    document.getElementById("balance").textContent = balance;
    document.getElementById("blackjackBalance").textContent = balance;
    resetGame();
  }
}

// Reset hands for new game
function resetGame() {
  playerHand = [];
  aiHand = [];
  updateHands();
}
