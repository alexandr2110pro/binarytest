var messagesCache = require("./messages_cache");
var timer = require("./timer");

module.exports = {
    acceptMessage: acceptMessage
};


/**
 * TODO: add checking of the message type.
 * Handles the incomming message.
 * 
 * */
function acceptMessage(message) {
    var msg = JSON.parse(message);
    var currentMessageId = messagesCache.put(msg);

    timer.startNew(currentMessageId);

    printRate(msg);

    var previousMessageId = timer.getIDWithinInterval(10000);

    if (previousMessageId !== null) {
        printRate(messagesCache.eject(previousMessageId), true);
    }
}


function getTimeString() {
    var t = new Date();
    return t.toLocaleTimeString();
}

function printRate(messageObj, isDebouncedMessage) {
    console.log(`[${getTimeString()}]
    ${isDebouncedMessage?'a minute ago the quote was:': 'The quote is:'} ${messageObj.tick.quote}`);

}