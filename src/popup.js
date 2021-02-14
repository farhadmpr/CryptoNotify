const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const selectCurrency = document.getElementById("selectCurrency");
const txtPriceOffset = document.getElementById("txtPriceOffset");
const txtTargetPrice = document.getElementById("txtTargetPrice");
const notifyPriceOffset = document.getElementById("notifyPriceOffset");
const notifyTargetPrice = document.getElementById("notifyTargetPrice");
const resultBody = document.getElementById("resultBody");
const selectTargetPriceType = document.getElementById("selectTargetPriceType");
const timerInterval = 3000;

function btnStartClick(event) {
  if (!selectCurrency.value) return;

  if (chrome.extension.getBackgroundPage().timer) return;

  const _data = {
    srcCurrency: selectCurrency.value,
    dstCurrency: "rls",
  };

  chrome.extension.getBackgroundPage().fetchCurrency(timerInterval, _data);

  chrome.extension.getBackgroundPage().notify({
    title: `Start ${selectCurrency.value.toUpperCase()}`,
    message: "Fetch started successfully!",
    iconUrl: "./icons/icon32.png",
    type: "basic",
  });

  event.target.disabled = true;
  btnStop.disabled = false;
  selectCurrency.disabled = true;
}

function btnStopClick(event) {
  chrome.extension.getBackgroundPage().stopFetch();
  chrome.extension.getBackgroundPage().notify({
    title: `Stop ${selectCurrency.value.toUpperCase()}`,
    message: "Fetch stoped successfully!",
    iconUrl: "./icons/icon32.png",
    type: "basic",
  });

  event.target.disabled = true;
  btnStart.disabled = false;
  selectCurrency.disabled = false;
}

function selectCurrencyChange() {
  chrome.storage.local.set({ currency: selectCurrency.value });
}

function txtPriceOffsetChange() {
  chrome.extension.getBackgroundPage().priceChangeOffset = txtPriceOffset.value;
}

function notifyPriceOffsetChange(event) {
  chrome.extension.getBackgroundPage().notifyPriceOffset = event.target.checked;
}

function txtTargetPriceChange() {
  chrome.extension.getBackgroundPage().priceTarget = txtTargetPrice.value;
}

function notifyTargetPriceChange(event) {
  chrome.extension.getBackgroundPage().notifyTargetPrice = event.target.checked;
}

function selectTargetPriceTypeChange(event) {
  chrome.extension.getBackgroundPage().priceTargetType = event.target.value;
}

function showResult() {
  const _data = {
    srcCurrency: "btc,eth,ltc,xrp,bch,bnb,eos,xlm,etc,trx,doge",
    dstCurrency: "rls",
  };

  setInterval(() => {
    fetch("https://api.nobitex.ir/market/stats", {
      method: "POST",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        resultBody.innerHTML = "";
        for (const crypto in json.stats) {
          let tr = document.createElement("tr");
          tr.innerHTML = `
              <td>${crypto.split("-")[0].toUpperCase()}</td>
              <td>${(json.stats[crypto].latest / 10).toLocaleString()}</td>
              <td>${(json.stats[crypto].bestSell / 10).toLocaleString()}</td>
              <td>${(json.stats[crypto].bestBuy / 10).toLocaleString()}</td>
              <td dir="ltr" class=${
                json.stats[crypto].dayChange >= 0
                  ? "text-success"
                  : "text-danger"
              }>${json.stats[crypto].dayChange.toLocaleString()}%</td>
            `;
          resultBody.appendChild(tr);
        }
      })
      .catch((err) => {
        chrome.extension.getBackgroundPage().console.log(err);
      });
  }, timerInterval);
}

btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);
selectCurrency.addEventListener("change", selectCurrencyChange);
txtPriceOffset.addEventListener("change", txtPriceOffsetChange);
notifyPriceOffset.addEventListener("change", notifyPriceOffsetChange);
txtTargetPrice.addEventListener("change", txtTargetPriceChange);
notifyTargetPrice.addEventListener("change", notifyTargetPriceChange);
selectTargetPriceType.addEventListener("change", selectTargetPriceTypeChange);

chrome.storage.local.get(["currency"], function (result) {
  selectCurrency.value = result.currency;
});

txtPriceOffset.value = chrome.extension.getBackgroundPage().priceChangeOffset;
notifyPriceOffset.checked = chrome.extension.getBackgroundPage().notifyPriceOffset;

txtTargetPrice.value = chrome.extension.getBackgroundPage().priceTarget;
notifyTargetPrice.checked = chrome.extension.getBackgroundPage().notifyTargetPrice;

selectTargetPriceType.value = chrome.extension.getBackgroundPage().priceTargetType;

btnStart.disabled = chrome.extension.getBackgroundPage().timer !== null;
btnStop.disabled = !btnStart.disabled;
selectCurrency.disabled = btnStart.disabled;

showResult();
