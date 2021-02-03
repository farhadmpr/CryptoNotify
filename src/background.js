let timer = null

function fetchCurrency(milisec, data) {
  timer = setInterval(function () {
    fetch("https://api.nobitex.ir/market/stats", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        const result = (
          // convert rial to toman
          json.stats[`${data.srcCurrency}-rls`].latest / 10
        ).toLocaleString();
        chrome.browserAction.setBadgeText({ text: result });
      })
      .catch((err) => alert(err));
  }, milisec);
}

function stopFetch(){
    clearInterval(timer)
    chrome.browserAction.setBadgeText({ text: "" });
}