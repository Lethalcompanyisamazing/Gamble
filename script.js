let playerBalance = 0;
let slotMachineCost = 20.00;
let autoSpinCost = 10.00;
let luckUpgradeCost = 50.00;
const balanceDisplay = document.getElementById("balance");

// Blackjack Variables
let playerHand = [], dealerHand = [], playerScore = 0, dealerScore = 0;
const playerHandDisplay = document.getElementById("playerHand");
const dealerHandDisplay = document.getElementById("dealerHand");
const playerScoreDisplay = document.getElementById("playerScore");
const dealerScoreDisplay = document.getElementById("dealerScore");
const blackjackMessage = document.getElementById("blackjackMessage");

function resetPrices() {
  slotMachineCost = 20.00;
  autoSpinCost = 10.00;
  luckUpgradeCost = 50.00;
  document.getElementById("buySlotButton").textContent = `Buy Slot Machine ($${slotMachineCost})`;
  document.getElementById("buyAutoSpinButton").textContent = `Buy Auto-Spin ($${autoSpinCost})`;
  document.getElementById("buyLuckUpgradeButton").textContent = `Buy Luck Upgrade ($${luckUpgradeCost})`;
}

// Wipe Save
document.getElementById("wipeSaveButton").addEventListener("click", () => {
  playerBalance = 0;
  resetPrices();
  balanceDisplay.textContent = playerBalance;
});

// Blackjack Logic
function getRandomCard() {
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  return cards[Math.floor(Math.random() * cards.length)];
}

function startBlackjack() {
  playerHand = [getRandomCard(), getRandomCard()];
  dealerHand = [getRandomCard(), getRandomCard()];
  calculateScores();
  displayHands();
  blackjackMessage.textContent = "Hit or Stay?";
}

function calculateScores() {
  playerScore = playerHand.reduce((a, b) => a + b, 0);
  dealerScore = dealerHand.reduce((a, b) => a + b, 0);
}

function displayHands() {
  playerHandDisplay.textContent = playerHand.join(", ");
  dealerHandDisplay.textContent = dealerHand.join(", ");
  playerScoreDisplay.textContent = playerScore;
  dealerScoreDisplay.textContent = dealerScore;
}

document.getElementById("hitButton").addEventListener("click", () => {
  playerHand.push(getRandomCard());
  calculateScores();
  displayHands();
  checkGameOutcome();
});

document.getElementById("stayButton").addEventListener("click", () => {
  while (dealerScore < 17) {
    dealerHand.push(getRandomCard());
    calculateScores();
    displayHands();
  }
  checkGameOutcome();
});

function checkGameOutcome() {
  if (playerScore > 21) {
    blackjackMessage.textContent = "You Bust! Dealer Wins!";
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    blackjackMessage.textContent = "You Win!";
    playerBalance += parseInt(document.getElementById("betAmount").value) * 2;
    balanceDisplay.textContent = playerBalance;
  } else if (playerScore === dealerScore) {
    blackjackMessage.textContent = "Push! It's a Tie!";
  } else {
    blackjackMessage.textContent = "Dealer Wins!";
  }
}

// Toggle Between Games
document.getElementById("gameToggleArrow").addEventListener("click", () => {
  const blackjackGame = document.getElementById("blackjackGame");
  const slotMachineGame = document.getElementById("app");
  
  if (blackjackGame.style.display === "none") {
    slotMachineGame.style.display = "none";
    blackjackGame.style.display = "block";
    startBlackjack();
  } else {
    blackjackGame.style.display = "none";
    slotMachineGame.style.display = "block";
  }
});

document.getElementById("newGameButton").addEventListener("click", startBlackjack);
resetPrices();
