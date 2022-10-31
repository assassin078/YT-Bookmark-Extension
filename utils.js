const getActiveTab = async () => {
    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return activeTab;
};

const fetchBookmarks = (videoId) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            resolve(data[videoId] ? JSON.parse(data[videoId]) : []);
        });
    });
};

const formatTime = (sec) => {
    console.log("Time Formated");
    const hour = Math.floor(sec / 3600);
    sec = sec % 3600;
    const min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    return `${hour < 10 ? "0" + hour : hour} : ${
        min < 10 ? "0" + min : min
    } : ${sec < 10 ? "0" + sec : sec}`;
};
export { getActiveTab, formatTime, fetchBookmarks };
