export enum OpCode {
	AUTH_GOOD = 'auth-good',
	NEW_TOKENS = 'new-tokens',
	
	ERROR = 'error',

	BOT_JOINED_AS_SPEAKER = 'you-joined-as-speaker',
	BOT_JOINED_AS_PEER = 'you-joined-as-peer',
	BOT_LEFT_ROOM = 'you_left_room',
	
	BOT_IS_NOW_SPEAKER = 'you-are-now-a-speaker',
	
	NEW_PEER_SPEAKER = 'new-peer-speaker',
	
	JOIN_ROOM = 'join_room',
	
	ACTIVE_SPEAKER_CHANGE = 'active_speaker_change',
	
	USER_LEFT_ROOM = 'user_left_room',
	USER_JOINED_ROOM = 'new_user_join_room',
	
	NEW_CHAT_MESSAGE = 'new_chat_msg',
	
	MOD_CHANGED = 'mod_changed',
	SPEAKER_REMOVED = 'speaker_removed',
	CHAT_USER_BANNED = 'chat_user_banned',
	
	ASK_TO_SPEAK = 'ask_to_speak',
	HAND_RAISED = 'hand_raised',
	ADD_SPEAKER = 'add_speaker',
	SET_LISTENER = 'set_listener',
	
	GET_CURRENT_ROOM_USERS = 'get_current_room_users',
	GET_CURRENT_ROOM_USERS_DONE = 'get_current_room_users_done',
	
	SEND_ROOM_CHAT_MSG = 'send_room_chat_msg',
	
	DELETE_ROOM_CHAT_MESSAGE = 'delete_room_chat_message',
	
	MUTE = 'mute',
	FOLLOW = 'follow',
	
	CHANGE_MOD_STATUS = 'change_mod_status',
	
	GET_TOP_PUBLIC_ROOMS = 'get_top_public_rooms',
	GET_TOP_PUBLIC_ROOMS_DONE = 'get_top_public_rooms_done',
	
	GET_USER_PROFILE = 'get_user_profile',
	
	FETCH_DONE = 'fetch_done',
	
	JOIN_ROOM_DONE = 'join_room_done',
	GET_FOLLOW_LIST = 'get_follow_list'
}