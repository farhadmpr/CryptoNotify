const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const txtCurrency = document.getElementById("txtCurrency");

function btnStartClick() {
  const _data = {
    srcCurrency: txtCurrency.value,
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

btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);
