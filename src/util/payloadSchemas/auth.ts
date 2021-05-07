import { AccessToken, RefreshToken } from "../types/opCodes";

export interface AuthPayloadSchema {
	accessToken?: AccessToken,
	refreshToken?: RefreshToken,
	reconnectToVoice?: boolean,
	currentRoomId?: string | null,
	muted?: boolean,
	deafened?: boolean,
	platform?: string
}