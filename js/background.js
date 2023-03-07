function onMessage(request, sender, sendResponse) {
  if (request.method == "saveStats") { 
    console.log("Запазване на статистиката...");
    console.log ("Добавяне " + request.kopeiki + " копейки към статистиката.");
    chrome.storage.sync.get({
      kopeiki: 0,
      pages: 0
    }, function(items) {
      chrome.storage.sync.set({
        kopeiki: items.kopeiki + request.kopeiki,
        pages: items.pages + 1
      });
    });
    sendResponse({});
  } else {
    // Show icon
    console.log("Putting badge on address bar.");
    chrome.pageAction.show(sender.tab.id);

    chrome.storage.sync.get({
      filter: 'mild'
    }, function(items) {
      console.log("Филтриране на " + items.filter + " настройка.");
    });
    sendResponse({});
  }
}

chrome.runtime.onMessage.addListener(onMessage);
