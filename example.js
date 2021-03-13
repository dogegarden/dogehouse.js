require("dotenv").config();

const connect = require("./connect");

const main = async () => {
  try {
    const connection = await connect(
      process.env.DOGEHOUSE_TOKEN,
      process.env.DOGEHOUSE_REFRESH_TOKEN,
      { logger: console.log }
    );
    console.log(await connection.fetch("get_top_public_rooms", { cursor: 0 }))
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
