import { Client } from "../Client";
import { BaseUserInfo, BotUserJson, UserJson, UserRoomPermissions } from "../util/types/user";

export class UserManager {

	public client: Client;

	#_rawData: BaseUserInfo;
	
	#_avatarUrl: string | null;
	#_bannerUrl: string | null;

	#_id: string;
	#_bio: string;
	#_username: string;
	#_displayName: string;
	#_botOwnerId: string | null;

	#_numFollowers: number;
	#_numFollowing: number;

	#_roomPermissions: UserRoomPermissions | null;

	constructor(raw: BaseUserInfo, client: Client) {
		this.client = client;
		this.#_rawData = raw;

		this.#_avatarUrl = raw.avatarUrl;
		this.#_bannerUrl = raw.bannerUrl;

		this.#_id = raw.id;
		this.#_bio = raw.bio;
		this.#_username = raw.username;
		this.#_displayName = raw.displayName;
		this.#_botOwnerId = raw.botOwnerId;
		
		this.#_numFollowers = raw.numFollowers;
		this.#_numFollowing = raw.numFollowing;

		this.#_roomPermissions = raw.roomPermissions;
	}

	/**
	 * Get the user's ID.
	 */
	get id(): string { return this.#_id; }

	/**
	 * Get the user's bio.
	 */
	get bio(): string { return this.#_bio; }

	/**
	 * Get the user's username.
	 */
	get username(): string { return this.#_username; }

	/**
	 * Get the user's display name.
	 */
	get displayName(): string { return this.#_displayName; }
	

	/**
	 * Is this user a bot?
	 */
	get isBot(): boolean { return (this.#_botOwnerId !== null); }

	/**
	 * Returns the manager of the bot owner if they're a bot.
	 */
	get botOwner(): Promise<UserManager | undefined | null> { return (async () => { return await this.client.users.get(this.#_botOwnerId) })() }

	
	/**
	 * Get the number of users that follow this user.
	 */
	get numFollowers(): number { return this.#_numFollowers; }

	/**
	 * Get the number of people that this user follows.
	 */
	get numFollowing(): number { return this.#_numFollowing; }


	/**
	 * If you are in a room with this user, it will return the permisssions that they
	 * have in this room, otherwise it will return null.
	 */
	get roomPermissions(): UserRoomPermissions | null { return this.#_roomPermissions}


	/**
	 * Get the user's info as JSON
	 * 
	 * @param asString - Do you want the data to be returned as a JSON string?
	 * @returns The user's info in a JSON object or string.
	 */
	toJson(asString?: boolean): UserJson | string {
		const dat = {
			id: this.#_id,
			bio: this.#_bio,
			username: this.#_username,
			displayName: this.#_displayName,

			avatarUrl: this.#_avatarUrl,
			bannerUrl: this.#_bannerUrl,

			isbot: (this.#_rawData.botOwnerId !== null),
			botOwner: this.#_botOwnerId,

			numFollowers: this.#_numFollowers,
			numFollowing: this.#_numFollowing
		}

		if (!asString) return dat;
		else return JSON.stringify(dat, null, 2);
	}

	/**
	 * Update this manager's data.
	 * 
	 * @param raw - The raw data used to update this user manager.
	 * @returns The updated User Manger.
	 */
	update(raw: BaseUserInfo): UserManager {
		this.#_avatarUrl = raw.avatarUrl;
		this.#_bannerUrl = raw.bannerUrl;

		this.#_id = raw.id;
		this.#_bio = raw.bio;
		this.#_username = raw.username;
		this.#_displayName = raw.displayName;
		this.#_botOwnerId = raw.botOwnerId;
		
		this.#_numFollowers = raw.numFollowers;
		this.#_numFollowing = raw.numFollowing;

		this.#_roomPermissions = raw.roomPermissions;

		return this;
	}

}