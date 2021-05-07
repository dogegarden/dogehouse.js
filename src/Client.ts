import { BaseClient } from "./BaseClient";
import { API } from "./classes/API";
import { BotUser } from "./classes/BotUser";
import { Events } from "./classes/Events";
import { Rooms } from "./classes/Rooms";
import { Users } from "./classes/Users";
import { CONNECTION } from "./util/constraints";
import { Event } from "./util/types/events";

type APIKey = string;

export class Client extends BaseClient {

	#_events: Events = new Events(this);
	#_api: API = new API(this);
	#_users: Users = new Users(this);
	#_bot: BotUser | null = null;
	#_rooms: Rooms = new Rooms(this);

	constructor() {
		super();
	}

	/**
	 * Internal API Wrapper.
	 * 
	 * This is what is used to contact the DogeHouse API and manage OpCodes.
	 */
	get api(): API { return this.#_api; }

	/**
	 * Users Class
	 * 
	 * This class will allow you to fetch, cache, and manage users.
	 */
	get users(): Users { return this.#_users; }

	/**
	 * Bot Class
	 * 
	 * This will return all of the bot account's information as well as method's you can 
	 * run to update the bot's information
	 */
	get bot(): BotUser | null { return this.#_bot; }

	/**
	 * Rooms Class
	 * 
	 * This what you will use to join, manage, cache, and fetch rooms and their data.
	 */
	get rooms(): Rooms { return this.#_rooms; }

	/**
	 * Login to the DogeHouse API
	 * 
	 * @param key - Your bot's API key
	 * @returns Client instance
	 */
	login(key: string): Promise<Client> {
		return new Promise(async (resolve, reject) => {		
			const eventDir = (__filename.split(".")[__filename.split(".").length-1] == "ts" ? `${__dirname}/events/**/*.ts` : `${__dirname}/events/**/*.js`)

			await this.#_events.registerAll(eventDir); // Register all of the internal events.
			await this.#_api.connect(); // Connect the API to DogeHouse

			await this.#_api.authenticate(key).then((data) => {
				this.#_bot = new BotUser(data, this);

				this.emit(Event.CLIENT.READY, this);
				resolve(this);
			});
		});
	}

}