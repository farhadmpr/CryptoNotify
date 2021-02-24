let notifyList = [];
const background = chrome.extension.getBackgroundPage();
const btnAddNotification = document.getElementById("btnAddNotification");
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const resultBody = document.getElementById("resultBody");
const txtCurrency = document.getElementById("txtCurrency");
const txtTargetPrice = document.getElementById("txtTargetPrice");
const selectTargetPriceType = document.getElementById("selectTargetPriceType");
const btnDelete = document.getElementsByClassName("btnDelete");
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

function btnDeleteClick(event) {
  const index = event.target.getAttribute("data-index");
  notifyList.splice(index, 1);
  chrome.storage.local.set({ notificationList: notifyList });
  event.target.parentElement.parentElement.remove();
}

function showResult() {
  setInterval(async () => {
    resultBody.innerHTML = "";
    let trList = [];

    for (const [index, crypto] of notifyList.entries()) {
      let response = await fetch(
        `https://api.cryptonator.com/api/ticker/${crypto.currency}`
      );
      if (response.ok) {
        response = await response.json();
        let td = `
          <td>${crypto.currency.toUpperCase()}</td>
          <td>${Number(response.ticker.price).toLocaleString()}</td>
          <td>${crypto.type}</td>
          <td>${Number(crypto.target).toLocaleString()}</td>
          <td><a data-index="${index}" class="btn btn-danger btn-sm btnDelete">حذف</a></td>
        `;
        trList.push(td.toString());
      }
    }

    for (const trBody of trList) {
      let tr = document.createElement("tr");
      tr.innerHTML = trBody;
      resultBody.appendChild(tr);
      btnAddNotification.addEventListener("click", btnAddNotificationClick);
      let btnDeleteList = document.getElementsByClassName("btnDelete");
      Array.from(btnDeleteList).forEach((btn) => {
        btn.addEventListener("click", btnDeleteClick);
      });
    }
  }, timerInterval);
}

function btnAddNotificationClick() {
  notifyList.push({
    currency: txtCurrency.value,
    target: txtTargetPrice.value,
    type: selectTargetPriceType.value,
  });

  chrome.storage.local.set({ notificationList: notifyList });
  background.console.log("add");
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
