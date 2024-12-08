let money = 100; // Starting money for the player
let playerCards = [];
let communityCards = [];
let playerBet = 0;

document.getElementById("money-display").innerText = `Money: $${money}`;

document.getElementById("place-bet").addEventListener("click", function () {
  let bet = parseInt(document.getElementById("bet-amount").value);

  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet amount.");
    return;
  }

  if (bet > money) {
    alert("You don't have enough money to place this bet.");
    return;
  }

  money -= bet;
  playerBet = bet;
  document.getElementById("money-display").innerText = `Money: $${money}`;

  // Deal the cards after the bet
  playerCards = [getRandomCard(), getRandomCard()];
  communityCards = [getRandomCard(), getRandomCard(), getRandomCard()]; // Three community cards for now (for simplicity)

  displayCards();

  // Hide the place bet button and show the action buttons
  document.getElementById("place-bet").style.display = "none";
  document.getElementById("deal-cards").style.display = "inline";
  document.getElementById("check").style.display = "inline";
  document.getElementById("raise").style.display = "inline";
  document.getElementById("fold").style.display = "inline";
});

document.getElementById("deal-cards").addEventListener("click", function () {
  // Additional community cards (Turn and River) could be dealt here
  alert("Cards dealt! Now make your move.");
});

document.getElementById("check").addEventListener("click", function () {
  alert("You checked your hand.");
  resetGame();
});

document.getElementById("raise").addEventListener("click", function () {
  alert("You raised your bet.");
  resetGame();
});

document.getElementById("fold").addEventListener("click", function () {
  alert("You folded.");
  resetGame();
});

function getRandomCard() {
  const cards = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂶', '🂧', '🂨', '🂩', '🂪'];
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

function displayCards() {
  document.getElementById("player-cards").innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("community-cards").innerText = `Community Cards: ${communityCards.join(' ')}`;
}

function resetGame() {
  document.getElementById("place-bet").style.display = "inline";
  document.getElementById("deal-cards").style.display = "none";
  document.getElementById("check").style.display = "none";
  document.getElementById("raise").style.display = "none";
  document.getElementById("fold").style.display = "none";

  playerCards = [];
  communityCards = [];
  document.getElementById("player-cards").innerText = "Your Cards: ";
  document.getElementById("community-cards").innerText = "Community Cards: ";
}
