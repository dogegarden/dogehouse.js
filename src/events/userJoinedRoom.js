const Client = require("../Client");
const { EVENT, OP_CODE } = require("../util/constraints")

/** @param {Client} app */
module.exports = (app) => {
    app.api.onMessageAny(async msg => {
        if (msg.op == OP_CODE.USER_JOINED_ROOM) app.users.setUserData(msg.d.user);
    });
}
