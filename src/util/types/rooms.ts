export interface GetTopRoomsOptions {
	cusrsor?: number, // The position you want to start at.
	limit?: number, // Max amount of returns
}

export interface RoomPersonPreview {
	id: string,
	displayName: string,
	numFollowers: number,
	avatarUrl: string
}

export interface BaseRoomData {
	id: string,
	name: string,
	description: string,
	numPeopleInside: number,
	isPrivate: boolean,
	creatorId: string,
	peoplePreviewList: RoomPersonPreview[],
	voiceServerId: string,
	inserted_at: string
}

export interface GetBannedUsersOptions {
	cursor?: number;
	limit?: number;
}

/**
 * JSON METHODS
 */

export interface JsonRoomData {
	id: string;
	name: string;
	description: string;	
	
	isPrivate: boolean;
	
	numPeopleInside: number;
	peoplePreviewList: RoomPersonPreview[];

	creatorId: string;
}