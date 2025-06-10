document.addEventListener("DOMContentLoaded", () => {
  const tradeForm = document.getElementById("trade-form");
  const direction = document.getElementById("trade-direction");
  const amount = document.getElementById("trade-amount");
  const resultSpan = document.getElementById("trade-result");

  const ratio = 50; // 1 litre = 50 watts

  function updateResult() {
    const dir = direction.value;
    const amt = parseFloat(amount.value);

    if (!dir || isNaN(amt)) {
      resultSpan.textContent = "-";
      return;
    }

    const output = dir === "water_to_electricity"
      ? amt * ratio
      : amt / ratio;

    resultSpan.textContent = `${output.toFixed(2)} ${dir === "water_to_electricity" ? 'watts' : 'litres'}`;
  }

  direction.addEventListener("change", updateResult);
  amount.addEventListener("input", updateResult);

  tradeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tradeData = {
      trade_direction: direction.value,
      amount_in: parseFloat(amount.value),
      contact_info: document.getElementById("trade-contact").value
    };

    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData)
      });

      const msg = await res.json();
      alert(msg.message || "Trade submitted!");
      tradeForm.reset();
      resultSpan.textContent = "-";
    } catch (err) {
      console.error("Trade error", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
