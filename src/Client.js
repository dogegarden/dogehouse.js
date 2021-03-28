const path = require('path');
const API = require('./classes/API');
const isoWS = require('isomorphic-ws');
const Chat = require('./classes/Chat');
const Rooms = require('./classes/Rooms');
const Users = require('./classes/Users');
const BaseClient = require('./BaseClient');
const BotUser = require('./classes/BotUser');
const Telemetry = require('./classes/Telemetry');
const { default: Collection } = require('./util/Collection');
const ReconnectingWebSocket = require('reconnecting-websocket');
const { CONNECTION, EVENT, OP_CODE, TELEMETRY } = require('./util/constraints');

/**
 * @extends {BaseClient}
 */
class Client extends BaseClient {

	/**
	 * @param {ClientOptions} options Client Options
	 */
	constructor(options = {}) {
		super(); // Call the Event Emitter

		/** @private */
		this._startTime = null;

		/** @private */
		this._telemetry = null;

		/** @private */
		this._sendTelemetry = ((options.sendTelemetry !== undefined) ? options.sendTelemetry : true);

		/** @private */
		this._blockAngular = ((options.blockAngular !== undefined) ? options.sendTelemetry : false);

		/** @private */
		this._connectionDate = null;

		/** @private */
		this._botUser = null;

		/** @type {ReconnectingWebSocket.default} */
		this.socket = null;

		/** @type {API} */
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
		 * Provides access to all the juicy chat functionality
		 * @type {Chat}
		 */
		this.chat = new Chat(this);

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

		/**
		 * @type {Collection<String, any>}
		 * @private
		 */
		this._hooks = new Collection();

		/**
		 * @type {Collection<String, Function>}
		 * @private
		 */
		this._eventCache = new Collection();
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
	connect(token, refreshToken) {
		return new Promise(async (resolve, reject) => {
			const options = { connectionTimeout: CONNECTION.CONNECTION_TIMEOUT, WebSocket: isoWS }
			const socket = new ReconnectingWebSocket(CONNECTION.API_URL, [], options);

			if (!token) throw new Error('Token must be defined to connect to Dogehouse.');
			if (!refreshToken) throw new Error('Refresh token must be defined to connect to Dogehouse');

			this._telemetry = new Telemetry(this);
			this.api = new API(this);
			this.socket = socket;

			const hb = (() => { socket.send("ping"); });
			const startTelemetry = () => {
				if (!this._sendTelemetry) return;

				const startClock = () => {
					setInterval(() => {
						this._telemetry.transmit();
					}, TELEMETRY.INTERVAL);
				}

				this.emit(EVENT.TELEMETRY_INITIALIZED);
				return this._telemetry.transmit().then(startClock);
			};

			socket.addEventListener('open', () => {
				const heartbeat = setInterval(hb, CONNECTION.HEARTBEAT_INTERVAL);

				socket.addEventListener('close', (err) => {

					// 4003 - Connection Taken
					// 4001 - Invalid Authentication
					// 1011 - Invalid or missing authentication/refresh token

					if (err.code == 4003) return reject(new Error('Unable to authenticate connection.'));
					if (err.code == 4001) return reject(new Error('Socket connection taken.'));
					if (err.code == 1011) return reject(new Error('Invalid or missing tokens'));

					clearInterval(heartbeat);

					return reject(new Error('Unknown Error'));
				});

				this.api.authenticate(token, refreshToken)
					.then(socketAuthenticated => {
						this.socket = socketAuthenticated;
					})
					.catch(err => {throw err;});
			});
			socket.addEventListener("message", (e, arrivedId) => {
				const msg = JSON.parse(e.data);

				if (msg === "pong") this.emit(EVENT.SOCKET_MESSAGE_PONG, msg);
				else this.emit(EVENT.SOCKET_MESSAGE, msg, arrivedId);

				if (msg.op == OP_CODE.AUTH_GOOD) {
					this._botUser = new BotUser(msg.d, this);
					this._startTime = new Date();

					startTelemetry();

					this.emit(EVENT.READY);
					return resolve(this);
				}
			});


			await this.registerEvents(path.resolve(__dirname, 'events'));
			this._eventCache.forEach(fn => {if (fn instanceof Function) fn(this)});
			await this.registerHooks(path.resolve(__dirname, 'hooks'));
		});
	}
}

module.exports = Client;

/**
 * @typedef {Object} ClientOptions
 * @property {Boolean} [sendTelemetry] Would you like to send Telemetry data back to the DogeGarden team?
 */
