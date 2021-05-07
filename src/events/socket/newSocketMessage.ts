import { Client } from "../../Client";
import { Event } from "../../util/types/events";

export default (client: Client) => {
	client.on(Event.SOCKET.NEW_MESSAGE, (msg) => {
		// .. On Socket Message

		// console.log(msg.op);
	})
}