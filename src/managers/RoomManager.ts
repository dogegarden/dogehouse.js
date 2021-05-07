import { Client } from "../Client";
import { RoomController } from "../controllers/RoomController";
import { JsonRoomData, RoomPersonPreview } from "../util/types/rooms";

export class RoomManager {

	public client: Client;

	#_raw: JsonRoomData;

	#_id: string;
	#_name: string;
	#_description: string;

	#_isPrivate: boolean;

	#_numPeopleInside: number;
	#_peoplePreviewList: RoomPersonPreview[];

	#_creatorId: string;

	constructor(raw: JsonRoomData, client: Client) {
		this.client = client;
		this.#_raw = raw;

		this.#_id = raw.id;
		this.#_name = raw.name;
		this.#_description = raw.description;
		this.#_isPrivate = raw.isPrivate;

		this.#_numPeopleInside = raw.numPeopleInside;
		this.#_peoplePreviewList = raw.peoplePreviewList;
		this.#_creatorId = raw.creatorId;
	}

	/**
	 * ID of the room.
	 */
	get id(): string { return this.#_id; }

	/**
	 * Name of the room.
	 */
	get name(): string { return this.#_name; }

	/**
	 * Description of the room
	 */
	get description(): string { return this.#_description; }

	/**
	 * Is the room private?
	 */
	get isPrivate(): boolean { return this.#_isPrivate; }


	/**
	 * Number of people inside the room.
	 */
	get numPeopleInside(): number { return this.#_numPeopleInside; }

	/**
	 * A preview of all of the people in the room.
	 */
	get peoplePreviewList(): RoomPersonPreview[] { return this.#_peoplePreviewList; }


	/**
	 * The ID of the room creator 
	 */
	get creatorId(): string { return this.#_creatorId; }

	/**
	 * Room Manager Data to JSON
	 * 
	 * @param asString - Return the room data as a string?
	 * @returns Room data as a JSON string or object
	 */
	toJson(asString?: boolean): JsonRoomData | string{
		const dat: JsonRoomData = {
			id: this.#_id,
			name: this.#_name,
			description: this.#_description,

			isPrivate: this.#_isPrivate,

			numPeopleInside: this.#_numPeopleInside,
			peoplePreviewList: this.#_peoplePreviewList,

			creatorId: this.#_creatorId
		}

		if (!asString) return dat;
		else return JSON.stringify(dat);
	}

	/**
	 * Join this room.
	 * @returns The controller of this room
	 */
	join(): Promise<RoomController> {
		return new Promise(async (resolve, reject) => {
			return resolve(await this.client.rooms.join(this.id));
		});
	}

	/**
	 * Update this rooms data.
	 * 
	 * @param raw - The raw room data to update the manager with
	 * @returns The updated room manager.
	 */
	update(raw: JsonRoomData): RoomManager {
		this.#_id = raw.id;
		this.#_name = raw.name;
		this.#_description = raw.description;
		this.#_isPrivate = raw.isPrivate;

		this.#_numPeopleInside = raw.numPeopleInside;
		this.#_peoplePreviewList = raw.peoplePreviewList;
		this.#_creatorId = raw.creatorId;

		return this;
	}

}