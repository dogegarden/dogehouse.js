export interface UserRoomPermissions {
	isSpeaker: boolean,
	isMod: boolean,
	askedToSpeak: boolean
}

export interface BaseUserInfo {
	avatarUrl: string | null,
	bannerUrl: string | null,
	bio: string
	botOwnerId: string,
	currentRoomId: string | null,
	displayName: string,
	followsYou: boolean | null,
	iBlockedThem: boolean | null,
	id: string,
	lastOnline: string,
	numFollowers: number,
	numFollowing: number,
	online: boolean,
	roomPermissions: UserRoomPermissions | null,
	username: string,
	youAreFollowing: boolean | null
}

export interface BotUserJson {
	id?: string;
	bio?: string;
	username?: string;
	displayName?: string;

	avatarUrl?: string | null;
	bannerUrl?: string | null;

	isBot?: boolean;
	botOwnerId?: string | null;

	numFollowers?: number;
	numFollowing?: number;
}

export interface UserJson {
	id?: string;
	bio?: string;
	username?: string;
	displayName?: string;

	avatarUrl?: string | null;
	bannerUrl?: string | null;

	isBot?: boolean;
	botOwnerId?: string | null;

	numFollowers?: number;
	numFollowing?: number;
}

export interface UserStatsInfo {
	numUsersTotal: number, // Total number of registered users on the platform.
	activeLastTwoDays: {
		percent: number, // Percentage of all users that have been active in the last two days.
		total: number // Number of users active in the last two days
	},
	lastUpdated: {
		duration: number, // Duration in ms since last update
		date: Date // The date that this was last updated
	}
}