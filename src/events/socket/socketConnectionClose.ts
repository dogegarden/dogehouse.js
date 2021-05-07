import { Client } from "../../Client";
import { Event } from "../../util/types/events";

export default (client: Client) => {
	client.on(Event.SOCKET.CONNECTION_CLOSED, (e) => {
		console.log("Socket connection closed:", e.code);
	});
}