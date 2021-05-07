import { Client } from "../Client";
import { UserManager } from "../managers/UserManager";

export class RoomUserController {

	public client: Client;
	public manager: UserManager;

	constructor(manager: UserManager, client: Client) {
		this.client = client;
		this.manager = manager;
	}

	ban(): Promise<RoomUserController> {
		return new Promise((resolve, reject) => {
					
		});
	}

	unban(): Promise<RoomUserController> {
		return new Promise((resolve, reject) => {

		});
	}
}