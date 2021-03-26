const { format, messageToString } = require('doge-utils');
const MessageController = require('../controllers/MessageController');
const { default: Collection } = require('../util/Collection');
const { TIMEOUT: { CHAT_COOLDOWN: defaultChatCooldown }, OP_CODE } = require('../util/constraints');

class Chat {
	
	/**
	 * 
	 * @param {Client} client 
	 * @param {ChatOptions} options
	 */
	constructor(client, options = {}) {
		this._client = client;
		this._cooldown = options.cooldown ?? defaultChatCooldown;
		this._queueRoutine();
	}

	get queue() {}

	/**
	 * Alias of sendMessage
	 * 
	 * @param {*} message The message that is sent
	 * @param {SendMessageOptions} options Options used when sending a message.
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */

	send (message, options = {}) {
		this.sendMessage(message, options);
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
		return new Promise((resolve, reject) => {

			const tokens = format(message);
			const text = messageToString(tokens, { plain: false });

			if (!message) return reject(new Error('Cannot send empty message'));
			if (typeof options !== 'object') return reject(new Error('Options parameter must be an object'));

			const statusManager = {
				resolved: false,
				resolve,
				reject,
			}

			this._client.registerIncommingChatMessageListener(text, (...args) => {
				if (!statusManager.resolved) {
					resolve(...args);
				}
				statusManager.solved = true;
			});

			const priority = options.priority || 0;

			if (!this._queues[priority]) {
				this._queues[priority] = [];
			}

			this._queues[priority].push({
				tokens,
				text,
				options,
				statusManager,
			});

			this._reviveQueue();
		});
	}

	/**
	 * Internal Method
	 * @private
	 */
	async _queueRoutine () {
		while (true) {
			while (this._queues.length) {
				let queue;
				while (!queue && this._queues.length) {
					queue = this._queues.pop();
					const msgReqObj = queue.shift();
					if (queue.length) {
						this._queues.push(queue);
					}
					if (msgReqObj) {
						await this._sendMessageAndWait(msgReqObj)
						.catch((error) => {
							if (!msgReqObj.statusManager.resolved) {
								msgReqObj.statusManager.reject(error);
							}
						});
					}
				}
			}
			await new Promise(resolve => this._queueRoutineRevivePointer = resolve);
		}
	}
	_queueRoutineRevivePointer;
	_reviveQueue () {
		this._queueRoutineRevivePointer?.();
		this._queueRoutineRevivePointer = null;
	}

	_queues = [];

	_sendMessageAndWait(msgReqObj) {
		return new Promise((resolve, reject) => {
			this._sendMessageToServer(msgReqObj)
			.then(() => setTimeout(resolve, this._cooldown))
			.catch(reject)
		});
	}

	/**
	 * Send Message to Server - Internal
	 * 
	 * This function actually sends the message to the server.
	 * You probably shouldn't touch it.
	 * 
	 * @param {MessageToken[]} tokens
	 * @private
	 */

	_sendMessageToServer({ tokens, text, options }) {
		return new Promise((resolve, reject) => {
			const reqOpts = { tokens };
			if (options.whisperedTo) reqOpts.whisperedTo = options.whisperedTo;
			this._client.api.send(
				OP_CODE.SEND_ROOM_CHAT_MSG,
				reqOpts,
				null,
			).then(resolve).catch(reject);
		});
	}

}

module.exports = Chat;

/**
 * @typedef {Object} SendMessageOptions
 * @property {String} [whisperedTo] The user who the message is whispered to (if any).
 * @property {Number} priority Message priority, higher is more important
 */

/**
 * @typedef {Object} MessageToken
 * @property {String} t Type (text, emote, link, block, mention, etc.)
 * @property {String} v Value (the actual string)
 */

/**
 * @typedef {Object} ChatOptions
 * @property {Integer} cooldown Message cooldown in ms
 */
