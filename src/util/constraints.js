exports.CONNECTION = {
	HEARTBEAT_INTERVAL: 8000,
	API_URL: "wss://api.dogehouse.tv/socket",
	CONNECTION_TIMEOUT: 15000,
	AUTH: {
		RECONNECT_TO_VOICE: false,
		CURRENT_ROOM_ID: null,
		MUTED: false,
		PLATFORM: 'The world wide web'
	}
}

exports.TELEMETRY = {
	URL: 'wss://socket.dogehouse.xyz',
	PATH: '/socket',
	INTERVAL: 8000,
	EMITTER: {
		INIT: 'init',
		TRANSMIT: 'transmit'
	}
}

exports.TIMEOUT = {
	JOIN_ROOM: 30000,
	CHAT_COOLDOWN: 1200,
}

exports.EVENT = {
	READY: 'ready',

	CONNECTION_TAKEN: 'connectionTaken',

	SOCKET_MESSAGE: 'message',
	SOCKET_MESSAGE_PONG: 'socketMessagePong',

	NEW_CHAT_MESSAGE: 'newChatMessage',

	MOD_CHANGED: 'modChanged',

	USER_JOINED_ROOM: 'userJoinedRoom',
	USER_LEFT_ROOM: 'userLeftRoom',

	BOT_JOINED_ROOM: 'botJoinedRoom',

	HAND_RAISED: 'handRaised',

    WEBRTC_VOIC_OPTS_REVIEVED: 'webRtcVoiceOptsRecieved',

	IMPORT_HOOK_FAILED: 'hookImportFailed',
	IMPORT_HOOK_SUCCESS: 'hookImportSuccess',

	NEW_TRANSPORT_CREATED: 'newTransportCreated',

	TELEMETRY_INITIALIZED: 'telemetryInitialized',
	TELEMETRY_DATA_TRANSMITTED: 'telemetryDataTransmitted',
}

exports.OP_CODE = {
    AUTH_GOOD: 'auth-good',
    NEW_TOKENS: 'new-tokens',

    BOT_JOINED_AS_SPEAKER: 'you-joined-as-speaker',
    BOT_JOINED_AS_PEER: 'you-joined-as-peer',
    BOT_LEFT_ROOM: 'you_left_room',

    BOT_IS_NOW_SPEAKER: 'you-are-now-a-speaker',
    
    NEW_PEER_SPEAKER: 'new-peer-speaker',

    JOIN_ROOM: 'join_room',
    JOIN_ROOM_DONE: 'join_room_done',
    
    ACTIVE_SPEAKER_CHANGE: 'active_speaker_change',
    
    USER_LEFT_ROOM: 'user_left_room',
    USER_JOINED_ROOM: 'new_user_join_room',
    
    NEW_CHAT_MESSAGE: 'new_chat_msg',
    
    MOD_CHANGED: 'mod_changed',
    SPEAKER_REMOVED: 'speaker_removed',
    CHAT_USER_BANNED: 'chat_user_banned',

    ASK_TO_SPEAK: 'ask_to_speak',
    HAND_RAISED: 'hand_raised',
    ADD_SPEAKER: 'add_speaker',
    SET_LISTENER: 'set_listener',

    GET_CURRENT_ROOM_USERS: 'get_current_room_users',
    GET_CURRENT_ROOM_USERS_DONE: 'get_current_room_users_done',

    SEND_ROOM_CHAT_MSG: 'send_room_chat_msg',

    DELETE_ROOM_CHAT_MESSAGE: 'delete_room_chat_message',

    MUTE: 'mute',
    FOLLOW: 'follow',

    CHANGE_MOD_STATUS: 'change_mod_status',

    GET_TOP_PUBLIC_ROOMS: 'get_top_public_rooms',
    GET_TOP_PUBLIC_ROOMS_DONE: 'get_top_public_rooms_done',

	GET_USER_PROFILE: 'get_user_profile',

	FETCH_DONE: 'fetch_done'
}

exports.ERROR = {
	ROOMS: {
		UNRESOLVABLE_ROOM: 'Could not resolve room value to an active room.',
		ROOM_CONNECTION_TIMEOUT: 'Timed out whilst attempting to connect to a room.'
	}
}
