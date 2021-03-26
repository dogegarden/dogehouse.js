const Client = require("../Client")
const { EVENT, OP_CODE } = require("../util/constraints")

/** @param {Client} app */
module.exports = (app) => {
	app.on(EVENT.BOT_JOINED_ROOM, () => {
		app.api.onMessageOnce(OP_CODE.GET_CURRENT_ROOM_USERS_DONE, (msg) => {
			const usrs = msg.d.users;
			usrs.forEach(usr => {
				app.users.setUserData(usr);
			})
		})
		app.api.send(OP_CODE.GET_CURRENT_ROOM_USERS, {}, null);
	});
}
