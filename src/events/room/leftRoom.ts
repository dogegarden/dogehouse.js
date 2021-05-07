import { Client } from "../../Client";
import { Event } from "../../util/types/events";

export default (client: Client) => {
	client.on(Event.ROOM.LEFT, (room) => {
		console.log("Left Room:", room.name);
	})
}