var _ = require('lodash');

const ALLOWED_DIFF = 300;
const TIMER_LIFE_TIME = 120000;
const USE_STRICT_TIME_MATCH = false;

var timers = []

module.exports = {
    startNew,
    getIDWithinInterval
};


/**
 * Returns the message ID that have been registered specific time ago.
 * Returns null, if nothing found.
 * 
 * @param {number} interval time in milliseconds
 * 
 * @returns {number|null} id or null
 * */
function getIDWithinInterval(interval) {
    var timer = findInHistory(interval);
    var id = timer ? timer.messageID : null;

    return id;
}


/**
 * Trying to find a {@link Timer} object that has been created at the specific moment or earlier.
 * The moment is defined by the `interval` argument and calculated as current time - interval
 * If the `USE_STRICT_TIME_MATCH` const is true, it would find only timer that represents exact moment and will not return earlier timers.
 * The `exact` mode is matched using {@link Timer#exactMatchesInterval} method.
 * Also, it will check each timer's expired state and remove expired.
 * 
 * @param {number} interval time in milliseconds
 * 
 * @returns {Timer} timer object
 * */
function findInHistory(interval) {
    var currentTime = Date.now()

    return timers.reduce((result, timer) => {
        if (timer.isExpired()) {
            timer.remove();
            return null;
        }

        if (USE_STRICT_TIME_MATCH === true) {
            return timer.exactMatchesInterval(currentTime, interval) ? timer : result || null;
        }

        if (timer.matchesInterval(currentTime, interval)) return timer;

        return result;

    }, null);
}


/**
 * Creates a new timer for the message starting from the current moment.
 * */
function startNew(messageID) {
    var currentTime = Date.now();
    timers.push(new Timer(currentTime, messageID));
}




/**
 * "Timer" type that represents the starting point of the time counter for specific message.
 * Provides methods to compare times and other.
 * 
 * Each "Timer" will be deleted if it lives longer, than {@link TIMER_LIFE_TIME}
 * Expired state is checked on each search in history {@link findInHistory}
 * 
 * @constructor
 * @param {number} currentTime
 * @param {number|string} messageID
 **/
function Timer(currentTime, messageID) {
    this.time = currentTime;
    this.messageID = messageID;
}

Timer.prototype.exactMatchesInterval = function (currentTime, interval) {
    return Math.abs(this.getDiff(currentTime) - interval) <= ALLOWED_DIFF;
}

Timer.prototype.matchesInterval = function (currentTime, interval) {
    return this.getDiff(currentTime) >= parseInt(interval, 10);
}

Timer.prototype.getDiff = function (currentTime) {
    return currentTime - this.time;
}
Timer.prototype.isExpired = function () {
    return this.getDiff(Date.now()) >= TIMER_LIFE_TIME;
}

Timer.prototype.remove = function () {
    _.remove(timers, {
        time: this.time
    });
}
