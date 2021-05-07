import { Client } from "../Client";
import { UserManager } from "../managers/UserManager";
import { BaseUserInfo, BotUserJson, UserRoomPermissions } from "../util/types/user";

export class BotUser {

	public client: Client;
	
	#_rawData: BaseUserInfo;

	#_avatarUrl: string | null;
	#_bannerUrl: string | null;
	
	#_id: string;
	#_bio: string;
	#_username: string;
	#_botOwnerId: string;
	#_displayName: string;

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
		this.#_botOwnerId = raw.botOwnerId;
		this.#_displayName = raw.displayName;

		this.#_numFollowers = raw.numFollowers;
		this.#_numFollowing = raw.numFollowing;

		this.#_roomPermissions = raw.roomPermissions;
	}

	/**
	 * Get the Bot's Avatar URL
	 */
	get avatarUrl(): string | null { return this.#_avatarUrl; }

	/**
	 * Get the Bot's Banner URL
	 */
	get bannerUrl(): string | null { return this.#_bannerUrl; }


	/**
	 * Get the bot's User ID
	 */
	get id(): string { return this.#_id; }

	/**
	 * Get the bot's bio.
	 */
	get bio(): string { return this.#_bio; }

	/**
	 * Get the bot's username.
	 */
	get username(): string { return this.#_username; }

	/**
	 * Get the bot's display name.
	 */
	get displayName(): string { return this.#_displayName; }
	

	/**
	 * Get the number of followers that the bot has.
	 */
	get numFollowers(): number { return this.#_numFollowers; }

	/**
	 * Get the number of people that the bot follows.
	 */
	get numFollowing(): number { return this.#_numFollowing; }


	/**
	 * Fetch the bot owner's User information. 
	 */
	get owner(): Promise<UserManager | undefined | null> { return (async () => { return this.client.users.get(this.#_botOwnerId); })(); }

	/**
	 * To JSON
	 * 
	 * Convert the Bot's user information into JSON Data.
	 * 
	 * @param asString - Do you want this to be returned as a JSON string?
	 * @returns A JSON object or a JSON string
	 */
	toJson(asString?: boolean): BotUserJson | string {
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
	 * Update Data
	 * 
	 * This method will allow you to update the cached data on the Bot User.
	 * 
	 * @param raw - The Raw Base User Info Object
	 * @returns The updated Bot User Class
	 */
	update(raw: BaseUserInfo): BotUser {
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