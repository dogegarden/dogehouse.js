import ReconnectingWebSocket from "reconnecting-websocket";
import isoWS from 'isomorphic-ws';
import { Client } from "../Client";
import { API_INFO, CONNECTION, TIMEOUT } from "../util/constraints";
import { Event } from "../util/types/events";
import axios from "axios";
import { LegacySocketMessage, OpCode, OpCodeEvents, OpCodePayload, OpCodeResponse, SendApiPayloadOptions, SocketMessage } from "../util/types/opCodes";
import { BaseUserInfo } from "../util/types/user";
import { ApiFetchOptions } from "../util/types/api";

export class API {

	private _socket: ReconnectingWebSocket | null = null;

	#_onFetchDoneQueue: Map<string, (msg: SocketMessage<any>) => void> = new Map();
	#_onLegacyFetchDoneQueue: Map<string, (msg: LegacySocketMessage<any>) => void> = new Map();
	#_onEventCallbackQueue: Map<keyof OpCodeEvents, (msg: SocketMessage<any>) => void> = new Map();
	#_onceEventCallbackQueue: Map<keyof OpCodeEvents, (msg: SocketMessage<any>) => void> = new Map();

	public client: Client;

	constructor(client: Client) {
		this.client = client;

		this._handleQueueRoutine();
	}

	/**
	 * The raw socket connection to the DogeHouse API
	 */
	get socket(): ReconnectingWebSocket | null {
		return this._socket;
	}

	/** @private */
	private _handleQueueRoutine() {
		this.client.on(Event.SOCKET.NEW_MESSAGE, (msg) => {
			this.#_onFetchDoneQueue.forEach((value, key, map) => {
				if (key == msg.ref) {
					value(msg);
					return this.#_onFetchDoneQueue.delete(key);
				}
			});
			this.#_onLegacyFetchDoneQueue.forEach((value, key, map) => {
				// @ts-ignore
				if (key == msg.fetchId) {
					value(msg);
					return this.#_onFetchDoneQueue.delete(key);
				}
			});
			this.#_onEventCallbackQueue.forEach((value, key) => {
				if (key == msg.op) return value(msg);
			});

			this.#_onceEventCallbackQueue.forEach((value, key) => {
				if (key == msg.op) {
					value(msg);
					return this.#_onFetchDoneQueue.delete(key);
				}
			});
		});
	}

	/**
	 * This will initialize the socket connection to the DogeHouse API.
	 * @returns Raw Websocket Connection
	 */
	connect(): Promise<ReconnectingWebSocket> {
		return new Promise((resolve, reject) => {
			const options = { connectionTimeout: CONNECTION.TIMEOUT, WebSocket: isoWS };
			const socket = new ReconnectingWebSocket(CONNECTION.API_URL, [], options);

			const hb = (() => { socket.send("ping"); });
			let heartbeat: any;
			
			socket.addEventListener("open", (ev) => {
				this._socket = socket;
				this.client.emit(Event.SOCKET.CONNECTION_OPENED);
				heartbeat = setInterval(hb, CONNECTION.HEARTBEAT_INTERVAL);
			});

			socket.addEventListener("message", (dat) => {
				const msg = (dat.data == "pong" ? "pong" : JSON.parse(dat.data));
				this.client.emit(Event.SOCKET.NEW_MESSAGE, msg);
			})
			socket.addEventListener('close', (e) => {
				clearInterval(heartbeat);
				this.client.emit(Event.SOCKET.CONNECTION_CLOSED, e)
			});

			resolve(socket);
		})
	}

	/**
	 * Test to see if a socket message has errored out.
	 * 
	 * @param msg - The raw data returned by a socket request.
	 * @returns An error message or false
	 */
	private testError(msg: SocketMessage<any>): string | null | false {
		const keys = Object.keys(msg);

		if (keys.includes('e')) {
			const errKeys = Object.keys(msg.e);
			if (errKeys.includes('message')) return msg.e.message;
			else return null;
		}

		return false;
	}

	/**
	 * Legacy API Fetch
	 * 
	 * This is a legacy fetch method to call the older version of the DogeHouse API.
	 * 
	 * @param op - The OpCode sent to the socket.
	 * @param payload - The Payload send to the socket.
	 * @param options - The options used when sending a payload to the socket.
	 * @returns Raw Socket Data
	 */
	private legacyFecth<OP extends keyof OpCodePayload>(op: OP, payload?:OpCodePayload[OP], options?: ApiFetchOptions): Promise<OpCodeResponse[OP]> {
		return new Promise((resolve, reject) => {
			let uuid = this.client.randStr(256);
			let obj = { op, d: payload, fetchId: uuid };

			this.#_onLegacyFetchDoneQueue.set(uuid, (msg: any) => {
				return resolve(msg);
			});

			this._socket?.send(JSON.stringify(obj));
		});
	}

	/**
	 * API Fetch
	 * 
	 * This will fetch data from the DogeHouse API using a reference id which when returned, can be listened
	 * for to return data.
	 * 
	 * @param op - The OpCode sent to the socket.
	 * @param payload - The Payload send to the socket.
	 * @param options - The options used when sending a payload to the socket.
	 * @returns Raw Socket Data
	 */
	fetch<OP extends keyof OpCodePayload>(op: OP, payload?:OpCodePayload[OP], options?: ApiFetchOptions): Promise<OpCodeResponse[OP]> {
		return new Promise(async (resolve, reject) => {
			const requestTimeout = setTimeout(() => reject('Timed out whilst attempting a socket api request...'), TIMEOUT.FETCH_REQUEST);
			if (options?.legacy) {
				const requestedData = await this.legacyFecth(op, payload, options);
				clearTimeout(requestTimeout);
				return resolve(requestedData);
			}

			let uuid = this.client.randStr(256);
			let obj = { op, p: payload, ref: uuid, v: API_INFO.version };

			this.#_onFetchDoneQueue.set(uuid, (msg) => {
				const testErr = this.testError(msg);
				clearTimeout(requestTimeout)

				if (testErr == null || typeof testErr == 'string') return reject(testErr);
				if (msg.ref == uuid) return resolve(msg);
			});
			this._socket?.send(JSON.stringify(obj));
		});
	}

	/**
	 * On Socket Message
	 * 
	 * This will listen for new socket messages matching a certain OpCode and will callback every time.
	 * 
	 * @param op - OpCode to listen for.
	 * @param cb - The data that was called back with.
	 * 
	 * @eventPropertys
	 */
	on<OP extends keyof OpCodeEvents>(op: OP, cb: OpCodeEvents[OP]): void {
		this.#_onEventCallbackQueue.set(op, (msg) => { cb(msg); })
	}

	/**
	 * Once Socket Message
	 * 
	 * This will listen for new socket messages matching a certain OpCode and will callback once.
	 * 
	 * @param op - OpCode to listen for.
	 * @param cb - The data that was called back with.
	 * 
	 * @eventProperty
	 */
	once<OP extends keyof OpCodeEvents>(op: OP, cb: OpCodeEvents[OP]): void {
		this.#_onceEventCallbackQueue.set(op, (msg) => { cb(msg); })
	}

	/**
	 * Authenticate
	 * 
	 * This will authenticate you with the DogeHouse API which will allow you to begin sending
	 * and reciving data from the API seamlessly.
	 * 
	 * @param key - Bot API Key
	 * @returns The Bot's User information
	 */
	authenticate(key: string): Promise<BaseUserInfo> {
		return new Promise((resolve, reject) => {
			axios.post(`${API_INFO.url}/bot/auth`, { apiKey: key })
			.then(async dat => {
				const data = dat.data;

				const authData = await this.fetch(OpCode.AUTH.REQUEST, {
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					currentRoomId: CONNECTION.AUTH.CURRENT_ROOM_ID,
					muted: CONNECTION.AUTH.MUTED,
					platform: CONNECTION.AUTH.PLATFORM,
					reconnectToVoice: CONNECTION.AUTH.RECONNECT_TO_VOICE
				});

				resolve(authData.p);

			}).catch((dat) => {
				throw new Error("Invalid bot key!");
			})
		});
	}
}