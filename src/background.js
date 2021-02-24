const apiUrl = "https://api.cryptonator.com/api/ticker/";
const iconUrl = "./icons/icon32.png";
const notificationSound = new Audio("./sounds/notification.mp3");
let notifyList = [];
var timer = null;

async function getPriceFromApi(currency) {
  try {
    const result = await fetch(apiUrl + currency);
    const jsonResult = await result.json();
    return jsonResult.ticker.price;
  } catch (error) {
    console.log(error);
    setBadge("error");
  }
}

function startFetch(milisec) {
  chrome.storage.local.get(["notificationList"], async function (result) {
    if (result.notificationList) {
      notifyList = result.notificationList;
    }
  });

  timer = setInterval(async function () {
    for (const [index, crypto] of notifyList.entries()) {
      const priceFromApi = await getPriceFromApi(crypto.currency);
      if (
        crypto.type === "bigger" &&
        Number(crypto.price) <= Number(priceFromApi)
      ) {
        notify({
          title: `${crypto.currency.toUpperCase()} ▲`,
          message: `${Number(priceFromApi).toLocaleString()} > ${Number(
            crypto.priceTarget
          ).toLocaleString()})`,
          iconUrl: iconUrl,
          type: "basic",
        });
      }

      if (
        crypto.type === "lower" &&
        Number(crypto.price) >= Number(priceFromApi)
      ) {
        notify({
          title: `${crypto.currency.toUpperCase()} ▼`,
          message: `${Number(priceFromApi).toLocaleString()} < ${Number(
            crypto.priceTarget
          ).toLocaleString()})`,
          iconUrl: iconUrl,
          type: "basic",
        });
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
