const Client = require("../Client")
const { EVENT, OP_CODE } = require("../util/constraints")

/**
 * @param {Client} app 
 */
module.exports = (app) => {
    app.on(EVENT.READY, () => {
        setTimeout(() => {
            app.api.onMessageAny(msg => {
                if (msg.op == OP_CODE.GET_CURRENT_ROOM_USERS_DONE) {
                    const usrs = msg.d.users;
                    usrs.forEach(usr => {
                        app.users.setUserData(usr)
                    })
                }
            });
            
            app.api.send(OP_CODE.GET_CURRENT_ROOM_USERS, [], null)
        },1000)
    });
}
