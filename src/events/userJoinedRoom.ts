import Client from "../Client";
import { OP_CODE } from "../util/constraints";

/** @param {Client} app */
export default (app: Client) => {
  app.api.onMessageAny((msg) => {
    if (msg.op === OP_CODE.USER_JOINED_ROOM) app.users.setUserData(msg.d.user);
  });
};
