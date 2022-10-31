import { getActiveTab } from "./utils.js";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status == "complete" &&
        tab.url.includes("youtube.com/watch")
    ) {
        const videoId = tab.url.split("=")[1];
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: videoId,
        });
    }
});

chrome.commands.onCommand.addListener(async (command) => {
    const activeTab = await getActiveTab();
    if (activeTab.url && activeTab.url.includes("youtube.com/watch")) {
        chrome.tabs.sendMessage(activeTab.id, {
            type: command,
        });
    }
});
