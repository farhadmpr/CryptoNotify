const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const txtCurrency = document.getElementById("txtCurrency");

function btnStartClick() {
  const _data = {
    srcCurrency: txtCurrency.value,
    dstCurrency: "rls",
  };

  chrome.extension.getBackgroundPage().fetchCurrency(3000, _data);
}

function btnStopClick(){    
    chrome.extension.getBackgroundPage().stopFetch()
}

btnStart.addEventListener("click", btnStartClick);
btnStop.addEventListener("click", btnStopClick);
