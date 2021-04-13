import Client from "../Client";
import { EVENT, OP_CODE } from "../util/constraints";

/** @param {Client} app */
export default (app: Client) => {
  app.on(EVENT.BOT_JOINED_ROOM, () => {
    app.api.onMessageOnce(OP_CODE.GET_CURRENT_ROOM_USERS_DONE, (msg) => {
      const usrs = msg.d.users;

      usrs.forEach((usr) => {
        app.users.setUserData(usr);
      });
    });
    app.api.send(OP_CODE.GET_CURRENT_ROOM_USERS, {}, null);
  });
};
