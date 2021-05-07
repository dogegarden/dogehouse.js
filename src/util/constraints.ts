export const CONNECTION = {
	HEARTBEAT_INTERVAL: 8000,
	API_URL: "wss://api.dogehouse.tv/socket",
	TIMEOUT: 15000,
	AUTH: {
		RECONNECT_TO_VOICE: false,
		CURRENT_ROOM_ID: null,
		MUTED: false,
		DEAFENED: false,
		PLATFORM: 'dogehouse.js'
	}
}

export const API_INFO = {
	url: 'https://api.dogehouse.tv',
	version: '0.3.0'
}

export const TIMEOUT = {
	JOIN_ROOM: 10000,
	LEAVE_ROOM: 10000,
	FETCH_REQUEST: 20000,
}