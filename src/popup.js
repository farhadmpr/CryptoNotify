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
const timerInterval = 7000;

function btnDeleteClick(event) {
  const index = event.target.getAttribute("data-index");
  notifyList.splice(index, 1);
  chrome.storage.local.set({ notificationList: notifyList });
  event.target.parentElement.parentElement.remove();
}

function btnResetClick(event) {
  const index = event.target.getAttribute("data-index");
  notifyList[index].targetReachTime = "";
  notifyList[index].isNotificationShowed = false;
  chrome.storage.local.set({ notificationList: notifyList });
}

async function fetchAndShow() {
  resultBody.innerHTML = "";
  let trList = [];

  chrome.storage.local.get(["notificationList"], async function (result) {
    if (result.notificationList) notifyList = result.notificationList;
  });

  for (const [index, crypto] of notifyList.entries()) {
    let response = await fetch(
      `https://api.cryptonator.com/api/ticker/${crypto.currency}`
    );    
    if (response.ok) {
      response = await response.json();      
      let td = `
        <td>${crypto.currency.toUpperCase()}</td>
        <td>${Number(response?.ticker?.price).toLocaleString()}</td>
        <td>${crypto.type}</td>
        <td>${Number(crypto.target).toLocaleString()}</td>
        <td>${crypto.targetReachTime}</td>
        <td><a data-index="${index}" class="btn btn-danger btn-sm btnDelete">حذف</a> 
        <a data-index="${index}" class="btn btn-primary btn-sm btnReset">ریست</a></td>
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

    let btnResetList = document.getElementsByClassName("btnReset");
    Array.from(btnResetList).forEach((btn) => {
      btn.addEventListener("click", btnResetClick);
    });
  }
}

function showResultTimer() {
  setInterval(async () => {
    await fetchAndShow();
  }, timerInterval);
}

function btnAddNotificationClick() {
  if (
    txtCurrency.value &&
    txtTargetPrice.value &&
    selectTargetPriceType.value
  ) {
    notifyList.push({
      currency: txtCurrency.value,
      target: txtTargetPrice.value,
      type: selectTargetPriceType.value,
      isNotificationShowed: false,
      targetReachTime: "",
    });

    chrome.storage.local.set({ notificationList: notifyList });

    txtTargetPrice.value = "";
    selectTargetPriceType.value = "";
  }
}

function btnStartClick(event) {
  if (background.timer) return;

  background.startFetch(timerInterval);

  background.notify({
    title: `Start`,
    message: "Fetch started successfully!",
    iconUrl: "./icons/icon32.png",
    type: "basic",
  });

  background.setBadge("Work");

  event.target.disabled = true;
  btnStop.disabled = false;
}

function btnStopClick(event) {
  background.stopTimer();

  background.notify({
    title: `Stop`,
    message: "Fetch stoped successfully!",
    iconUrl: "./icons/icon32.png",
    type: "basic",
  });

  background.setBadge("");

  event.target.disabled = true;
  btnStart.disabled = false;
}

btnAddNotification.addEventListener("click", btnAddNotificationClick);
btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);

chrome.storage.local.get(["notificationList"], async function (result) {
  if (result.notificationList) {
    notifyList = result.notificationList;
    await fetchAndShow();
  }
});

showResultTimer();
