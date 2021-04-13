import Client from "../Client";

import { EVENT, OP_CODE } from "../util/constraints";

/**
 * @param {Client} app
 */
export default (app: Client) => {
  app.on(EVENT.READY, () => {
    setTimeout(() => {
      app.api.onMessageAny((msg) => {
        if (msg.op === OP_CODE.GET_CURRENT_ROOM_USERS_DONE) {
          const usrs = msg.d.users;

          usrs.forEach((usr) => {
            app.users.setUserData(usr);
          });
        }
      });

      app.api.send(OP_CODE.GET_CURRENT_ROOM_USERS, [], null);
    }, 1000);
  });
};
