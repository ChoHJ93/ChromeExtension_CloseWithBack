let isActive = true;

chrome.storage.sync.get(['isActive'], function (result) {
    isActive = result.isActive ?? true;
});

chrome.action.onClicked.addListener(() => {
    isActive = !isActive;
    chrome.action.setIcon({
        path: isActive ? {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        } : {
            "16": "icons/icon16_off.png",
            "48": "icons/icon48_off.png",
            "128": "icons/icon128_off.png"
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "getStatus") {
        sendResponse({ isActive });
    } else if (message.action === "checkAndCloseCurrentTab" && isActive) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const currentTab = tabs[0];
                const tabId = currentTab.id;
				
                chrome.tabs.remove(tabId, function () {
                    if (chrome.runtime.lastError) {
                        console.error("탭 닫기 중 오류 발생:", chrome.runtime.lastError);
                    } 
                });
            }
        });
        sendResponse({ result: "탭 상태 확인 및 닫기 요청 처리 완료" });
    }

    return true; // 비동기 sendResponse 호출을 위해 true 반환
});

