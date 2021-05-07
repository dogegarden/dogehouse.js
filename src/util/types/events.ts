import { Client } from "../../Client";
import { CloseEvent } from "reconnecting-websocket";
import { SocketMessage } from "./opCodes";
import { RoomController } from "../../controllers/RoomController";
import { RoomManager } from "../../managers/RoomManager";

export const Event = {	
	CLIENT: {
		READY: "client:ready"
	},

	ROOM: {
		JOINED: "room:joined",
		LEFT: "room:left",
	},
	
	SOCKET: {
		NEW_MESSAGE: "socket:newMessage",
		CONNECTION_OPENED: "socket:connectionOpened",
		CONNECTION_CLOSED: "socket:connectionClosed"
	}
} as const;

export interface ClientEvents {
	/**
	 * Client Events
	 */
	[Event.CLIENT.READY]: (client: Client) => void,

	/**
	 * Room Events
	 */
	[Event.ROOM.JOINED]: (room: RoomController) => void;
	[Event.ROOM.LEFT]: (room: RoomManager) => void;

	/**
	 * Socket Events
	 */
	[Event.SOCKET.NEW_MESSAGE]: (msg: SocketMessage<any>) => void,
	[Event.SOCKET.CONNECTION_OPENED]: () => void,
	[Event.SOCKET.CONNECTION_CLOSED]: (event: CloseEvent) => void,
}