const { EVENT, OP_CODE } = require("../util/constraints")

module.exports = (app) => {
    app.onMessage(msg => {
        if (msg.op == OP_CODE.USER_JOINED_ROOM) app.users.setUserData(msg.d.user);
    });
}