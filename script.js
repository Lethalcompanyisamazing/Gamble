// Main variables
let balance = 100;
let luck = 1.0;
let slotMachinePrice = 20.0;
let autoSpinPrice = 10.0;
let luckUpgradePrice = 50.0;

// Load saved game data
function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || balance;
  luck = parseFloat(localStorage.getItem('luck')) || 1.0;
  slotMachinePrice = parseFloat(localStorage.getItem('slotMachinePrice')) || 20.0;
  autoSpinPrice = parseFloat(localStorage.getItem('autoSpinPrice')) || 10.0;
  luckUpgradePrice = parseFloat(localStorage.getItem('luckUpgradePrice')) || 50.0;
  updateUI();
}

// Save game state
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('luck', luck);
  localStorage.setItem('slotMachinePrice', slotMachinePrice);
  localStorage.setItem('autoSpinPrice', autoSpinPrice);
  localStorage.setItem('luckUpgradePrice', luckUpgradePrice);
}

// Wipe save data and reset prices
function wipeSave() {
  localStorage.clear();
  balance = 100;
  luck = 1.0;
  slotMachinePrice = 20.0;
  autoSpinPrice = 10.0;
  luckUpgradePrice = 50.0;
  saveState();
  updateUI();
}

// Update UI elements
function updateUI() {
  document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
  document.getElementById("buySlotButton").textContent = `Buy Slot Machine ($${slotMachinePrice.toFixed(2)})`;
  document.getElementById("buyAutoSpinButton").textContent = `Buy Auto-Spin ($${autoSpinPrice.toFixed(2)})`;
  document.getElementById("buyLuckUpgradeButton").textContent = `Buy Luck Upgrade ($${luckUpgradePrice.toFixed(2)})`;
}

// Toggle game view between slot machine and blackjack
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

// Blackjack Game Setup
function startBlackjack() {
  console.log("Starting Blackjack...");
  // Further blackjack game logic goes here
}

// Load state on page load
window.addEventListener("load", () => {
  loadState();
});
