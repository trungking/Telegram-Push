/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
    console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
    console.log(`Error: ${error}`);
}

const defaultSettings = {
    botId: "",
    chatId: ""
};


/*
Create all the context menu items.
*/
browser.menus.create({
    id: "send-selection",
    title: 'Send Selection',
    contexts: ["selection"],
    icons: {
        "32": "icons/selected.png"
    }
}, onCreated);

browser.menus.create({
    id: "send-website",
    title: 'Send Website',
    contexts: ["all"],
    icons: {
        "32": "icons/url.png"
    }
}, onCreated);

browser.menus.create({
    id: "separator-1",
    type: "separator",
    contexts: ["all"]
}, onCreated);

browser.menus.create({
    id: "send-clipboard",
    title: 'Send Clipboard',
    contexts: ["all"],
    icons: {
        "32": "icons/clipboard.png"
    }
}, onCreated);

browser.menus.create({
    id: "send-custom-text",
    title: 'Send Custom Text',
    contexts: ["all"],
    icons: {
        "32": "icons/text.png"
    }
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "send-selection":
            sendSelection();
            break;
        case "send-website":
            console.log('send-website');
            sendWebsite();
            break;
        case "send-custom-text":
            sendCustomText();
            break;
        case "send-clipboard":
            sendClipboard();
            break;
        default:
            console.log('asfasf');
            break;
    }
});

function sendClipboard() {
    navigator.clipboard.readText().then(text => {
        send(text);
    });
}

function sendCustomText() {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        const tab = tabs[0];
        browser.tabs.executeScript(tab.id, { code: 'prompt("Enter text", "")', }).then(text => {
            if (text[0]) {
                send(text[0]);
            }
        })

    }, console.error);
}

function sendSelection() {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        const tab = tabs[0];
        browser.tabs.executeScript(tab.id, { code: 'getSelection()+""', }).then(text => {
            send(text[0]);
            sendWebsite();
        })

    }, console.error);
}

function sendWebsite() {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        const tab = tabs[0];
        send(tab.url);
    }, console.error);
}

function send(message) {
    const gettingStoredSettings = browser.storage.local.get();
    gettingStoredSettings.then(settings => {
        console.log("setting: ", settings);
        if (!settings.chatId || !settings.botId) {
            browser.runtime.openOptionsPage();
            return;
        }
        const { chatId, botId } = settings;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "chat_id": chatId, "text": message, "disable_web_page_preview": true });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://api.telegram.org/bot${botId}/sendMessage`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }, onError);
}