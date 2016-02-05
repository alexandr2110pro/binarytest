/*

That was an additional reminder to use TDD *always*. 
It would have saved a lot of time today.

Also, I'm not sure, if the "quote" is the required property to print. But it looks like it is.

I didn't used the tick's object fields in the logic of that app because I wasn't sure, what does each field exactly mean and what to expect.
Now I'm getting familiar with  the data returned from the api and I suppose, there was an option to utilise it somehow. (at least epoch and original tick's IDs).
For some reason the API doesn't respond for the request with {"ticks": "frxUSDJPY"} sometimes. That was a bit confusing, and tooks some extra time as well.

Also, I have a feeling, that there is an api method to get a message by timestamp or something similar.


The implementation is till far not perfect. In the real world, there would be error handling,
less coupled components using events instead of method calls and more modular structure.

---------------------------------------------------------------------------   */

const WS_ENDPOINT = 'wss://ws.binaryws.com/websockets/v3';

var WebSocket = require("ws");
var messagesAggregator = require('./messages/messages_aggregator');

var client = new WebSocket(WS_ENDPOINT);

var request = {
    ticks: 'frxUSDJPY'
};

client.on('open', run);
client.on('message', onMessage);


// ----
function run(event) {
    console.log('Started');
    client.send(JSON.stringify(request));
}

function onMessage(message) {
    messagesAggregator.acceptMessage(message);
}


// DONE! )