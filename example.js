require("dotenv").config();

const connect = require("./connect");

const main = async () => {
  try {
    const connection = await connect(process.env.DOGEHOUSE_TOKEN, { logger: console.log });
    console.log(connection.user);
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
