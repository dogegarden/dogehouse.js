require("dotenv").config();

const connect = require("./connect");

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
      { logger }
    );
    console.log(await connection.fetch("get_top_public_rooms", { cursor: 0 }))
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
