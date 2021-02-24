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
    setBadge("erro");
  }
}

function startFetch(milisec) {
  setBadge("load");

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

chrome.storage.local.get(["notificationList"], async function (result) {
  if (result.notificationList) {
    notifyList = result.notificationList;
  }
});
