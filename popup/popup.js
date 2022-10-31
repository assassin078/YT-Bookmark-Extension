import { getActiveTab } from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const currentTab = await getActiveTab();

    if (currentTab.url.includes("youtube.com/watch")) {
        const videoId = currentTab.url.split("=")[1];
        const currentBookmarks = await fetchBookmarks(videoId);
        viewBookmarks(currentBookmarks);
    } else {
        const title = document.querySelector(".title");
        title.textContent = "This is not a youtube video page !";
    }
});

const viewBookmarks = async (currentBookmarks) => {
    const bookmarksContainer = document.getElementById("bookmarks");
    if (!currentBookmarks.length) {
        bookmarksContainer.innerHTML = `<i class="row">No bookmarks to show !</i>`;
        return;
    }
    bookmarksContainer.textContent = "";
    for (const bookmark of currentBookmarks) {
        addNewBookmark(bookmark);
    }
};

const addNewBookmark = (bookmark) => {
    const bookmarkElement = document.createElement("div");
    bookmarkElement.id = "bookmark-" + bookmark.timeStamp;
    bookmarkElement.className = "bookmark";
    bookmarkElement.setAttribute("timeStamp", bookmark.timeStamp);

    const bookmarkTitle = document.createElement("div");
    bookmarkTitle.textContent = bookmark.description;
    bookmarkTitle.className = "bookmark-title";

    const bookmarkControls = document.createElement("div");
    bookmarkControls.className = "bookmark-controls";
    setBookmarkControl("play", onPlay, bookmarkControls);
    setBookmarkControl("delete", onDelete, bookmarkControls);

    bookmarkElement.appendChild(bookmarkTitle);
    bookmarkElement.appendChild(bookmarkControls);

    const bookmarksContainer = document.getElementById("bookmarks");
    bookmarksContainer.appendChild(bookmarkElement);
};

const setBookmarkControl = (src, eventListener, parentElement) => {
    const bookmarkControl = document.createElement("img");
    bookmarkControl.src = chrome.runtime.getURL("../assets/" + src + ".png");
    bookmarkControl.title = src;
    bookmarkControl.addEventListener("click", eventListener);
    parentElement.appendChild(bookmarkControl);
};

const onPlay = async (e) => {
    const timeStamp =
        e.target.parentElement.parentElement.getAttribute("timeStamp");

    const activeTab = await getActiveTab();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        timeStamp: timeStamp,
    });
};

const onDelete = async (e) => {
    const timeStamp =
        e.target.parentElement.parentElement.getAttribute("timeStamp");

    const activeTab = await getActiveTab();

    chrome.tabs.sendMessage(
        activeTab.id,
        {
            type: "DELETE",
            timeStamp: timeStamp,
        },
        viewBookmarks
    );
};

const fetchBookmarks = (videoId) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            resolve(data[videoId] ? JSON.parse(data[videoId]) : []);
        });
    });
};
