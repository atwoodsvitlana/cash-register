let price = 19.5; // Changed to let for testing purposes
let cid = [
  ["PENNY", 0.5],
  ["NICKEL", 0],
  ["DIME", 0],
  ["QUARTER", 0],
  ["ONE", 0],
  ["FIVE", 0],
  ["TEN", 0],
  ["TWENTY", 0],
  ["ONE HUNDRED", 0],
];

const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueDisplay = document.getElementById("change-due");

const currencyValues = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

purchaseBtn.addEventListener("click", () => {
  const cashProvided = parseFloat(cashInput.value);

  if (isNaN(cashProvided) || cashProvided < 0) {
    alert("Please enter a valid cash amount.");
    return;
  }

  if (cashProvided < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashProvided === price) {
    changeDueDisplay.textContent =
      "No change due - customer paid with exact cash";
    return;
  }

  let changeDue = cashProvided - price;
  let totalCID = cid.reduce((sum, [, amount]) => sum + amount, 0);
  totalCID = parseFloat(totalCID.toFixed(2)); // Handle floating point precision

  if (totalCID < changeDue) {
    changeDueDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  let change = calculateChange(changeDue, cid);

  if (change.status === "INSUFFICIENT_FUNDS") {
    changeDueDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (change.status === "CLOSED") {
    changeDueDisplay.textContent = `Status: CLOSED ${change.change
      .map(([unit, amount]) => `${unit}: $${amount}`)
      .join(" ")}`;
  } else {
    // status: OPEN
    changeDueDisplay.textContent = `Status: OPEN ${change.change
      .map(([unit, amount]) => `${unit}: $${amount}`)
      .join(" ")}`;
  }
});

function calculateChange(changeDue, cashInDrawer) {
  let change = [];
  let totalCID = cashInDrawer.reduce((sum, [, amount]) => sum + amount, 0);
  totalCID = parseFloat(totalCID.toFixed(2));

  // Sort cashInDrawer from highest to lowest currency value
  const sortedCid = [...cashInDrawer].sort(
    (a, b) => currencyValues[b[0]] - currencyValues[a[0]]
  );

  for (let i = 0; i < sortedCid.length; i++) {
    let currencyName = sortedCid[i][0];
    let currencyAmountInDrawer = sortedCid[i][1];
    let currencyValue = currencyValues[currencyName];
    let amountToReturn = 0;

    while (changeDue >= currencyValue && currencyAmountInDrawer > 0) {
      changeDue = parseFloat((changeDue - currencyValue).toFixed(2));
      currencyAmountInDrawer = parseFloat(
        (currencyAmountInDrawer - currencyValue).toFixed(2)
      );
      amountToReturn = parseFloat((amountToReturn + currencyValue).toFixed(2));
    }

    if (amountToReturn > 0) {
      change.push([currencyName, amountToReturn]);
    }
  }

  if (changeDue > 0) {
    return {
      status: "INSUFFICIENT_FUNDS",
      change: [],
    };
  }

  if (totalCID - change.reduce((sum, [, amount]) => sum + amount, 0) === 0) {
    return {
      status: "CLOSED",
      change: change,
    };
  }

  return {
    status: "OPEN",
    change: change,
  };
}
