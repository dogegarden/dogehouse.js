/**
 * In this example you will see how you can send, 
 * revieve, and reply to chat messages.
 */

const { Client } = require('dogehouse-js');
const app = new Client();

app.connect(process.env.DOGEHOUSE_TOKEN, process.env.DOGEHOUSE_REFRESH_TOKEN).then(async () => {
    console.log('Bot connected!');
    app.rooms.join("YOUR ROOM ID");
});

app.on('newChatMessage', msg => {
    console.log(`${msg.author.username}: ${msg}`); // Log user messages to console
});