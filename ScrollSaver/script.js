document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('loadPage').addEventListener('click', function() {
    chrome.tabs.create({ url: "http://www.crouton.net/" });
  });
});