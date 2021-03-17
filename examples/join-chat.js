// In this example we will search for all public rooms
// Get the highest one which is provided for us by DogeHouse
// Join it and setup 2-way terminal chat.

// All using the wrapper to fetch and send data.

require("dotenv").config();

const readline = require("readline");
const { raw: { connect }, wrap } = require('dogehouse-js');

const logger = (direction, opcode, data, fetchId, raw) => {
  const directionPadded = direction.toUpperCase().padEnd(3, " ");
  const fetchIdInfo = fetchId ? ` (fetch id ${fetchId})` : "";
  console.info(`${directionPadded} "${opcode}"${fetchIdInfo}: ${raw}`);
};

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

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${connection.user.displayName} > `
    })

    const rooms = await wrapper.getTopPublicRooms();
    const theRoom = rooms[0];

    console.log(`=> joining room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    await wrapper.joinRoom(theRoom.id);

    rl.prompt();
    rl.on("line", async input => {
      await wrapper.sendRoomChatMsg([{ t: "text", v: input }]);
    })

    connection.addListener("new_chat_msg", async ({ userId, msg }) => {
      const text = msg.tokens.map(it => it.v).reduce((a, b) => a + b);
      if(userId !== connection.user.id) {
        process.stdout.cursorTo(0);
        console.log(`${msg.displayName} > ${text}`);
      }

      rl.prompt();
    });
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
