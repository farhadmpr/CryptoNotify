const apiUrl = "https://api.nobitex.ir/market/stats";
const iconUrl = "./icons/icon32.png";
const notificationSound = new Audio("./sounds/notification.mp3");
var timer = null;
var notifyPriceOffset = false;
var notifyTargetPrice = false;
let lastPrice = 0;
var priceChangeOffset = 1000;
var priceTarget = 0;
var priceTargetType = "";

async function getPriceFromApi(data) {
  try {
    const result = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const jsonResult = await result.json();
    const latestPriceToman =
      jsonResult.stats[`${data.srcCurrency}-rls`].latest / 10;
    return latestPriceToman;
  } catch (error) {
    console.log(error);
    setBadge("error");
  }
}

function startFetch(milisec, data) {
  setBadge("load");

  timer = setInterval(async function () {
    const result = await getPriceFromApi(data);

    setBadge(result);

    if (notifyPriceOffset) {
      if (result > lastPrice + priceChangeOffset) {
        let increasePercent = ((result - lastPrice) / result) * 100;
        notify({
          title: `${data.srcCurrency.toUpperCase()} ▲`,
          message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (+${increasePercent.toLocaleString()}%)`,
          iconUrl: iconUrl,
          type: "basic",
        });
      }

      if (result < lastPrice - priceChangeOffset) {
        let decreasePercent = ((lastPrice - result) / result) * 100;
        notify({
          title: `${data.srcCurrency.toUpperCase()} ▼`,
          message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (-${decreasePercent.toLocaleString()}%)`,
          iconUrl: iconUrl,
          type: "basic",
        });
      }
    }

    if (notifyTargetPrice) {
      if (priceTargetType === "bigger" && result >= priceTarget) {
        notify({
          title: `${data.srcCurrency.toUpperCase()} Target >= ${priceTarget.toLocaleString()}`,
          message: `${result.toLocaleString()}`,
          iconUrl: iconUrl,
          type: "basic",
        });
        notificationSound.play();
        priceTargetType = "";
      }

      if (priceTargetType === "lower" && result <= priceTarget) {
        notify({
          title: `${data.srcCurrency.toUpperCase()} Target <= ${priceTarget.toLocaleString()}`,
          message: `${result.toLocaleString()}`,
          iconUrl: iconUrl,
          type: "basic",
        });
        notificationSound.play();
        priceTargetType = "";
      }
    }

    lastPrice = result;
  }, milisec);
}

function stopFetch() {
  clearInterval(timer);
  timer = null;
  setBadge("");
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
