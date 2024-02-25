let exchangeRates = {};

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://www.floatrates.com/daily/usd.json")
    .then((response) => response.json())
    .then((data) => {
      exchangeRates = data;
      const sourceCurrencySelect = document.getElementById("sourceCurrency");
      const destinationCurrencySelect = document.getElementById("destinationCurrency");

      const sortedKeys = Object.keys(data).sort((a, b) => {
        const countryA = data[a].name.toLowerCase();
        const countryB = data[b].name.toLowerCase();
        return countryA.localeCompare(countryB);
      });

      sortedKeys.forEach((key, idx) => {
        const option = document.createElement("option");
        option.value = key;
        //if (idx === 90 || idx === 97) option.selected = true;
        option.textContent = `${data[key].name} (${key.toUpperCase()})`;

        sourceCurrencySelect.appendChild(option.cloneNode(true));
        destinationCurrencySelect.appendChild(option);
      });

      // Set default selection of both source and destination using keys.
      sourceCurrencySelect.value = "qar";
      destinationCurrencySelect.value = "pkr";
    })
    .catch((error) => {
      console.error("Error fetching exchange rates:", error);
    });
});

function convert() {
  const amount = document.getElementById("amount").value;
  const sourceCurrencyKey = document.getElementById("sourceCurrency").value;
  const destinationCurrencyKey = document.getElementById(
    "destinationCurrency"
  ).value;
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  if (amount <= 0) {
    errorDiv.textContent = "Please enter a value greater than zero.";
    resultDiv.textContent = "";
    resultDiv.style.display = "none";
    errorDiv.style.display = "block";
    return;
  }

  if (amount > 1000000) {
    errorDiv.textContent = "Amount exceeds the maximum limit.";
    resultDiv.textContent = "";
    resultDiv.style.display = "none";
    errorDiv.style.display = "block";
    return;
  } else {
    const sourceRate = exchangeRates[sourceCurrencyKey].rate;
    const destinationRate = exchangeRates[destinationCurrencyKey].rate;
    const result = ((amount / sourceRate) * destinationRate).toFixed(2);
    const date = new Date().toLocaleString("en-GB", { timeZone: "GMT" });

    errorDiv.textContent = "";
    resultDiv.innerHTML = `
        <p>Source Currency: ${
          exchangeRates[sourceCurrencyKey].name
        } (${sourceCurrencyKey.toUpperCase()})</p>
        <p>Destination Currency: ${
          exchangeRates[destinationCurrencyKey].name
        } (${destinationCurrencyKey.toUpperCase()})</p>
        <p>Exchange Rate: 1 ${sourceCurrencyKey.toUpperCase()} = ${
      destinationRate / sourceRate
    } ${destinationCurrencyKey.toUpperCase()}</p>
        <p>Calculation Timestamp: ${date}</p>
        <p>Amount of transaction: ${parseFloat(amount).toFixed(
          2
        )} ${sourceCurrencyKey.toUpperCase()} = ${result} ${destinationCurrencyKey.toUpperCase()}</p>
    `;
    resultDiv.style.display = "block";
    errorDiv.style.display = "none";
  }
}
