require("dotenv").config();

const connect = require("./connect");

const logger = (direction, opcode, data, fetchId) => {
  console.info(
    `${direction.toUpperCase().padEnd(3, " ")} "${opcode}" ${fetchId ? `(fetch id ${fetchId})` : ""}\n${data ? JSON.stringify(data, null, 2) : ""}\n`
  );
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
