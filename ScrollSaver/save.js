document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['mySavedUrls'], function(result) {
        if (result.mySavedUrls && result.mySavedUrls.length > 0) {
            const urlList = result.mySavedUrls.map(url => `<li>${url}</li>`).join('');
            document.getElementById("link").innerHTML = urlList;
        } else {
            document.getElementById("link").innerHTML = "No URL saved yet";
        }
    });
    const button = document.getElementById("savePage");
    button.addEventListener("click", async function () {
        
        const url = await getCurrentTabUrl();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: sendScrollPosition
              })
              .then(requestScrollPosition());
            })
        
        chrome.storage.local.get({'mySavedUrls': []}, function(result) {
            const existingUrls = result.mySavedUrls || [];
            existingUrls.push(url);
            chrome.storage.local.set({'mySavedUrls': existingUrls}, function() {
                console.log('URL saved!');

                const urlList = existingUrls.map(url => `<li>${url}</li>`).join('');
                document.getElementById("link").innerHTML = urlList;
            });
        });
    });
});

async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    console.log("Current URL: ", tab.url);
    return tab.url;
}

async function requestScrollPosition() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, {message: "scrollXY"});
    chrome.storage.local.set({'scrollPos': response.scrollPos}, function() {
            console.log('scroll saved');
        });
}

function sendScrollPosition(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message == "scrollXY") {
            sendResponse({ scrollPos: [window.scrollX,window.scrollY] });
        }
    });
    try{
        document.getElementById('newAnchor').style.top = window.scrollY + "px";
    } catch {
        const newElement = document.createElement("div");
        newElement.setAttribute("id", "newAnchor");
        newElement.textContent = "Anchor is here...";
        newElement.style.position = "absolute";
        newElement.style.left = "0px";
        newElement.style.top = window.scrollY + "px";
        newElement.style.backgroundColor = "red";
        newElement.style.padding = "10px";
        newElement.style.zIndex = "10000";

        document.body.appendChild(newElement);
    }
}
