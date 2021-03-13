require("dotenv").config();

const connect = require("./connect");

const main = async () => {
  try {
    console.log(connection.user);
    const connection = await connect(
      process.env.DOGEHOUSE_TOKEN,
      process.env.DOGEHOUSE_REFRESH_TOKEN,
      { logger: console.log }
    );
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
