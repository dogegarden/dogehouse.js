const Client = require("../Client");
const RoomController = require("../controllers/RoomController");
const { EVENT, OP_CODE, TIMEOUT, ERROR } = require("../util/constraints");

class Rooms {
	/**
	 * @param {Client} client 
	 */
	constructor(client) {
        /** @private */
		this._client = client;
	}

	/**
	 * RoomController Cache
	 * @type {Map<String, RoomController>}
	 * @private
	 */
	_roomControllerCache = new Map();

	/**
	 * Set Room data
	 * 
	 * This will set the room data in the room controller cache, and if it is already in the controller
	 * it will simply update the data.
	 * 
	 * @param {Object} data Update Data
	 * 
	 * @private
	 * @function
	 */
	setRoomData (data) {
		if (!data?.id) return;
		let controller = this._roomControllerCache.get(data.id);
		if (controller) controller.update(data);
		else this._roomControllerCache.set(data.id, new RoomController(data, this._client));
	}

	/**
	 * Retrieve the Room Cache
	 * 
	 * This will return the Room Controller Cache which will have a list of all of the cached 
	 * Rooms.
	 * 
	 * @type {Map<String, RoomController>}
	 */
	get cache() {
		return this._client._RoomControllerCache;
	}

	/**
	 * Get the top public Rooms
	 * 
	 * This is an async getter which will get all of the top rooms from DogeHouse, once it gets the top rooms,
	 * it will return a new Promise with all of the top rooms.
	 * 
	 * @async
	 * @type {Promise<Object>}
	 */
	get top() {
		return new Promise((resolve, _reject) => {
			this._client.api.onMessageOnce(OP_CODE.GET_TOP_PUBLIC_ROOMS_DONE, msg => {
				resolve(msg.d.rooms);
			});
			this._client.api.send(OP_CODE.GET_TOP_PUBLIC_ROOMS, {}, null);
		})
	}

    /**
     * Get the current room
	 * 
	 * This property will simply get the current room and return the room controller for it
	 * 
     * @type {RoomController}
     */
    get current() {
        return this._current;
    }

	/** @private */
	set current(roomUnresolved) {
		this._current = (typeof roomUnresolved === 'string') ? this.get(roomUnresolved) : roomUnresolved;
	}

	/**
	 * Join a room
     * 
     * This function will allow you to join a room. Once you've joined the room you will be returned
     * a Room Controller object, but if it times out, it will be rejected.
     * 
	 * @param {*} roomUnresolved
	 * 
	 * @function
	 * @returns {Promise<RoomController>}
	 */
	join(roomUnresolved) {
		return new Promise(async (resolve, reject) => {
			while (roomUnresolved instanceof Promise) {
				await roomUnresolved.then(_ => roomUnresolved = _);
			}

			let resolvedFlag = false;

			const roomId = (
				(typeof roomUnresolved === 'string')
				? roomUnresolved
				: (
					('id' in roomUnresolved)
					? roomUnresolved.id
					: (
						(('room' in roomUnresolved) && ('id' in roomUnresolved.room))
						? (roomUnresolved.room.id)
						: (
							(('d' in roomUnresolved) && ('user' in roomUnresolved.d) && ('id' in roomUnresolved.d.user))
							? roomUnresolved.d.user.id
							: 'REJECT_INVALID'
						)
					)
				)
			);

			if (roomId === 'REJECT_INVALID') {
				return reject(new Error(ERROR.ROOMS.UNRESOLVABLE_ROOM));
			}

            const timeoutObj = setTimeout(() => {
				if (!resolvedFlag) {
					resolvedFlag = true;
					return reject(new Error(ERROR.ROOMS.ROOM_CONNECTION_TIMEOUT));
				}
            }, TIMEOUT.JOIN_ROOM);

            this._client.on(EVENT.BOT_JOINED_ROOM, ({ room: newRoom }) => {
				if (!resolvedFlag) {
					resolvedFlag = false; // This line is completely redundant.
					clearTimeout(timeoutObj);
					this.setRoomData(newRoom); // Caches the data.
					this.current = newRoom.id;
					return resolve(newRoom);
				}
            });

			await this._client.api.send(OP_CODE.JOIN_ROOM, {roomId: roomId}, null);
		});
	}

	/**
	 * Get Room
	 * 
	 * This function will get a Room by their Room id. If they are in the Room cache, it will
	 * pull that, otherwise it will add them to the cache.
	 * 
	 * @param {String} id Room ID
	 * 
	 * @function
	 * @returns {RoomController}
	 */
	get (id) {
		if (this._roomControllerCache.has(id)) {
			return this._roomControllerCache.get(id);
		} else {
            return null;
		}
	}
}

module.exports = Rooms;