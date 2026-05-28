document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['saves'], function(result) {
        if (result.saves && result.saves.length > 0) {
            displayUrls(result.saves)
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
    });
});

function displayUrls(entries) {
    const linkElement = document.getElementById("link");
    linkElement.innerHTML = "";
    // TODO: put css in its own file
    if(entries.length === 0){
        document.getElementById("link").innerHTML = "No URL saved yet";
        return;
    }
    entries.forEach((entry) => {
        const urlContainer = document.createElement("div");
        urlContainer.style.borderBottom = "1px solid #ccc";
        urlContainer.style.paddingBottom = "10px";
        urlContainer.style.marginBottom = "10px";

        const urlTitle = document.createElement("strong");
        urlTitle.textContent = entry.url;
        urlContainer.appendChild(urlTitle);

        entry.positions.forEach((pos, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.gap = '10px';
            itemDiv.style.marginLeft = '15px';
            itemDiv.style.marginTop = '5px';

            const posText = document.createElement("p");
            posText.style.margin = "0";
            posText.textContent = `Position ${index + 1}: (X: ${pos[0]}, Y: ${pos[1]})`;

            const goButton = document.createElement("button");
            goButton.textContent = "Go";
            goButton.addEventListener("click", function () {
                handleButtonClick(entry.url, pos);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                handleDeleteClick(entry.url, pos);
            });

            itemDiv.appendChild(posText);
            itemDiv.appendChild(goButton);
            itemDiv.appendChild(deleteButton);
            urlContainer.appendChild(itemDiv);
        });

        linkElement.appendChild(urlContainer);
    });
}

async function getCurrentTabUrl() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    console.log("Current URL: ", tab.url);
    return tab.url;
}

async function requestScrollPosition() { //entries are saved here
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, {message: "scrollXY"});
    
    chrome.storage.local.get(['saves'], async function(result) {
        const saves = result.saves || [];
        const url = await getCurrentTabUrl();
        const existingEntry = saves.find(entry => entry.url === url);
        if (existingEntry) { //if urls already saved to this page, add to list
            existingEntry.positions.push(response.scrollPos);
        } else {
            saves.push({ //else, initialize the list
                url: url,
                positions: [response.scrollPos]
            });
        }
        chrome.storage.local.set({'saves':saves}, function() {
            console.log('scroll saved');
            displayUrls(saves);
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
        newElement.setAttribute("id", `anchor-${window.scrollX}-${window.scrollY}`);
        newElement.textContent = `Anchor ${window.scrollX}, ${window.scrollY}`;
        newElement.style.position = "absolute";
        newElement.style.left = "0px";
        newElement.style.top = window.scrollY + "px";
        newElement.style.backgroundColor = "red";
        newElement.style.padding = "10px";
        newElement.style.zIndex = "10000";

        document.body.appendChild(newElement);
    }
}
