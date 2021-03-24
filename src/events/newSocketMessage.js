const Client = require("../Client");
const { messageToString } = require('doge-utils')
const MessageController = require("../controllers/MessageController");
const { EVENT, OP_CODE } = require("../util/constraints")

/**
 * @param {Client} app 
 */
module.exports = (app) => {
    app.socket.addEventListener('message', async (e, arrivedId) => {
        const msg = JSON.parse(e.data);

        if (msg.op == OP_CODE.JOIN_ROOM_DONE) app.emit(EVENT.BOT_JOINED_ROOM, msg.d.room);

        if (msg.op == OP_CODE.USER_JOINED_ROOM) app.emit(EVENT.USER_JOINED_ROOM, app.users.setUserData(msg.d.user));
        
        if (msg.op == OP_CODE.USER_LEFT_ROOM) app.emit(EVENT.USER_LEFT_ROOM, app.users.get(msg.d.userId));

        if (msg.op == OP_CODE.MOD_CHANGED) app.emit(EVENT.MOD_CHANGED, msg);

        if (msg.op == OP_CODE.HAND_RAISED) { app.emit(EVENT.HAND_RAISED, app.users.get(msg.d.userId)); }

        if (msg.op == OP_CODE.NEW_CHAT_MESSAGE) {
            const mdm = msg.d.msg;
            const text = messageToString(mdm.tokens, { plain: false });
            const controller = new MessageController(mdm, app);

            app.emit(EVENT.NEW_CHAT_MESSAGE, controller);

            if (app.incommingChatMessageListeners.has(text)) {
                app.incommingChatMessageListeners.get(text).forEach(fn => fn(controller));
                app.incommingChatMessageListeners.delete(text);
            }
        }

    });

	app.setMaxListeners(20);
}