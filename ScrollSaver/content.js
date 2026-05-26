
chrome.storage.local.get(['mySavedUrls', 'scrollPositions'], async function(result) {
    const existingUrls = result.mySavedUrls || [];
    if (existingUrls.includes(location.href)) {
        const newElement = document.createElement("div");
        newElement.setAttribute("id", "newAnchor");
        newElement.textContent = "Anchor is here...";
        newElement.style.position = "absolute";
        newElement.style.left = "0px";
        newElement.style.top = result.scrollPositions[1] + "px";
        newElement.style.backgroundColor = "red";
        newElement.style.padding = "10px";
        newElement.style.zIndex = "10000";

        document.body.appendChild(newElement);
        if(result.scrollPositions){
            window.scrollTo(result.scrollPositions[0], result.scrollPositions[1]);
        }
    }

    window.navigation.addEventListener("navigate", () =>{
        console.log('location changed!');
        if (existingUrls.includes(location.href)){
            document.getElementById("newAnchor").style.visibility = "hidden";
        }
        else{
            document.getElementById("newAnchor").style.visibility = "visible";
        }
    });
});

