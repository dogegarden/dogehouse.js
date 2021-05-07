import Collection from "@discordjs/collection";
import { Client } from "../Client";
import { RoomController } from "../controllers/RoomController";
import { RoomManager } from "../managers/RoomManager";
import { TIMEOUT } from "../util/constraints";
import { Event } from "../util/types/events";
import { OpCode } from "../util/types/opCodes";
import { GetTopRoomsOptions, JsonRoomData } from "../util/types/rooms";

type TopRoomCollection = Collection<string, RoomManager>;
type CurrentRoomsCollection = Collection<string, RoomController>;
type RoomManagerCacheCollection = Collection<string, RoomManager>;
type RoomControllerCacheCollection = Collection<string, RoomController>;

export class Rooms {

	client: Client;
	
	#_currentRooms: CurrentRoomsCollection = new Collection();
	#_roomManagerCache: RoomManagerCacheCollection = new Collection();

	constructor(client: Client) {
		this.client = client;

		client.on(Event.ROOM.LEFT, room => {
			this.#_currentRooms.delete(room.id);
		})
	}

	/**
	 * A collection of all of the current rooms that the bot is in.
	 */
	get current(): CurrentRoomsCollection { return this.#_currentRooms; }

	/**
	 * Get the top rooms on DogeHouse
	 * 
	 * This method will return a collection of all of the top rooms on DogeHouse.
	 * 
	 * @param options - Options to get top rooms
	 * @returns A collection of all of the top rooms.
	 * 
	 * @async
	 */
	getTop(options?: GetTopRoomsOptions): Promise<TopRoomCollection> {
		return new Promise((resolve, reject) => {
			const cursor: number = (options?.cusrsor ? options.cusrsor : 0);
			const limit: number = (options?.limit ? options.limit : 100);

			const responseCollection: TopRoomCollection = new Collection();

			this.client.api.fetch(OpCode.ROOM.GET_TOP, { cursor, limit }).then(res => {
				const data = res.p;
				data.rooms.forEach(dat => { responseCollection.set(dat.id, new RoomManager(dat, this.client)); });

				return resolve(responseCollection);
			});
		});
	}

	/** @todo */
	create() {}	

	/**
	 * Join a room.
	 * 
	 * @param id - The id of the room you would like to join
	 * @returns The rooms controller
	 */
	join(id: string): Promise<RoomController> {
		return new Promise(async (resolve, reject) => {
			if (!id) return reject("You must specify an ID to join a room.");
			
			const joinRoomTimeout = setTimeout(() => { reject("Timed out whilst attempting to connect to a room...") }, TIMEOUT.JOIN_ROOM);
			this.client.api.fetch(OpCode.ROOM.JOIN_GET_INFO, { roomId: id }, { legacy: true }).then((data) => {
				const users = data?.d?.users;
				const room = data?.d?.room;

				clearTimeout(joinRoomTimeout);				
				if (!room) return reject(`Didn't recieve room data...`); // Check if room data was recieved.

				// Cache room manager
				if (!this.#_roomManagerCache.has(room.id)) this.#_roomManagerCache.set(room.id, new RoomManager(room, this.client));
				else this.#_roomManagerCache.get(room.id)?.update(room);

				const manager = this.#_roomManagerCache.get(room.id);

				if (!manager) return reject('Failed to fetch manager...');
				const controller = new RoomController(manager, this.client);

				this.#_currentRooms.set(room.id, controller);

				this.client.emit(Event.ROOM.JOINED, controller);
				return resolve(controller);
			}).catch((err) => {
				return reject(err);
			});
		});
	}
}