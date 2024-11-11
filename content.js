let backButtonPressed = false;

function initializeExtension() {
    checkExtensionStatus((isActive) => {
        if (isActive) {
            activateExtension();
        } else {
            deactivateExtension();
        }
    });
}

function checkExtensionStatus(callback) {
    try {
        chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("백그라운드 스크립트와의 통신 오류:", chrome.runtime.lastError.message);
                callback(false); // 오류 발생 시 false 반환
            } else {
                callback(response && response.isActive);
            }
        });
    } catch (error) {
        console.error("메시지 전송 시 예외 발생:", error);
        callback(false);
    }
}

function activateExtension() {
    window.addEventListener('mouseup', handleMouseUp, false);
    window.addEventListener('popstate', handlePopState);
}

function deactivateExtension() {
    window.removeEventListener('mouseup', handleMouseUp, false);
    window.removeEventListener('popstate', handlePopState);
}

function handleMouseUp(event) {
    if (event.button === 3) {
        checkExtensionStatus((isActive) => {
            if (isActive) {
                backButtonPressed = true;

                setTimeout(() => {
                    if (backButtonPressed) {
                        try {
                            chrome.runtime.sendMessage({ action: "checkAndCloseCurrentTab" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("메시지 전송 중 오류 발생:", chrome.runtime.lastError.message);
                                }
                            });
                        } catch (error) {
                            console.error("메시지 전송 시 예외 발생:", error);
                        }
                    }
                }, 50); // 대기 시간
            } 
        });
    }
}

function handlePopState() {
    if (backButtonPressed) {
        backButtonPressed = false;
    }
}

initializeExtension();
