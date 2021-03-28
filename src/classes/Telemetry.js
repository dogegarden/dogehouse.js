const { EVENT, TELEMETRY } = require("../util/constraints");
const io = require('socket.io-client');

class Telemetry {

	/**
	 * @param {Client} client
	 */
	constructor(client) {

		/**
		 * @private */
		this._client = client;

		/**
		 * @type {io.Socket}
		 * @private
		 */
		this._socketDoge = io(TELEMETRY.URL, {transports: ['websocket'], path: TELEMETRY.PATH});
	}

	/**
	 * Transmit Telemetry Data
	 *
	 * This function will take the data about the bot and the room that the bot is in
	 * and transmit it to the DogeGarden API so that it can be publicly available and
	 * archived.
	 *
	 * @function
	 * @returns {Promise<any>}
	 */
	transmit() {
		return new Promise((resolve, _reject) => {
			process.nextTick(async () => {
				const currentRoom = this._client.rooms.current;

				this._transmissionData.bot.username = this._client.bot.username;
				this._transmissionData.bot.uuid = this._client.bot.id;
				this._transmissionData.bot.avatarURL = this._client.bot.avatarURL;

				if (currentRoom) {
					const users = await currentRoom.users;

					const constructUsers = (() => {
						return users.reduce(( ret, u ) => {
							if ( u.id !== this._client.bot.id ) {
								ret.push({
									id: u.id,
									bio: u.bio,
									avatarUrl: u.avatarUrl,
									username: u.username,
									displayName: u.displayName,
									numFollowers: u.numFollowers,
									numFollowing: u.numFollowing
								});
							}
							return ret;
						}, []);
					})

					this._transmissionData.room.name = currentRoom.name;
					this._transmissionData.room.uuid = currentRoom.id;
					this._transmissionData.room.listening = users.size-1;
					this._transmissionData.room.users = constructUsers();
				}

				this._socketDoge.emit(TELEMETRY.EMITTER.TRANSMIT, this._transmissionData);
				this._client.emit(EVENT.TELEMETRY_DATA_TRANSMITTED);
				return resolve(this._transmissionData);
			});
		});
	}

	/**
	 * @type {TelemetryData}
	 * @private
	 */
	_transmissionData = {
		bot: {},
		room: {
			users: []
		}
	}
}

module.exports = Telemetry;

/**
 * @typedef {Object} BotTelemetryData
 * @property {String} uuid Bot UUID
 * @property {String} username Bot Username
 * @property {String} avatarURL Bot AvatarURL
 */

/**
 * @typedef {Object} RoomUserTelemetryData
 * @property {String} id User's ID
 * @property {String} bio User's Bio
 * @property {String} avatarUrl User's avatar URL
 * @property {String} username User's username
 * @property {String} displayName User's Displayname
 * @property {Number} numFollowers Number of followers a user has
 * @property {Number} numFollowing Number of people that a user follows
 * @property {Boolean} followsBot Returns weather the user follows the bot
 */

/**
 * @typedef {Object} RoomTelemetryData
 * @property {String} uuid Current Room UUID
 * @property {String} name Current Room name
 * @property {Number} listening Number of people in the room not including the bot
 * @property {RoomUserTelemetryDatap[]} users Data about the users in the current room
 */

/**
 * @typedef {Object} TelemetryData
 * @property {BotTelemetryData} bot Bot telemetry data
 * @property {RoomTelemetryData} room Room Telemerty Data
 */
