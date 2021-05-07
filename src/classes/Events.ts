import Collection from "@discordjs/collection";
import fs from "fs";
import { glob } from "glob";
import { Client } from "../Client";

export class Events {

	private _eventCache: Collection<String, (client: Client) => void> = new Collection();
	public client: Client;

	constructor(client: Client) {
		this.client = client;
	}
	
	/**
	 * Register all internal events.
	 * 
	 * @param dir - The directory to pull events from
	 * @returns The Updated instance of the Events Class.
	 */
	registerAll(dir: string):Promise<Events> {
		return new Promise((resolve, reject) => {
			glob(dir, (err, matches) => {
				matches.forEach(f => {
					if (!fs.existsSync(f)) reject(new Error(`(${f}) File doesn't exist`));

					const file = require(f);
					const ev: (client: Client) => void = file.default;

					ev(this.client);
				});
				return resolve(this);
			});
		});
	}
}