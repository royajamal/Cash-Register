let price = 19.5;
let cid = [['PENNY', 1.01], ['NICKEL', 2.05], ['DIME', 3.1], ['QUARTER', 4.25], ['ONE', 90], ['FIVE', 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

document.getElementById('purchase-btn').addEventListener('click', () => {
  let cash = parseFloat(document.getElementById('cash').value);
  let changeDue = cash - price;
  let change = calculateChange(changeDue, cid);

  if (cash < price) {
    alert('Customer does not have enough money to purchase the item');
  } else if (cash === price) {
    document.getElementById('change-due').innerText = 'No change due - customer paid with exact cash';
  } else if (change.status === 'INSUFFICIENT_FUNDS') {
    document.getElementById('change-due').innerText = 'Status: INSUFFICIENT_FUNDS';
  } else if (change.status === 'CLOSED') {
    document.getElementById('change-due').innerText = 'Status: CLOSED ' + formatChange(change.change);
  } else {
    document.getElementById('change-due').innerText = 'Status: OPEN ' + formatChange(change.change);
  }
});

function calculateChange(changeDue, cid) {
  let change = [];
  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);
  totalCid = parseFloat(totalCid.toFixed(2));

  if (totalCid < changeDue) {
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  }

  let changeMap = {
    'ONE HUNDRED': 100,
    'TWENTY': 20,
    'TEN': 10,
    'FIVE': 5,
    'ONE': 1,
    'QUARTER': 0.25,
    'DIME': 0.1,
    'NICKEL': 0.05,
    'PENNY': 0.01
  };

  let changeDueCopy = changeDue;

  for (let i = cid.length - 1; i >= 0; i--) {
    let coin = cid[i][0];
    let coinTotal = cid[i][1];
    let coinValue = changeMap[coin];
    let toGive = 0;

    while (changeDue >= coinValue && coinTotal > 0) {
      changeDue -= coinValue;
      changeDue = parseFloat(changeDue.toFixed(2));
      coinTotal -= coinValue;
      toGive += coinValue;
    }

    if (toGive > 0) {
      change.push([coin, toGive]);
    }
  }

  if (changeDue > 0) {
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  }

  if (totalCid === changeDueCopy) {
    return { status: 'CLOSED', change: change };
  }

  return { status: 'OPEN', change: change};
 }

function formatChange(change) {
  return change.map(item => `${item[0]}: $${item[1].toFixed(2)}`).join(' ');
}