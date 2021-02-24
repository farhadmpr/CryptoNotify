const apiUrl = "https://api.cryptonator.com/api/ticker/";
const iconUrl = "./icons/icon32.png";
const notificationSound = new Audio("./sounds/notification.mp3");
let notifyList = [];
var timer = null;

async function getPriceFromApi(currency) {
  try {
    const result = await fetch(apiUrl + currency);
    const jsonResult = await result.json();    
    return jsonResult?.ticker?.price;
  } catch (error) {
    console.log(error);
    setBadge("error");
  }
}

function updateTargetReachTime(index, obj) {
  notifyList[index] = obj;
  chrome.storage.local.set({ notificationList: notifyList });
}

function startFetch(milisec) {
  timer = setInterval(async function () {
    chrome.storage.local.get(["notificationList"], async function (result) {
      if (result.notificationList) {
        notifyList = result.notificationList;
      }
    });

    for (const [index, crypto] of notifyList.entries()) {
      const priceFromApi = await getPriceFromApi(crypto.currency);
      if (crypto.isNotificationShowed === false) {
        if (
          crypto.type === "bigger" &&
          Number(crypto.target) <= Number(priceFromApi)
        ) {
          notify({
            title: `${crypto.currency.toUpperCase()} ▲`,
            message: `${Number(priceFromApi).toLocaleString()} > ${Number(
              crypto.target
            ).toLocaleString()}`,
            iconUrl: iconUrl,
            type: "basic",
          });
          notificationSound.play();
          crypto.targetReachTime = new Date().toLocaleString(
            "fa-IR",
            "yyyy/mm/dd HH:MM:ss"
          );
          crypto.isNotificationShowed = true;
          updateTargetReachTime(index, crypto);
        }

        if (
          crypto.type === "lower" &&
          Number(crypto.target) >= Number(priceFromApi)
        ) {
          notify({
            title: `${crypto.currency.toUpperCase()} ▼`,
            message: `${Number(priceFromApi).toLocaleString()} < ${Number(
              crypto.target
            ).toLocaleString()}`,
            iconUrl: iconUrl,
            type: "basic",
          });
          notificationSound.play();
          crypto.targetReachTime = new Date().toLocaleString(
            "fa-IR",
            "yyyy/mm/dd HH:MM:ss"
          );
          crypto.isNotificationShowed = true;
          updateTargetReachTime(index, crypto);
        }
      }
    }
  }, milisec);
}

function notify(options) {
  chrome.notifications.create("", options);
}

function setBadge(text) {
  if (text !== undefined) {
    chrome.browserAction.setBadgeText({
      text: text.toString().substr(0, 4),
    });
  }
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}
