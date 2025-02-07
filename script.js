let money = 100;
const symbols = ["🍒", "🍉", "🍋", "7️⃣", "❌"];

document.getElementById("spin-btn").addEventListener("click", function() {
    if (money < 10) {
        document.getElementById("message").textContent = "Not enough money!";
        return;
    }

    money -= 10;
    document.getElementById("money").textContent = money;

    let matchChance = Math.random(); // Determines if we force a match
    let slot1, slot2, slot3;

    if (matchChance < 0.4) {  // 40% chance of getting a winning match
        slot1 = slot2 = slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    } else {
        slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    }

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
