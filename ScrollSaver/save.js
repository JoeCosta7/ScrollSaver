document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById("savePage");
    button.addEventListener("click", function () {
    chrome.storage.local.set({'mySavedUrl': getCurrentTabUrl()}, function() {
    console.log('URL saved!');
    document.getElementById("link").innerHTML = "";
})
})
});

async function getCurrentTabUrl() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log("Current URL: ", tab.url);
    return tab.url;
}