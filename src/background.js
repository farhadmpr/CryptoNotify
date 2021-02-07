var timer = null
let lastPrice = 0;
var priceChangeOffset = 1000;

function fetchCurrency(milisec, data) {
  chrome.browserAction.setBadgeText({ text: "load" });

  timer = setInterval(function () {
    fetch("https://api.nobitex.ir/market/stats", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        const result = (
          json.stats[ // convert rial to toman
            `${data.srcCurrency}-rls`].latest / 10
        )

        // show first 4 chars of price
        chrome.browserAction.setBadgeText({ text: result.toString().substr(0,4) });

        if (result > lastPrice + priceChangeOffset) {
          let increasePercent = (result - lastPrice) / result * 100
          notify({
            title: `${data.srcCurrency.toUpperCase()} ▲`,
            message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (+${increasePercent.toLocaleString()}%)`,
            iconUrl: "/icon.png",
            type: "basic",
          });
        }

        if (result < lastPrice - priceChangeOffset) {
          let decreasePercent = (lastPrice - result) / result * 100
          notify({
            title: `${data.srcCurrency.toUpperCase()} ▼`,
            message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (${decreasePercent.toLocaleString()}%)`,
            iconUrl: "/icon.png",
            type: "basic",
          });
        }        

        lastPrice = result;
      })
      .catch((err) => {
        console.log(err);
        chrome.browserAction.setBadgeText({ text: "error" });
      });
  }, milisec);
}

function stopFetch() {
  clearInterval(timer);
  timer = null
  chrome.browserAction.setBadgeText({ text: "" });
}

function notify(options) {
  chrome.notifications.create("", options);
}
