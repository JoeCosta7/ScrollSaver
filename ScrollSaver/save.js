document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['mySavedUrls'], function(result) {
        if (result.mySavedUrls && result.mySavedUrls.length > 0) {
            displayUrls(result.mySavedUrls)
        } else {
            document.getElementById("link").innerHTML = "No URL saved yet";
        }
    });
    const button = document.getElementById("savePage");
    button.addEventListener("click", async function () {
        
        const url = await getCurrentTabUrl();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.scripting.executeScript( {
                target: { tabId: tabs[0].id },
                func: sendScrollPosition,
              })
              .then(requestScrollPosition);
            })
        
        chrome.storage.local.get({'mySavedUrls': []}, function(result) {
            const existingUrls = result.mySavedUrls || [];
            existingUrls.push(url);
            chrome.storage.local.set({'mySavedUrls': existingUrls}, function() {
                console.log('URL saved!');
                displayUrls(existingUrls);
            });
        });
    });
});

function displayUrls(urls) {
    const linkElement = document.getElementById("link");
    linkElement.innerHTML = "";
    //TODO: put css in own file
    urls.forEach((url, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.style.marginBottom = "10px";
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.gap = '10px';

        const urlText = document.createElement("p");
        urlText.textContent = url;

        const button = document.createElement("button");
        button.textContent = "Go";
        button.addEventListener("click", async function () {
            handleButtonClick(url, index)
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async function () {
            handleDeleteClick(url, index);
        });

        itemDiv.appendChild(urlText);
        itemDiv.appendChild(button);
        itemDiv.appendChild(deleteButton);
        linkElement.appendChild(itemDiv);
    });
}

async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    console.log("Current URL: ", tab.url);
    return tab.url;
}

async function requestScrollPosition() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, {message: "scrollXY"});
    
    chrome.storage.local.get(['scrollPositions'], function(result) {
        const scrollPositions = result.scrollPositions || [];
        scrollPositions.push(response.scrollPos);
        chrome.storage.local.set({'scrollPositions': scrollPositions}, function() {
            console.log('scroll saved');
        });
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
