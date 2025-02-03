let websiteVisitData = {};
let tabStartTime = {}; 

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  const currentTime = Date.now();
  if (tabStartTime[tabId]) {
    const prevTabUrl = tabStartTime[tabId].url;
    const timeSpentOnPreviousTab = currentTime - tabStartTime[tabId].time;
    if (websiteVisitData[prevTabUrl]) {
      websiteVisitData[prevTabUrl].timeSpent += timeSpentOnPreviousTab;
      chrome.storage.local.set({ websiteVisitData });
    }
  }
  chrome.tabs.get(tabId, (tab) => {
    const url = tab.url;
    tabStartTime[tabId] = { url, time: currentTime };

    if (!websiteVisitData[url]) {
      websiteVisitData[url] = {
        url,
        visitCount: 0,
        timeSpent: 0,
      };
    }

    websiteVisitData[url].visitCount += 1;
    chrome.storage.local.set({ websiteVisitData });
  });
});


chrome.tabs.onRemoved.addListener((tabId) => {
  const endTime = Date.now();
  const timeSpent = endTime - tabStartTime[tabId];
  delete tabStartTime[tabId];

  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab) {
      console.error(`Tab with ID ${tabId} is not available anymore.`);
      return;
    }

    const url = tab.url;
    if (websiteVisitData[url]) {
      websiteVisitData[url].timeSpent += timeSpent;
      chrome.storage.local.set({ websiteVisitData });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const oldUrl = tab.url;
    const newUrl = changeInfo.url;
    const endTime = Date.now();
    if (tabStartTime[tabId]) {
      const timeSpent = endTime - tabStartTime[tabId];
      if (websiteVisitData[oldUrl]) {
        websiteVisitData[oldUrl].timeSpent += timeSpent;
        chrome.storage.local.set({ websiteVisitData });
      }
    }
    tabStartTime[tabId] = Date.now();
    if (!websiteVisitData[newUrl]) {
      websiteVisitData[newUrl] = {
        url: newUrl,
        visitCount: 0,
        timeSpent: 0,
      };
    }
    websiteVisitData[newUrl].visitCount += 1;
    chrome.storage.local.set({ websiteVisitData });

  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getVisitData") {
    chrome.storage.local.get("websiteVisitData", (data) => {
      let websiteVisitData = data.websiteVisitData || {};
      let websiteArray = Object.entries(websiteVisitData);
      websiteArray.sort((a, b) => b[1].timeSpent - a[1].timeSpent);
      let top5Websites = websiteArray.slice(0, 5);
      let top5WebsiteData = {};
      top5Websites.forEach(([url, data]) => {
        top5WebsiteData[url] = data;
      });

      sendResponse(top5WebsiteData);
    });
    return true;
  }
});