const Client = require("../Client");
const { OP_CODE } = require("../util/constraints");
const MessageController = require("./MessageController");

class UserController {

    /**
     * @param {Object} data User data
     * @param {Client} client Client Class
     */
	constructor(data = {}, client) {

        /** @private */
		this._client = client;

        /**
         * @type {String} User ID
         * @private
         */
		this._id = data.id;

        /**
         * @type {String} User Bio
         * @private
         */
		this._bio = data.bio;

        /**
         * @type {String} User's username
         * @private
         */
		this._username = data.username;

        /**
         * @type {Number} Number of people who the bot follows
         * @private
         */
		this._numFollowing = data.numFollowers;

        /**
         * @type {Number} Number of followers that the bot has.
         * @private
         */
		this._numFollowers = data.numFollowers;

        /**
         * @type {?Date} When was the last time this user was online.
         * @private
         */
		this._lastOnline = Date.parse(data.lastOnline);

        /**
         * @type {Boolean} Does this user follow the bot?
         * @private
         */
		this._followsBot = data.followsYou;
		
		/**
		 * @type {String} User Display Name
		 * @private
		 */
		this._displayName = data.displayName

		/**
		 * @type {String} The user's avatar url
		 * @private
		 */
		this._avatarURL = data.avatarUrl;

	}

	/**
	 * Get the User's id
	 * @type {String}
	 */
	get id() {
	    return this._id;
	}

	/**
	 * Get the user's bio
	 * @type {String}
	 */
	get bio() {
    	return this._bio;
	}

	/**
	 * Get the users avatar URL
	 * @type {String}
	 */
    get avatarUrl() {
        return this._avatarURL;
    }

	/**
	 * Get the user's username
	 * @type {String}
	 */
	get username() {
		return this._username;
	}

	/**
	 * Get the user's display name
	 * @type {String}
	 */
	get displayName() {
		return this._displayName;
	}

	/**
	 * Get the number of followers that this user has
	 * @type {Number}
	 */
	get numFollowers() {
        return this._numFollowers;
    }

	/**
	 * Get the number of people that this user follows
	 * @type {Number}
	 */
	get numFollowing() {
        return this._numFollowing;
    }

	/**
	 * Does this user follow the bot?
	 * @type {Boolean}
	 */
	get followsBot() {
        return this._followsBot;
    }

	/**
	 * Follow the user
	 * 
	 * This function will follow a user as the bot account. Once following, you will be able to unfollow 
	 * using the unfollow method. 
	 * 
	 * @returns {Promise<UserController>}
	 */
	follow() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.FOLLOW, {userId: this.id, value: true}, null).then(() => {
				resolve(this);
			}).catch(reject);
		});
	}
    
	/**
	 * Unfollow the user.
	 * 
	 * This function will unfollow a user that the bot has followed previously.  If you choose to follow
	 * this user back, simply use the follow method.
	 * 
	 * @returns {Promise<UserController>}
	 */
	unfollow() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.FOLLOW, {userId: this.id, value: false}, null).then(() => {
				resolve(this);
			}).catch(reject);
		});
	}
    
	/**
	 * Whisper to a user
	 * 
	 * This function will whisper a userwith the provided message. Once the message has been
	 * sent, this will resolve with the message object.
	 * 
	 * @param {String} msg The message string / object that will be sent
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */
	whisper(msg) {
		return new Promise((resolve, reject) => {
			this._client.bot.sendMessage(msg, {whisperedTo: [this.id]}).then((msg) => {
				resolve(msg);
			}).catch(reject);
		});
	}

	/**
	 * Mention a user.
	 * 
	 * This function will mention a user in the chat with the provided message.  If you want to
	 * whisper them, simply use the whisper method
	 * 
	 * @param {String} msg The message you want to mention a user with. 
	 * 
	 * @function
	 * @returns {Promise<MessageController>}
	 */
	mention(msg) {
		return new Promise((resolve, reject) => {
			this._client.bot.sendMessage([{mention: this.username}, msg]).then((msg) => {
				resolve(msg);
			}).catch(reject);
		});
	}
    
	/** @todo */
    blockFromChat() {}
    
	/** @todo */
    blockFromRoom() {}
    
	/**
	 * Set Listener
	 * 
	 * This function will set the user to a listener, and the user can be set to speaker
	 * with the setSpeaker method.
	 * 
	 * @function
	 * @returns {Promise<UserController>}
	 */
	setListener() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.SET_LISTENER, {userId: this.id}, null).then(() => {
				resolve(this);
			}).catch(reject);
		})
	}

	/**
	 * Set Speaker
	 * 
	 * This function will set the user as a speaker.  Once they're a speaker you can
	 * set them back to a listener with the setListener method.
	 * 
	 * @function
	 * @returns {Promise<UserController>} 
	 */
    setSpearker() {
		return new Promise((resolve, reject) => {
			this._client.api.send(OP_CODE.ADD_SPEAKER, {userId: this.id}, null).then(() => {
				resolve(this);
			}).catch(reject);
		})
	}

	/**
	 * Update user data
	 * 
	 * This functino will simply take all of the new user data 
	 * and update the controlelr with the data.
	 * 
	 * @param {Object} data User data
	 * 
	 * @private
	 * @function
	 */
	update(data) {
		for (const n in data) {
			this[`_${n}`] = data[n];
		}
	}
}

module.exports = UserController;