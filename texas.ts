let money: number = 100; // Starting money for the player
let playerCards: string[] = [];
let communityCards: string[] = [];
let playerBet: number = 0;

document.getElementById("money-display")!.innerText = `Money: $${money}`;

document.getElementById("place-bet")!.addEventListener("click", function() {
  let bet: number = parseInt((document.getElementById("bet-amount") as HTMLInputElement).value);

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
  document.getElementById("money-display")!.innerText = `Money: $${money}`;
  document.getElementById("place-bet")!.style.display = "none";
  document.getElementById("deal-cards")!.style.display = "inline";
});

document.getElementById("deal-cards")!.addEventListener("click", function() {
  playerCards = [getRandomCard(), getRandomCard()];
  communityCards = [getRandomCard(), getRandomCard(), getRandomCard()];

  displayCards();
  document.getElementById("check")!.style.display = "inline";
  document.getElementById("raise")!.style.display = "inline";
  document.getElementById("fold")!.style.display = "inline";
});

function getRandomCard(): string {
  const cards: string[] = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂶', '🂧', '🂨', '🂩', '🂪'];
  const randomIndex: number = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

function displayCards(): void {
  document.getElementById("player-cards")!.innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("community-cards")!.innerText = `Community Cards: ${communityCards.join(' ')}`;
}

document.getElementById("check")!.addEventListener("click", function() {
  alert("You checked your hand.");
  resetGame();
});

document.getElementById("raise")!.addEventListener("click", function() {
  alert("You raised your bet.");
  resetGame();
});

document.getElementById("fold")!.addEventListener("click", function() {
  alert("You folded.");
  resetGame();
});

function resetGame(): void {
  document.getElementById("place-bet")!.style.display = "inline";
  document.getElementById("deal-cards")!.style.display = "none";
  document.getElementById("check")!.style.display = "none";
  document.getElementById("raise")!.style.display = "none";
  document.getElementById("fold")!.style.display = "none";

  playerCards = [];
  communityCards = [];
  document.getElementById("player-cards")!.innerText = "Your Cards: ";
  document.getElementById("community-cards")!.innerText = "Community Cards: ";
}
