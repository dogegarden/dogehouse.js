const Client = require("../Client");
const UserController = require("./UserController");
const { messageToString } = require('doge-utils');
const { OP_CODE } = require("../util/constraints");
const BotUser = require("../classes/BotUser");
const { default: Collection } = require("../util/Collection");

class MessageController {

    /**
     * @param {Object} data Message Controller Data
     * @param {Client} client ApplicationClient
     */
    constructor(data = {}, client) {

        /** @private */
        this._client = client;

        /**
         * @type {MessageData} The raw message data;
         * @private
         */
        this._rawData = data;

		/**
		 * @type {String} Message ID
		 * @private
		 */
		this._id = this._rawData.id;

		/**
		 * @type {UserController}
		 * @private
		 */
		this._author = client.users.get(this._rawData.userId);

		/**
		 * @type {Date} The date the message was set at.
		 * @private
		 */
		this._date = Date.parse(this._rawData.sentAt);

		/**
		 * @type {MessageToken[]} Message Tokens
		 * @private
		 */
		this._msgTokens = this._rawData.tokens;
    }


	/**
	 * Get the Message ID
	 * 
	 * @type {String}
	 * @private
	 */
	get id() {
		return this._id;
	}
	/**
	 * Get the author of the message
	 * 
	 * @type {UserController}
	 */
    get author() {
		return this._author;
	}

	/**
	 * The date the message was sent at.
	 * 
	 * @type {Date}
	 * @readonly
	 */
	get date() {
		return this._date;
	}

	/**
	 * Get the raw contents of the message
	 * 
	 * @type {MessageToken[]}
	 * @readonly
	 */
	get tokens() {
		return this._msgTokens;
	}

	/**
	 * Get the formatted contents of the message
	 *
	 * @type {String}
	 * @readonly
	 */
	get content() {
		return messageToString(this.tokens, {
			plain: false,
		});
	}

	/**
	 * Get an array of all the mentions in the message
	 * 
	 * @type {Array}
	 * @readonly
	 */
	get mentions() {
		const mentions = [];
		
		this.tokens.forEach(tk => {
			if (tk.t == 'mention') mentions.push({user: this._client.users.cache.filter(u => u.username == tk.v).array()[0], token: tk}); 
		});
		return mentions;
	}

	/**
	 * Get an array of all the links in the message
	 * 
	 * @type {Array}
	 * @readonly
	 */
	get links() {
		const links = [];
		
		this.tokens.forEach(tk => {
			if (tk.t == 'link') links.push({link: tk.v, token: tk});
		});
		return links;
	}

	/**
	 * Reply to a message
	 * 
	 * This function can be used to reply to a users message by tagging them.  This uses the
	 * MessageController object to get it's data.
	 * 
	 * @param {*} msg Message to reply with
	 * @param {MessageReplyOptions} options Message Options
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */
	reply(msg, options = {}) {
		return new Promise(async (resolve, reject) => {
			const constructMessage = (() => {
				let m = [];

				if (options.mentionUser || options.mentionUser == undefined) m.push({mention: this._author.username});
				m.push(msg);

				return m;
			});

			if (!options.whispered) await this._client.bot.sendMessage(constructMessage()).then(resolve);
			else this._client.bot.sendMessage(constructMessage(), {whisperedTo: [this.author.id]});
		});
	}

	/**
	 * Delete a message
	 * 
	 * This function will allow you to delete this message.  If you are the author of the message,
	 * then it will delete 100% of the time, if you are not the author, you have to be a moderator 
	 * to delete messages.  And you can never delete the room owner's messages.
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */
	delete() {
		return new Promise(async (resolve, reject) => {
			await this._client.api.send(OP_CODE.DELETE_ROOM_CHAT_MESSAGE, {messageId: this.id, userId: this.author.id}, null).then(() => {
				return resolve(this);
			});
		});
	}

	toString() {
		return this.content;
	}
}

module.exports = MessageController;

/**
 * @typedef {Object} MessageReplyOptions
 * @property {Boolean} [whispered] Would you like the message to be whispered to the author?.
 * @property {Boolean} [mentionUser] Do you want to mention the user in the reply 
 */

/**
 * @typedef {Object} MessageToken
 * @property {String} t Type (text, emote, link, block, mention, etc.)
 * @property {String} v Value (the actual string)
 */

/**
 * @typedef {Object} MessageData
 * @property {String} id Message unique identifier
 * @property {String} username The author's username
 * @property {String} userId The Authors User ID
 * @property {MessageToken[]} tokens Message tokens
 * @property {String} sentAt When was message sent
 * @property {Boolean} isWhisper
 * @property {String} displayName Author's display name
 * @property {String} avatarUrl URL of Author's avatar
 */