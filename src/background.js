let timer = null;
let lastPrice = 0;
const priceChangeOffset = 100;

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

        // show last 5 chars of price
        chrome.browserAction.setBadgeText({ text: result.toLocaleString().substr(-5) });

        if (result > lastPrice + priceChangeOffset) {
          notify({
            title: "Price +",
            message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (+${result-lastPrice})`,
            iconUrl: "/icon.png",
            type: "basic",
          });
        }

        if (result < lastPrice - priceChangeOffset) {
          notify({
            title: "Price -",
            message: `${lastPrice.toLocaleString()} ➜ ${result.toLocaleString()} (${result-lastPrice})`,
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
  chrome.browserAction.setBadgeText({ text: "" });
}

function notify(options) {
  chrome.notifications.create("", options);
}
