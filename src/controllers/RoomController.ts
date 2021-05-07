import { Client } from "../Client";
import { RoomManager } from "../managers/RoomManager";
import { TIMEOUT } from "../util/constraints";
import { Event } from "../util/types/events";
import { OpCode } from "../util/types/opCodes";
import { GetBannedUsersOptions } from "../util/types/rooms";
import { RoomUserController } from "./RoomUserController";

export class RoomController {

	public client: Client;
	public manager: RoomManager;

	constructor(manager: RoomManager, client: Client) {
		this.manager = manager;
		this.client = client;
	}

	/** @todo */
	get chat() { return null; }

	/** @todo */
	banUser() {}

	/** @todo */
	unbanUser() {}

	/**
	 * Get all of the banned users from a room
	 * 
	 * ** REQUIRES ROOM ADMIN **
	 * 
	 * @param options - Options to use when getting all of the banned users from a room
	 * @returns an collection of all of the banned users
	 * 
	 * @alpha
	 */
	getbannedUsers(options?: GetBannedUsersOptions): Promise<RoomUserController[]> {
		return new Promise(async (resolve, reject) => {
			const cursor = (options?.cursor ? options.cursor : 0);
			const limit = (options?.limit ? options.limit : 500);

			const bannedUsers = await this.client.api.fetch(OpCode.ROOM.GET_BANNED_USERS, { cursor, limit })

			console.log(bannedUsers);
		});
	}

	/**
	 * Leave a room.
	 * @returns The manager ot this room.
	 */
	leave(): Promise<RoomManager> {
		return new Promise((resolve, reject) => {
			const leaveRoomTimeout = setTimeout(() => reject('Failed to leave room.'), TIMEOUT.LEAVE_ROOM);
			this.client.api.fetch(OpCode.ROOM.LEAVE, {}).then(dat => {
				clearTimeout(leaveRoomTimeout);

				this.client.emit(Event.ROOM.LEFT, this.manager);
				resolve(this.manager);
			});
		});
	}

}