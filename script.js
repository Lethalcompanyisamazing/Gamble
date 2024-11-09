let balance = 100;
let slotMachinePrice = 20;
let autoSpinPrice = 10;
let luckUpgradePrice = 50;
let playerHand = [];
let aiHand = [];
const suits = ["♠", "♥", "♦", "♣"];

function updateBalance() {
  document.getElementById("balance").textContent = balance;
}

function resetPrices() {
  slotMachinePrice = 20;
  autoSpinPrice = 10;
  luckUpgradePrice = 50;
  document.getElementById("buySlotButton").textContent = `Buy Slot Machine ($${slotMachinePrice})`;
  document.getElementById("buyAutoSpinButton").textContent = `Buy Auto-Spin ($${autoSpinPrice})`;
  document.getElementById("buyLuckUpgradeButton").textContent = `Buy Luck Upgrade ($${luckUpgradePrice})`;
}

function wipeSave() {
  balance = 100;
  resetPrices();
  document.getElementById("slotMachinesContainer").innerHTML = '';
  document.getElementById("resultDisplay").textContent = "";
  updateBalance();
}

document.getElementById("wipeSaveButton").addEventListener("click", wipeSave);

function getRandomCard() {
  const value = Math.floor(Math.random() * 10) + 1;
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return { value, suit };
}

function updateHands() {
  document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.map(card => `${card.value}${card.suit}`).join(", ")}`;
  document.getElementById("aiHand").textContent = "AI Hand: ?";
}

function switchGame() {
  const slotMachineGame = document.getElementById("slotMachineGame");
  const blackjackGame = document.getElementById("blackjackGame");
  
  if (slotMachineGame.style.display === "none") {
    slotMachineGame.style.display = "block";
    blackjackGame.style.display = "none";
  } else {
    slotMachineGame.style.display = "none";
    blackjackGame.style.display = "block";
  }
}

document.getElementById("switchGameButton").addEventListener("click", switchGame);

function blackjack() {
  playerHand = [getRandomCard(), getRandomCard()];
  updateHands();
}

document.getElementById("hitButton").addEventListener("click", () => {
  playerHand.push(getRandomCard());
  updateHands();
});

document.getElementById("stayButton").addEventListener("click", () => {
  aiHand = [getRandomCard(), getRandomCard()];
  const playerTotal = playerHand.reduce((acc, card) => acc + card.value, 0);
  const aiTotal = aiHand.reduce((acc, card) => acc + card.value, 0);

  document.getElementById("aiHand").textContent = `AI Hand: ${aiHand.map(card => `${card.value}${card.suit}`).join(", ")} (Total: ${aiTotal})`;

  if (playerTotal > 21) {
    balance -= 10;
    document.getElementById("resultDisplay").textContent = "You Busted! AI wins.";
  } else if (aiTotal > 21 || playerTotal > aiTotal) {
    balance += 20;
    document.getElementById("resultDisplay").textContent = "You Win!";
  } else {
    balance -= 10;
    document.getElementById("resultDisplay").textContent = "AI Wins!";
  }
  updateBalance();
});

blackjack();
