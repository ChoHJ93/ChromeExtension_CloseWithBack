let backButtonPressed = false;

chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    if (response.isActive) {
        activateExtension();
    } 
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleExtension") {
        if (message.isActive) {
            activateExtension();
        } else {
            deactivateExtension();
        }
    }
});

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

        backButtonPressed = true;

        setTimeout(() => {
            if (backButtonPressed) {
                chrome.runtime.sendMessage({ action: "checkAndCloseCurrentTab" });
            }
        }, 10); 
    }
}

function handlePopState() {
    if (backButtonPressed) {
        backButtonPressed = false;
    }
}
