function handleButtonClick(savedUrl, index) {
  chrome.storage.local.get(['scrollPositions'], async function(result) {
    const url = await getCurrentTabUrl();

    if(url!=savedUrl){
      chrome.tabs.create({ url: savedUrl }, newTab => {
        chrome.scripting.executeScript({
          target: { tabId: newTab.id },
          func: loadScrollPos,
          args: [result.scrollPositions[index][0],result.scrollPositions[index][1]]
        })
      })
    }
    else if (result.scrollPositions && result.scrollPositions[index]) {
      executeScroll(result.scrollPositions[index][0],result.scrollPositions[index][1]); 
    } else {
      console.log("no url");
    }
  });
};

function handleDeleteClick(savedUrl, index) {
        console.log(`Deleting URL: ${savedUrl} at index: ${index}`);
        chrome.storage.local.get(['mySavedUrls', 'scrollPositions'], function(result) {
        const urls = result.mySavedUrls || [];
        const scrollPositions = result.scrollPositions || [];

        urls.splice(index, 1);
        scrollPositions.splice(index, 1);

        chrome.storage.local.set({ 'mySavedUrls': urls, 'scrollPositions': scrollPositions }, function() {
            console.log('URL and scroll position deleted');
            displayUrls(urls);
        });
    });
}

function loadScrollPos(x, y) {
  window.scrollTo({
    left: x, 
    top: y,
    behavior: 'smooth'
  });
}

function executeScroll(x, y){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: loadScrollPos,
      args: [x,y]
    })
  })
}


