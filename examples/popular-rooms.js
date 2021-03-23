const { Client } = require('dogehouse-js');
const app = new Client();

app.connect(process.env.DOGEHOUSE_TOKEN, process.env.DOGEHOUSE_REFRESH_TOKEN).then(async () => {
    console.log('Bot connected!');
    console.log(await app.rooms.top); // Log all of your top rooms to console
});