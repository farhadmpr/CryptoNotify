let notifyList = [];
const background = chrome.extension.getBackgroundPage();
const btnAddNotification = document.getElementById("btnAddNotification");
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const resultBody = document.getElementById("resultBody");
const txtCurrency = document.getElementById("txtCurrency");
const txtTargetPrice = document.getElementById("txtTargetPrice");
const selectTargetPriceType = document.getElementById("selectTargetPriceType");
const timerInterval = 3000;

// function btnStartClick(event) {
//   if (!txtCurrency.value) return;

//   if (background.timer) return;

//   const _data = {
//     srcCurrency: txtCurrency.value,
//     dstCurrency: "rls",
//   };

//   background.startFetch(timerInterval, _data);

//   background.notify({
//     title: `Start ${txtCurrency.value.toUpperCase()}`,
//     message: "Fetch started successfully!",
//     iconUrl: "./icons/icon32.png",
//     type: "basic",
//   });

//   event.target.disabled = true;
//   btnStop.disabled = false;
//   txtCurrency.disabled = true;
// }

// function btnStopClick(event) {
//   background.stopFetch();
//   background.notify({
//     title: `Stop ${txtCurrency.value.toUpperCase()}`,
//     message: "Fetch stoped successfully!",
//     iconUrl: "./icons/icon32.png",
//     type: "basic",
//   });

//   event.target.disabled = true;
//   btnStart.disabled = false;
//   txtCurrency.disabled = false;
// }

// function txtCurrencyChange() {
//   chrome.storage.local.set({ currency: txtCurrency.value });
// }

// function txtTargetPriceChange() {
//   background.priceTarget = txtTargetPrice.value;
// }

// function selectTargetPriceTypeChange(event) {
//   background.priceTargetType = event.target.value;
// }

function showResult() {
  setInterval(() => {
    fetch("https://api.cryptonator.com/api/ticker/btc-usdt")
      .then((response) => response.json())
      .then((json) => {
        resultBody.innerHTML = "";
        // for (const crypto in json.stats) {
        //   let tr = document.createElement("tr");
        //   tr.innerHTML = `
        //       <td>${crypto.split("-")[0].toUpperCase()}</td>
        //       <td>${(json.stats[crypto].latest / 10).toLocaleString()}</td>
        //       <td>${(json.stats[crypto].bestSell / 10).toLocaleString()}</td>
        //       <td>${(json.stats[crypto].bestBuy / 10).toLocaleString()}</td>
        //       <td dir="ltr" class=${
        //         json.stats[crypto].dayChange >= 0
        //           ? "text-success"
        //           : "text-danger"
        //       }>${json.stats[crypto].dayChange.toLocaleString()}%</td>
        //     `;
        //   resultBody.appendChild(tr);
        // }
        background.console.log(json.ticker.price)
      })
      .catch((err) => {
        background.console.log(err);
      });
  }, timerInterval);
}

function btnAddNotificationClick() {
  notifyList.push({
    currency: txtCurrency.value,
    target: txtTargetPrice.value,
    type: selectTargetPriceType.value,
  });

  chrome.storage.local.set({ notificationList: notifyList });
}

// btnStart.addEventListener("click", btnStartClick);
// btnStop.addEventListener("click", btnStopClick);
btnAddNotification.addEventListener("click", btnAddNotificationClick);

chrome.storage.local.get(["notificationList"], function (result) {
  if (result.notificationList) notifyList = result.notificationList;
});

//btnStart.disabled = background.timer !== null;
//btnStop.disabled = !btnStart.disabled;

showResult();
