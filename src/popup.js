const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const selectCurrency = document.getElementById("selectCurrency");

function btnStartClick() {
  if (!selectCurrency.value) return;

  if (chrome.extension.getBackgroundPage().timer) return;

  const _data = {
    srcCurrency: selectCurrency.value,
    dstCurrency: "rls",
  };

  chrome.extension.getBackgroundPage().fetchCurrency(3000, _data);

  chrome.extension.getBackgroundPage().notify({
    title: "Start",
    message: "Fetch started successfully!",
    iconUrl: "/icon.png",
    type: "basic",
  });
}

function btnStopClick() {
  chrome.extension.getBackgroundPage().stopFetch();
  chrome.extension.getBackgroundPage().notify({
    title: "Stop",
    message: "Fetch stoped successfully!",
    iconUrl: "/icon.png",
    type: "basic",
  });
}

function selectCurrencyChange() {
  chrome.storage.local.set({ currency: selectCurrency.value });
}

btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);
selectCurrency.addEventListener("change", selectCurrencyChange);

chrome.storage.local.get(["currency"], function (result) {
  selectCurrency.value = result.currency;
});
