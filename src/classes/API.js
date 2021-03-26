const { default: ReconnectingWebSocket } = require("reconnecting-websocket");
const Client = require("../Client");
const { CONNECTION, EVENT, OP_CODE } = require("../util/constraints");

class API  {

	/**
	 * @param {Client} client 
	 */
	constructor(client) {
		
		/**
		 * Client declaration
		 * @private
		 */
		this._client = client;
		this._registerMessageCallbackHandler();
	}

	_onMessageCallbacks = new Map();
	
	/**
	 * @type {Map<OP_CODE, Function>}
	 * @private
	 */
	_onMessageOnceQueue = new Map();

	/**
	 * @type {Map<string, Function>}
	 * @private
	 */
	_onFetchDoneQueue = new Map();

	/**
	 * Internal Method
	 * @private
	 */
	_registerMessageCallbackHandler () {
		this._client.on(EVENT.SOCKET_MESSAGE, (msg, rid) => {
			const { op } = msg;
			const cbarr = this._onMessageCallbacks.get(op);
			if (cbarr) cbarr.forEach(cb => cb(msg, rid));
			const cbonce = this._onMessageOnceQueue.get(op);
			if (cbonce) {
				cbonce.forEach(cb => cb(msg, rid));
				this._onMessageOnceQueue.set(op, []);
			}
		});
		this.onMessage(OP_CODE.FETCH_DONE, (msg) => {
			const { fetchId } = msg;
			const arr = this._onFetchDoneQueue.get(fetchId);
			if (arr) {
				arr.forEach(cb => cb(msg));
			}
			this._onFetchDoneQueue.delete(fetchId);
		});
	}


	/**
	 * Send an API request
	 *  
	 * This function will send an API request to the socket connection established by the client
	 * connection function.
	 * 
	 * @param {string} opCode Socket OP Code
	 * @param {Object} data Data sent to the socket connection.
	 * @param {string} [fetchId] UUID (if any)
	 * 
	 * @function
	 * @returns {Promise<void>}
	 */
	send (opCode, data, fetchId) {
		return new Promise(async (resolve, reject) => {
			let dat = { op: opCode, d: data }
			if (fetchId) dat.fetchId = fetchId;

			try {
				await this._client.socket.send(JSON.stringify(dat));
				return resolve();
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * Fetch Data from the API
	 * 
	 * This function is used to get data form the API using the OP_CODE and data of your choice. It
	 * will then return the data that it recieved.
	 * 
	 * @param {OP_CODE} opCode Op code to execute
	 * @param {Object} data Data to send with request
	 * 
	 * @returns {ApiDataBack}
	 */
	fetchData(opCode, data) {
		const fetchID = this._client.randStr(128);
		const ret = this.onFetchDoneP(fetchID);
		return this.send(opCode, data, fetchID).then(() => ret);
	}

	/**
	 * API Message Event
	 * 
	 * This function will wait for all API messages.  This will allow you to wait for an API call without
	 * having to hastle with the node.js event handlers.
	 * 
	 * @param {Function} callback 
	 * 
	 * @function
	 * @returns {void}
	 */
	onMessageAny (callback) {
		this._client.on(EVENT.SOCKET_MESSAGE, msg => {
			return callback(msg);
		});
	}

	/**
	 * API Message Event
	 * 
	 * This function will wait for all API messages.  This will allow you to wait for an API call without
	 * having to hastle with the node.js event handlers.
	 * 
	 * @param {OP_CODE} opCode
	 * @param {Function} callback 
	 * 
	 * @function
	 * @returns {void}
	 */
	onMessage (opCode, callback) {
		const arr = this._onMessageOnceQueue.get(opCode);
		if (arr) {
			arr.push(callback);
		} else {
			this._onMessageOnceQueue.set(opCode, [ callback ]);
		}
	}

	/**
	 * API Message Event Once
	 * 
	 * This function will wait for an API message once.  It will call back one time and the time
	 * will be when the OP code is recognized.
	 * 
	 * @param {OP_CODE} opCode The OP Code to callback on.
	 * @param {Function} callback The function that will be called once the event fires.
	 * 
	 * @function
	 * @returns {void}
	 */
	onMessageOnce(opCode, callback) {
		const arr = this._onMessageCallbacks.get(opCode);
		if (arr) {
			arr.push(callback);
		} else {
			this._onMessageCallbacks.set(opCode, [ callback ]);
		}
	}
	
	/**
	 * API Message Event Once Promise
	 * 
	 * This function will wait for an API message once and will return a promise.  The promise will resolve
	 * once the data is recieved, and it will resolve with the data recieved.
	 * 
	 * @param {OP_CODE} opCode The OP code to resolve on.
	 * 
	 * @function
	 * @returns {Promise<ApiDataBack>}
	 */
	onMessageOnceP (opCode) {
		return new Promise(resolve => this.onMessageOnce(opCode, resolve));
	}

	/**
	 * On Fetch Done
	 * 
	 * This function will wait for a fetch_done api message with a specific fetch ID to arrive, once it does it will
	 * callback with the datat that was returned.
	 * 
	 * @param {String} fetchID The fetch ID to listen for.
	 * @param {Function} callback The callback function.
	 * 
	 * @function
	 * @returns {void}
	 */
	onFetchDone(fetchID, callback) {
		const arr = this._onFetchDoneQueue.get(fetchID);
		if (arr) {
			arr.push(callback);
		} else {
			this._onFetchDoneQueue.set(fetchID, [ callback ]);
		}
	}

	/**
	 * On Fetch Done Promise
	 * 
	 * This functino will wait for a fetch_done api message with a specific IP to arrive.  This function returns a promise
	 * that will be resolved once the fetchId returns.
	 * 
	 * @param {String} fetchID The fetch ID to listen for.
	 * 
	 * @function
	 * @returns {void}
	 */
	onFetchDoneP(fetchID) {
		return new Promise(resolve => this.onFetchDone(fetchID, resolve));
	}

	/**
	 * Authenticate Bot
	 * 
	 * This function will authenticate the bot account with the credentials provided in the 
	 * client connection function.
	 * 
	 * @param {string} token Bot Authentication Token
	 * @param {string} refreshToken Bot Refresh Token
	 * 
	 * @function
	 * @returns {Promise<ReconnectingWebSocket>}
	 */
	authenticate(token, refreshToken) {
		return new Promise(async (resolve, reject) => {
			this.send('auth', {
				accessToken: token,
				refreshToken: refreshToken,
				reconnectToVoice: CONNECTION.AUTH.RECONNECT_TO_VOICE,
				currentRoomId: CONNECTION.AUTH.CURRENT_ROOM_ID,
				muted: CONNECTION.AUTH.MUTED,
				platform: CONNECTION.AUTH.PLATFORM
			}).catch(err => {
				console.log(err);
			});
		})
	}
}

module.exports = API;

/**
 * @typedef {Object} ApiDataBack
 * @property {String} op The op_code recieved back.
 * @property {String} [fetchId] The fetch ID recieved back.
 * @property {(Object|String)} d The data recieved back.
 */
