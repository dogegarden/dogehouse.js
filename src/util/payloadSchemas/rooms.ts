export interface GetTopRoomsPayloadSchema {
	cursor: number,
	limit: number
}

export interface JoinRoomPayloadSchema {
	roomId: string;
}

export interface LegacyJoinRoomPayloadSchema {
	roomId: string;
}

export interface GetRoomInfoPayloadSchema {
	roomId: string;
}

export interface GetBannedUsersPayloadSchema {
	cursor: number;
	limit: number;
}

/**
 * Empty Payload's
 */
 export interface LeaveRoomPayloadSchema {}