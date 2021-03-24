const EventEmitter = require('events');
const isoWS = require('isomorphic-ws');
const ReconnectingWebSocket = require('reconnecting-websocket');
const API = require('./classes/API');
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const { CONNECTION, EVENT, OP_CODE } = require('./util/constraints');
const BotUser = require('./classes/BotUser');
const UserController = require('./controllers/UserController');
const { messageToString } = require('doge-utils/messageToString');
const MessageController = require('./controllers/MessageController');
const Users = require('./classes/Users');
const { resolve } = require('path');
const Rooms = require('./classes/Rooms');
const { default: Collection } = require('./util/Collection');
const Telemetry = require('./classes/Telemetry');

/**
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {

	/**
	 * @param {ClientOptions} options Client Options
	 */
	constructor(options = {}) {
		super(); // Call the Event Emitter

		/**
		 * @type {Date} When did the bot start
		 * @private
		 */
		this._startTime = null;

		/**
		 * @type {Telemetry}
		 * @private
		 */
		this._telemetry = null;

		/**
		 * @type {Boolean} Send Telemetry Data?
		 * @private
		 */
		this._sendTelemetry = ((options.sendTelemetry !== undefined) ? options.sendTelemetry : true);

		/**
		 * @type {?Date} Date the bot the connected
	 	 * @private
		 */
		this._connectionDate = null;

		/**
		 * @type {Object} Bot User Data;
		 * @private
		 */
		this._botUser = null;

		/**
		 * @type {ReconnectingWebSocket.default} Websocket
		 */
		this.socket = null;

		/**
         * @type {API}
         */
		this.api = null;

		/**
		 * Allows you to manage and get users.
		 * @type {Users}
		 */
		this.users = new Users(this);

		/**
		 * Allows you to manage and get rooms
		 * @type {Rooms}
		 */
		this.rooms = new Rooms(this);

		/**
		 * @type {Collection<String, Function>}
		 * @private
		 */
		this._eventCache = new Collection();

		/**
		 * Listener Cache
		 * @type {Map<String, Function[]}
		 */
		this.incommingChatMessageListeners = new Map();

		this.registerIncommingChatMessageListener = (text, fn) => {
			if (this.incommingChatMessageListeners.has(text)) {
				this.incommingChatMessageListeners.get(text).push(fn);
			} else {
				this.incommingChatMessageListeners.set(text, [ fn ]);
			}
		}

		this.onMessage((msg, rid) => {
			const { op } = msg;
			if (this._onMessageOnceQueue.has(op)) {
				const queue = this._onMessageOnceQueue.get(op);
				while (queue.length) {
					const callback = queue.shift();
					callback(msg, rid);
				}
			}
		});
	}

	/**
	 * @type {?number} How long has it been since the bot connected?
	 * @readonly
	 */
	get uptime() {
		return this._startTime ? ((Date.now() - this._startTime)) : null;
	}

	/**
	 * Get the bot
	 * 
	 * This will return the BotUser which has everything you need to work with the 
	 * bot it will allow you to get all of the data about the bot.
	 * 
	 * @type {BotUser}
	 */
	get bot() {
		return this._botUser;
	}

	/**
	 * On Message
	 * 
	 * When called, this function will callback to the callback function every
	 * single time the api recieves a message from the DogeHouse Bakend API.
	 * 
	 * @param {Function} callback Callback function
	 * 
	 * @function
	 */
	onMessage(callback) {
		this.on(EVENT.SOCKET_MESSAGE, (msg, rid) => {
			callback(msg, rid);
		});
	}

	/**
	 * 
	 * When called, this function will run the callback
	 * if the opcode matches
	 * 
	 * @param {OP_CODE} opcode The opcode
	 * @param {Function} callback Callback function
	 * 
	 */
	onMessageOnce(opcode, callback) {
		if (this._onMessageOnceQueue.has(opcode)) {
			this._onMessageOnceQueue.get(opcode).push(callback);
		} else {
			this._onMessageOnceQueue.set(opcode, [callback]);
		}
	}

	onMessageOncePromise(opcode) {
		return new Promise((resolve, _reject) => {
			this.onMessageOnce(opcode, resolve);
		});
	}

	/**
	 * Internal onMessageOne queue Map
	 * 
	 * @type {Map<OP_CODE, Function[]>}
	 * @private
	 */
	_onMessageOnceQueue = new Map();


	

	/**
	 * Register Events
	 * 
	 * @param {String} dir Events Directory
	 * 
	 * @private
	 * @function
	 * @returns {Promise<any>}
	 */
	registerEvents(dir) {
		return new Promise(async (resolve, reject) => {
			fs.readdir(dir, async (err, files) => {
				for (const f of files) {
					const fn = require(path.resolve(dir, f));
					this._eventCache.set(f.split('.')[0], fn);
				}
				return resolve();
			});
		});
	}

	/**
	 * Connect the bot.
	 * 
	 * This function will take the token and the refresh token and use them
	 * to connect to the DogeHouse API
	 * 
	 * @param {String} token User token
	 * @param {String} refreshToken User refresh token
	 * 
	 * @function
	 * @returns {Promise<Client>} Connected Client
	 */
	async connect(token, refreshToken) {
		return new Promise(async (resolve, reject) => {
			const options = { connectionTimeout: CONNECTION.CONNECTION_TIMEOUT, WebSocket: isoWS }
			const socket = new ReconnectingWebSocket(CONNECTION.API_URL, [], options);
			
			this._telemetry = new Telemetry(this);
			this.api = new API(this);
			this.socket = socket;
			
			socket.addEventListener('open', () => {
                setTimeout(() => {
                    if (this._sendTelemetry) {
                        this._telemetry.init();
                    }
				}, 500)

                    const hb = (() => {
                        socket.send("ping"); 
                        if (this._sendTelemetry) this._telemetry.transmit()
                    });
                    const heartbeat = setInterval(hb, CONNECTION.HEARTBEAT_INTERVAL);

				socket.addEventListener('close', (err) => {
					clearInterval(heartbeat);
					if (err.code == 4003) return this.emit(EVENT.CONNECTION_TAKEN);
					return reject(err)
				});

				this.api.authenticate(token, refreshToken).then(socketAuthenticated => {
					this.socket = socketAuthenticated;
				}).catch(err => {throw err;});
			});
			socket.addEventListener("message", (e, arrivedId) => {
				const msg = JSON.parse(e.data);

				if (msg === "pong") this.emit(EVENT.SOCKET_MESSAGE_PONG, msg);
				else this.emit(EVENT.SOCKET_MESSAGE, msg, arrivedId);

				if (msg.op == OP_CODE.AUTH_GOOD) {
					this._botUser = new BotUser(msg.d, this);
					this._startTime = new Date();

					this.emit(EVENT.READY);
					return resolve(this);
				}
			});


			await this.registerEvents(path.resolve(__dirname, 'events')).then(() => {
				this._eventCache.forEach(fn => {if (fn instanceof Function) fn(this)});
			});
		})
	}
}

module.exports = Client;

/**
 * @typedef {Object} ClientOptions
 * @property {Boolean} [sendTelemetry] Would you like to send Telemetry data back to the DogeGarden team?
 */