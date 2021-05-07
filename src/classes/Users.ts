import Collection from "@discordjs/collection";
import axios from "axios";
import { Client } from "../Client";
import { UserManager } from "../managers/UserManager";
import { API_INFO } from "../util/constraints";
import { OpCode } from "../util/types/opCodes";
import { UserStatsInfo } from "../util/types/user";

export class Users {

	public client: Client;
	private _userCache: Collection<string, UserManager> = new Collection();

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Get a collection of all of the cached users on dogehouse
	 */
	get cache(): Collection<string, UserManager> {
		return this._userCache;
	}

	/**
	 * Get the information of a user on DogeHouse
	 * 
	 * @param value - UserID or Username
	 * @returns The Manager for the requested user
	 */
	get(value: any): Promise<UserManager | undefined | null> {
		return new Promise((resolve, reject) => {
			const cacheLookup = this._userCache.filter(usr => (usr.id == value) || (usr.username == value)).array();
			if (cacheLookup.length != 0) return resolve(cacheLookup[0]);
			if (value instanceof UserManager) return resolve(value as UserManager);
			
			this.client.api.fetch(OpCode.USER.GET_INFO, {userIdOrUsername: value}).then(res => {
				if (this._userCache.has(res.p.id)) return resolve(this._userCache.get(res.p.id)?.update(res.p));
				
				const controller = new UserManager(res.p, this.client);
				this._userCache.set(res.p.id, controller);
				return resolve(controller);
			})
		})
	}

	/**
	 * Get User Stats
	 * 
	 * This will return global user statistics fron DogeHouse
	 * 
	 * @param asString - Do you want the data returned as a JSON string
	 * @returns JSON Object or JSON string with global user stats on DogeHouse
	 * 
	 * @async
	 */
	getStats(asString?: boolean): Promise<UserStatsInfo | string> {
		return new Promise(async (resolve, reject) => {
			const url = `${API_INFO.url}/stats`;
			const raw = await axios.get(url).then(dat => dat.data).catch(reject);

			const numUsers: number = raw.numUsers;
			
			const activeLastTwoDays: number = raw.activeInLastTwoDays;
			const percent = (activeLastTwoDays / numUsers)
			
			const lastUpdated: Date = new Date(raw.lastUpdated);
			const duration: number = (new Date().getTime() - lastUpdated.getTime())

			const dat = {
				numUsersTotal: numUsers,
				activeLastTwoDays:{
					percent: percent,
					total: activeLastTwoDays
				},
				lastUpdated: {
					duration: duration,
					date: lastUpdated
				}
			}
			if (!asString) return resolve(dat);
			else return resolve(JSON.stringify(dat, null, 2));

		});
	}

}