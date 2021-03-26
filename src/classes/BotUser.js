const Client = require("../Client");
const RoomController = require("../controllers/RoomController");
const { OP_CODE, EVENT, CONNECTION } = require("../util/constraints");
const { format, messageToString } = require('doge-utils');
const MessageController = require("../controllers/MessageController");

class BotUser {

	/** @param {Client} client */
	constructor(data = null, client) {

		/** @private */
		this._client = client

		/**
		 * @type {Object} Raw Bot User Data
		 * @private
		 */
		this._rawData = data;

		/**
		 * @type {?Boolean} Is the bot muted
		 * @private
		 */
		this._muted = CONNECTION.AUTH.MUTED;
		
		/**
		 * @type {String} Bot Username
		 * @private
		 */
		this._username = data.user.username;

		/**
		 * @type {number} The number of people that the bot follows.
		 * @private
		 */
		this._numFollowing = data.user.numFollowing;
		
		/**
		 * @type {number} The number of people that follow the bot.
		 * @private
		 */
		this._numFollowers = data.user.numFollowers;

		/**
		 * @type {?Date} When was the bot last online?
		 * @private
		 */
		this._lastOnline = Date.parse(data.user.lastOnline);

		/**
		 * @type {String} The bot's user id.
		 * @private
		 */
		this._id = data.user.id;

		/**
		 * @type {String} The bot's display name.
		 * @private
		 */
		this._displayName = data.user.displayName;

		/**
		 * @type {String} The Bot's user bio.
		 * @private
		 */
		this._bio = data.user.bio;

		/**
		 * @type {String} The bot's avatar URl
		 * @private
		 */
		this._avatarURL = data.user.avatarUrl;
	}

	/**
	 * Get the bot's username.
	 * @type {String}
	 * @readonly
	 */
	get username() {
		return this._username;
	}

	/**
	 * The number of people that the bot is following.
	 * @type {Number}
	 * @readonly
	 */
	get numFollowing() {
		return this._numFollowing;
	}

	/**
	 * The number of people that follow the bot.
	 * @type {Number}
	 * @readonly
	 */
	get numFollowers() {
		return this._numFollowers;
	}

	/**
	 * The last time the bot was online
	 * @type {?Date}
	 * @readonly
	 */
	get lastOnline() {
		return this._lastOnline
	}

	/**
	 * The bot's user ID
	 * @type {String}
	 * @readonly
	 */
	get id() {
		return this._id;
	}

	/**
	 * Get the bot's display name
	 * @type {String}
	 * @readonly
	 */

	get displayName() {
		return this._displayName;
	}
	
	/**
	 * Get the bot's bio
	 * @type {String}
	 * @readonly
	 */

	get bio() {
		return this._bio;
	}

	/**
	 * Get the bot's avatar URL
	 * @type {String}
	 * @readonly
	 */
	
	get avatarURL() {
		return this._avatarURL;
	}

	/**
	 * Is the bot muted
	 * @type {?Boolean} muted
	 */
	get muted() {
		return this._muted
	}

	/**
	 * Returns the bot's current room
	 * @type {RoomController}
	 */
	get room() {
		return this._client.rooms.current;
	}

	/**
	 * Ask to speak
	 * 
	 * This function will make the bot request to speak in the voice channel. Once you request
	 * to speak, if it was successful, it will return a resolved promise.
	 * 
	 * @function
	 * @returns {Promise<any>}
	 */
	askToSpeak() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.ASK_TO_SPEAK, {}, null).then(() => {
				const timeout = setTimeout(() => { throw new Error('Request to speak timed out after 60 seconds.'); }, 60000);
				this._client.on(EVENT.SOCKET_MESSAGE, (msg) => {
					clearTimeout(timeout);
					if (msg.op == OP_CODE.HAND_RAISED) return resolve();
				})
			}).catch(err => {return reject(err)});
		});
	}

	/**
	 * Mute the bot
	 * 
	 * @function
	 * @returns {Promise<BotUser>}
	 */
	mute() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.MUTE, {value: true}, null).then(() => {
				this._muted = true;
				return resolve(this);
			})
		})
	}

	/**
	 * Unmute the bot
	 * 
	 * @function
	 * @returns {Promise<BotUser>}
	 */
	unmute() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.MUTE, {value: false}, null).then(() => {
				this._muted = false;
				return resolve();
			})
		})
	}

	/**
	 * Toggle bot muted
	 * 
	 * This function will toggle the bots muted state using the aforementioned
	 * mute and unmute functions.
	 * 
	 * @async
	 * @function
	 * 
	 * @returns {Promise<BotUser>}
	 */
	toggleMute() {
		return new Promise(async (resolve, reject) => {
			if (this._muted) {
				await this.unmute();
				return resolve(this);
			} else {
				await this.mute();
				return resolve(this);
			}
		})
	}

	/**
	 * Send Message
	 * 
	 * This function will send a message to the chatbox of the room that the bot
	 * is currently in. If the message is blank it will throw an error.
	 * 
	 * @param {*} message The message that is sent.
	 * @param {SendMessageOptions} options Options used when sending a message.
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */

	sendMessage(message, options = {}) {
		return this._client.chat.sendMessage(message, options);
	}

	/**
	 * Join a room
	 * 
	 * This function will allow you to join a dogehouse room.  Once you've given it a DogeHouse
	 * room ID, it will connect you to the room.
	 * 
	 * @param {String} id DogeHouse Room ID
	 * 
	 * @deprecated
	 * @function
	 * @returns {Promise<Object>}
	 */
	joinRoom(id) {
		return new Promise(async (resolve, reject) => {
			this._client.on(EVENT.BOT_JOINED_ROOM, (dat) => {
				return resolve(dat);
			})
			await this._client.api.send(OP_CODE.JOIN_ROOM, {roomId: id}, null);
		});
	}
}


module.exports = BotUser;

