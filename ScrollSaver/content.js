
chrome.storage.local.get(['mySavedUrls', 'scrollPositions'], async function(result) {
    const existingUrls = result.mySavedUrls || [];
    if (existingUrls.includes(location.href)) {
        index = existingUrls.indexOf(location.href);
        const newElement = document.createElement("div");
        newElement.setAttribute("id", "newAnchor");
        newElement.textContent = "Anchor is here...";
        newElement.style.position = "absolute";
        newElement.style.left = "0px";
        newElement.style.top = result.scrollPositions[index][1] + "px";
        newElement.style.backgroundColor = "red";
        newElement.style.padding = "10px";
        newElement.style.zIndex = "10000";

        document.body.appendChild(newElement);
        if(result.scrollPositions){
            window.addEventListener('load', () => {
                window.scrollTo(result.scrollPositions[index][0], result.scrollPositions[index][1]);
            });
        }
    }

    window.navigation.addEventListener("navigate", () =>{
        console.log('location changed!');
        const anchor = document.getElementById("newAnchor");
        if (existingUrls.includes(location.href)){
            if (anchor) {
                anchor.style.visibility = "hidden";
            }
        } else {
            if (anchor) {
                anchor.style.visibility = "visible";
            }
        }
    });
});

