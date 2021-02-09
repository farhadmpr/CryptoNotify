const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const selectCurrency = document.getElementById("selectCurrency");
const txtPriceOffset = document.getElementById("txtPriceOffset");
const notifyEnabled = document.getElementById("notifyEnabled");
const timerInterval = 3000;

function btnStartClick() {
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
    iconUrl: "/icon.png",
    type: "basic",
  });
}

function btnStopClick() {
  chrome.extension.getBackgroundPage().stopFetch();
  chrome.extension.getBackgroundPage().notify({
    title: `Stop ${selectCurrency.value.toUpperCase()}`,
    message: "Fetch stoped successfully!",
    iconUrl: "/icon.png",
    type: "basic",
  });
}

function selectCurrencyChange() {
  chrome.storage.local.set({ currency: selectCurrency.value });
}

function txtPriceOffsetChange() {
  chrome.extension.getBackgroundPage().priceChangeOffset = txtPriceOffset.value;
}

function notifyEnabledChange(event) {
  chrome.extension.getBackgroundPage().notifyEnabled = event.target.checked;
}

btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);
selectCurrency.addEventListener("change", selectCurrencyChange);
txtPriceOffset.addEventListener("change", txtPriceOffsetChange);
notifyEnabled.addEventListener("change", notifyEnabledChange);

chrome.storage.local.get(["currency"], function (result) {
  selectCurrency.value = result.currency;
});

txtPriceOffset.value = chrome.extension.getBackgroundPage().priceChangeOffset;
notifyEnabled.checked = chrome.extension.getBackgroundPage().notifyEnabled;
