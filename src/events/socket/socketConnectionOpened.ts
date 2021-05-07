import { Client } from "../../Client";
import { Event } from "../../util/types/events";

export default (client: Client) => {
	client.on(Event.SOCKET.CONNECTION_OPENED, () => {
		console.log("Socket Connection Opened");
	})
}