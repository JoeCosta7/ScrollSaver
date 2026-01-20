
chrome.storage.local.get(['mySavedUrls', 'scrollPos'], async function(result) {
    const existingUrls = result.mySavedUrls || [];
    if (existingUrls.includes(location.href)) {
        const newElement = document.createElement("div");
        newElement.setAttribute("id", "newAnchor");
        newElement.textContent = "Anchor is here...";
        newElement.style.position = "absolute";
        newElement.style.left = "0px";
        newElement.style.top = result.scrollPos[1] + "px";
        newElement.style.backgroundColor = "red";
        newElement.style.padding = "10px";
        newElement.style.zIndex = "10000";

        document.body.appendChild(newElement);
        if(result.scrollPos){
            window.scrollTo(result.scrollPos[0], result.scrollPos[1]);
        }
    }

    window.navigation.addEventListener("navigate", () =>{
        console.log('location changed!');
        if (existingUrls.includes(location)){
            document.getElementById("newAnchor").style.visibility = "hidden";
        }
        else{
            document.getElementById("newAnchor").style.visibility = "visible";
        }
    });
});

