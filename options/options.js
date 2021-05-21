/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {

    function getChatId() {
        const chatId = document.querySelector("#chatId");
        if (chatId){
            return chatId.value;
        }
        return '';
    }

    function getBotId() {
        const botId = document.querySelector("#botId");
        if (botId){
            return botId.value;
        }
        return '';
    }

    const chatId = getChatId();
    const botId = getBotId();
    console.log('setting ', {
        chatId,
        botId
    })
    browser.storage.local.set({
        chatId,
        botId
    });
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
    const chatId = document.querySelector("#chatId");
    chatId.value = restoredSettings.chatId;

    const botId = document.querySelector("#botId");
    botId.value = restoredSettings.botId;
}

function onError(e) {
    console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On clicking the save button, save the currently selected settings.
*/
const saveButton = document.querySelector("#save-button");
console.log('saveButton ', saveButton);
saveButton.addEventListener("click", storeSettings);
