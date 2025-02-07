let money = 100;
const symbols = ["🍒", "🍒", "🍉", "🍉", "🍋", "🍋", "7️⃣", "❌", "❌"]; 

document.getElementById("spin-btn").addEventListener("click", function() {
    if (money < 10) {
        document.getElementById("message").textContent = "Not enough money!";
        return;
    }

    money -= 10;
    document.getElementById("money").textContent = money;

    let slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById("slot1").textContent = slot1;
    document.getElementById("slot2").textContent = slot2;
    document.getElementById("slot3").textContent = slot3;

    let rewardMultiplier = 0;
    if (slot1 === slot2 && slot2 === slot3) {
        if (slot1 === "🍒") rewardMultiplier = 1.25;
        else if (slot1 === "🍉") rewardMultiplier = 1.50;
        else if (slot1 === "🍋") rewardMultiplier = 1.75;
        else if (slot1 === "7️⃣") rewardMultiplier = 2.50;
    }

    if (rewardMultiplier > 0) {
        let winnings = Math.floor(10 * rewardMultiplier);
        money += winnings;
        document.getElementById("message").textContent = `You won $${winnings}!`;
    } else {
        document.getElementById("message").textContent = "You lost!";
    }

    document.getElementById("money").textContent = money;
});
