import { BaseRoomData } from "../types/rooms";

export interface GetTopRoomsResponseSchema {
	rooms: BaseRoomData[],
	nextCursor: number | null,
	initial: boolean
}

export interface RoomInfoResponseSchema {
	id: string;
	name: string;
	description: string;
	isPrivate: boolean;
}

export interface LeaveRoomResponseSchema {}

export interface UpdateRoomResponseSchema {}

export interface GetBannedUsersResponseSchema {}

/**
 * LEGACY 
 */
export interface LegacyRoomInfoResponseSchema {
	activeSpeakerMap: any,
	autoSpeaker: boolean | null,
	muteMap: any,
	room: BaseRoomData,
	users: Array<any>
}