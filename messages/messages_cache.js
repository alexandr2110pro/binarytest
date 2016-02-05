var _ = require('lodash');
var cache = {};
var messagesCount = 0;


module.exports = {
    put,
    eject
};

/**
 * Creates an internal unique cache id, adds the message to cache, and returns the created id.
 * 
 * @return {number} id the message's id
 **/
function put(message) {
    var id = createID();
    cache[id] = message;

    return id;
}

/**
 * TODO: Decide the better name for that method.
 * 
 * Retrieves the message from the cache by id and removes every message, that was created before that message.
 * 
 * @param {number} id 
 * 
 * @return {object} message
 */
function eject(id) {
    var msg = cache[id];
    cleanUp(id);

    return msg;
}

/**
 * Removes all messages, created before the message with the targetID.
 */
function cleanUp(targetId) {
    _.map(cache, (message, id) => {
        // if 2 new messages are received within a short interval, the "minute ago" will be the same message
        // for both of them. So we're removing only messages before the ejected message.
        if (parseInt(id, 10) < parseInt(targetId, 10)) delete cache[id];
    });

}

/**
 * Creates an unique cache id to store a new item with.
 * @returns {number} id
 * */
function createID(argument) {
    return messagesCount++;
}