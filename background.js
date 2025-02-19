chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.storage.local.get({ notes: [] }).then((data) => {
        let notes = data.notes || [];

        if (message.action === "save_note") {
            notes.push(message.note);
            chrome.storage.local.set({ notes }).then(() => {
                chrome.runtime.sendMessage({ action: "update_notes" });
            });
        }

        if (message.action === "get_notes") {
            sendResponse({ notes });
        }

        if (message.action === "delete_note") {
            notes.splice(message.index, 1);
            chrome.storage.local.set({ notes }).then(() => {
                chrome.runtime.sendMessage({ action: "update_notes" });
            });
        }
    });

    return true; // Keep the message channel open for async responses
});
