
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
  <img src="https://img.shields.io/npm/v/dogehouse.js?style=for-the-badge">
  <img src="https://img.shields.io/npm/dw/dogehouse.js?style=for-the-badge">
</p>

<h3 align="center">
  <a href="https://dogehouse.xyz">Website</a>
  <span> . </span>
  <a href="https://github.com/dogegarden/dogehouse.js/blob/master/Documentation/CONTRIBUTION.md">Contributing</a>
  <span> · </span>
  <a href="https://discord.gg/Nu6KVjJYj6">Discord</a>
  <span> · </span>
  <a href="https://docs.dogehouse.xyz">Documentation</a>
</h3>

---
## NPM Package <img src="https://img.shields.io/npm/v/dogehouse.js?style=for-the-badge">

- Our NPM package is the quickest and easiest way to jump in with dogehouse.js.
- [dogehouse.js package](https://www.npmjs.com/package/dogehouse.js)

## Installation

1. Go to [DogeHouse](https://dogehouse.tv)
2. Open Developer options (F12 or Ctrl+Shift+I)
3. Go to Application > Local Storage > dogehouse.tv
4. Copy your token and refresh-token and put them in an .env file:

```
DOGEHOUSE_TOKEN=<token>
DOGEHOUSE_REFRESH_TOKEN=<refresh-token>
```

5. Install [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/).

## Examples

- All examples like, sending messages, joining rooms, music, moderation and more are in [/examples.](https://github.com/dogegarden/dogehouse.js/tree/master/examples)

### JavaScript Example
- Get Popular Rooms
```js
const { Client } = require('dogehouse.js');
const app = new Client();
app.connect(process.env.DOGEHOUSE_TOKEN, process.env.DOGEHOUSE_REFRESH_TOKEN).then(async () => {
    console.log('Bot connected!');
    console.log(await app.rooms.top); // Log all of your top rooms to console
});
```

## Credits

Thank you to [ Abalon#2525 ](https://github.com/alon-abadi) for the awesome logo!
