// Initialize balance, slot machine cost, auto-spin, and luck
let balance = parseFloat(localStorage.getItem("balance")) || 100;
let slotMachineCost = 20.0;
let autoSpinCost = 10.0;
let luckUpgradeCost = 50.0;
let luckLevel = parseFloat(localStorage.getItem("luck")) || 1;
let autoSpinEnabled = false;

// DOM Elements
const balanceDisplay = document.getElementById("balance");
const buySlotButton = document.getElementById("buySlotButton");
const buyAutoSpinButton = document.getElementById("buyAutoSpinButton");
const buyLuckUpgradeButton = document.getElementById("buyLuckUpgradeButton");
const wipeSaveButton = document.getElementById("wipeSaveButton");
const gameToggleArrow = document.getElementById("gameToggleArrow");
const slotMachineGame = document.getElementById("app");
const blackjackGame = document.getElementById("blackjackGame");
const messageDisplay = document.getElementById("messageDisplay");

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Buying Functions
buySlotButton.addEventListener("click", () => {
  if (balance >= slotMachineCost) {
    balance -= slotMachineCost;
    slotMachineCost *= 1.2;
    buySlotButton.textContent = `Buy Slot Machine ($${slotMachineCost.toFixed(2)})`;
    // Add new slot machine logic
    updateBalanceDisplay();
  }
});

buyAutoSpinButton.addEventListener("click", () => {
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    autoSpinEnabled = true;
    autoSpinCost *= 1.5;
    buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinCost.toFixed(2)})`;
    updateBalanceDisplay();
  }
});

buyLuckUpgradeButton.addEventListener("click", () => {
  if (balance >= luckUpgradeCost) {
    balance -= luckUpgradeCost;
    luckLevel *= 1.1;
    luckUpgradeCost *= 2;
    buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${luckUpgradeCost.toFixed(2)})`;
    updateBalanceDisplay();
  }
});

// Slot Machine Spin
function spinSlotMachine() {
  const result = Math.random();
  let winnings = 0;

  if (result < 0.5) {
    messageDisplay.textContent = "You LOST!";
  } else if (result < 0.75) {
    winnings = balance > 0 ? balance * 0.1 : 10;
    balance += winnings;
    messageDisplay.textContent = `You WON $${winnings.toFixed(2)}!`;
  } else if (result < 0.95) {
    winnings = balance > 0 ? balance * 0.35 : 50;
    balance += winnings;
    messageDisplay.textContent = `You WON $${winnings.toFixed(2)}!`;
  } else {
    winnings = balance > 0 ? balance * 0.65 : 100;
    balance += winnings;
    messageDisplay.textContent = `Jackpot! You WON $${winnings.toFixed(2)}!`;
  }
  updateBalanceDisplay();
}

// Auto-Spin Logic
function autoSpin() {
  if (autoSpinEnabled) {
    setInterval(spinSlotMachine, 5000);
  }
}

// Wipe Save
wipeSaveButton.addEventListener("click", () => {
  balance = 100;
  slotMachineCost = 20.0;
  autoSpinCost = 10.0;
  luckUpgradeCost = 50.0;
  luckLevel = 1;
  autoSpinEnabled = false;
  updateBalanceDisplay();
  buySlotButton.textContent = "Buy Slot Machine ($20.00)";
  buyAutoSpinButton.textContent = "Buy Auto-Spin ($10.00)";
  buyLuckUpgradeButton.textContent = "Buy Luck Upgrade ($50.00)";
  messageDisplay.textContent = "Save Wiped. Starting Fresh!";
});

// Game Toggle
gameToggleArrow.addEventListener("click", () => {
  if (blackjackGame.style.display === "none") {
    slotMachineGame.style.display = "none";
    blackjackGame.style.display = "block";
    startBlackjack();
  } else {
    blackjackGame.style.display = "none";
    slotMachineGame.style.display = "block";
  }
});

// Blackjack Game Setup
function startBlackjack() {
  console.log("Blackjack game started.");
  // Implement blackjack game logic here
}

// Initial Setup
updateBalanceDisplay();
autoSpin();
