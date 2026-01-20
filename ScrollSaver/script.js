function handleButtonClick(savedUrl, index) {
  chrome.storage.local.get(['scrollPositions'], async function(result) {
            const url = await getCurrentTabUrl();

            if(url!=savedUrl){
              chrome.tabs.create({ url: savedUrl })
            }
            if (result.scrollPositions && result.scrollPositions[index]) {
            executeScroll(result.scrollPos[index][0],result.scrollPos[index][1]); 
            
        } else {
            console.log("no url");
        }
      });
};

function loadScrollPos() {
    chrome.runtime.onMessage.addListener(message=>{
      if (message.scrollPos) {
          window.scrollTo(message.scrollPos[0], message.scrollPos[1]);
      }
  });
}

function executeScroll(x, y){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: loadScrollPos
    })
    .then(() => chrome.tabs.sendMessage(tabs[0].id,{scrollPos:[x,y]}));
  })
}


