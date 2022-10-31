(async () => {
    const utils = chrome.runtime.getURL("utils.js"); // returning path of the given module
    const { formatTime, fetchBookmarks } = await import(utils);

    let YTPlayer,
        YTLeftControls,
        currentVideo,
        currentBookmarks,
        addBookmarkControl;

    chrome.runtime.onMessage.addListener((message, sender, response) => {
        const { type, videoId, timeStamp } = message;
        if (type == "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type == "TIMESTAMP") {
            addBookmarkControl.click();
        } else if (type == "PLAY") {
            YTPlayer.currentTime = timeStamp;
        } else if (type == "DELETE") {
            currentBookmarks = currentBookmarks.filter(
                (bookmark) => bookmark.timeStamp != timeStamp
            );

            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(currentBookmarks),
            });

            response(currentBookmarks);
        }
    });

    const newVideoLoaded = async () => {
        YTPlayer = document.querySelector(".video-stream");
        YTLeftControls = document.querySelector(".ytp-left-controls");
        currentBookmarks = await fetchBookmarks(currentVideo);
        // Setup add bookmark control button
        addBookmarkControl = document.createElement("img");
        addBookmarkControl.src = chrome.runtime.getURL("./assets/bookmark.png");
        addBookmarkControl.className = "ytp-btn " + "bookmark-btn";
        addBookmarkControl.title = "Click to bookmark current timestamp !";
        addBookmarkControl.addEventListener("click", addBookmarkEventHandler);

        YTLeftControls.appendChild(addBookmarkControl);
    };

    const addBookmarkEventHandler = async () => {
        const timeStamp = YTPlayer.currentTime;
        const newBookmark = {
            timeStamp: timeStamp,
            description: `Bookmarked at ${formatTime(timeStamp)}`,
        };

        currentBookmarks = [...currentBookmarks, newBookmark];

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify(currentBookmarks),
        });
    };
})();
