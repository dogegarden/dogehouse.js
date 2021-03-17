<p align="center">
  <img src="https://cdn.discordapp.com/attachments/820450983892222022/820961073980899328/dogegarden-bottom-cropped.png" alt="DogeGarden logo" />
</p>
<p align="center">
  <strong>Client-side implementation of DogeHouse API. 🐶</strong>
</p>
<p align="center">
  <a href="https://discord.gg/Nu6KVjJYj6">
    <img src="https://img.shields.io/discord/820442045264691201?style=for-the-badge" alt="discord - users online" />
  </a>
  <img src="https://img.shields.io/npm/v/dogehouse-js?style=for-the-badge">
</p>

<h3 align="center">  
  <a href="CONTRIBUTING.md">Contribute (soon)</a>
  <span> · </span>
  <a href="https://discord.gg/Nu6KVjJYj6">Discord</a>
  <span> · </span>
  <a href="https://docs.dogehouse.xyz">Documentation</a>
</h3>

---

## NPM Package
  <img src="https://img.shields.io/npm/v/dogehouse-js?style=for-the-badge">
- Our NPM package is the quickest and easiest way to jump in with dogehouse-js. 

- NPM: https://www.npmjs.com/package/dogehouse-js
## Installation

1. Go to https://dogehouse.tv
2. Open Developer options (F12 or Ctrl+Shift+I)
3. Go to Application > Local Storage > dogehouse.tv
4. Copy your token and refresh-token and put them in an .env file:
```
DOGEHOUSE_TOKEN=<token>
DOGEHOUSE_REFRESH_TOKEN=<refresh-token>
```
5. Install NodeJS and NPM.

## Wrapper
### The goal of the Wrapper is to provide premade functions for your ease.

- All examples like, sending messages, joining rooms and more are in /examples.

### Example - Get Popular Rooms
```js
const { raw: { connect }, wrap } = require('dogehouse-js');

const main = async () => {
  try {
    const connection = await connect(
      process.env.DOGEHOUSE_TOKEN,
      process.env.DOGEHOUSE_REFRESH_TOKEN,
      {
        onConnectionTaken: () => {
          console.error('Another web socket connection has been opened. This usally means that you have logged in from somewhere else.');
        }
      }
    );

    const wrapper = wrap(connection);
    
    const rooms = await wrapper.getTopPublicRooms();
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
```

## Credits
Original author and implementation: Ilya Maximov <mail@overlisted.net> (https://overlisted.net) https://github.com/overlisted
Thank you to Abalon#2525/https://github.com/alon-abadi for the awesome logo!

