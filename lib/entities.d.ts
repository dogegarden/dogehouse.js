export declare type UUID = string;
export declare type UserPreview = {
    numFollowers: number;
    id: UUID;
    displayName: string;
};
export declare type Room = {
    voiceServerId: number | "";
    peoplePreviewList: UserPreview[];
    numPeopleInside: number;
    name: string;
    isPrivate: boolean;
    id: UUID;
    description: string;
    creatorId: UUID;
};
export declare type User = {
    youAreFollowing?: boolean;
    username: string;
    roomPermissions?: unknown;
    online: boolean;
    numFollowing: number;
    numFollowers: number;
    lastOnline: string;
    id: UUID;
    followsYou?: boolean;
    displayName: string;
    currentRoomId?: UUID;
    currentRoom: Room;
    bio: string;
    avatarUrl: string;
};
export declare type MessageToken<T extends string = string, V = unknown> = {
    t: T;
    v: V;
};
export declare type TextToken = MessageToken<"text", string>;
export declare type MentionToken = MessageToken<"mention", string>;
export declare type LinkToken = MessageToken<"link", string>;
export declare type Message = {
    id: UUID;
    userId: UUID;
    avatarUrl: UUID;
    color: string;
    displayName: string;
    tokens: MessageToken[];
    deleted?: boolean;
    deleterId?: UUID;
    sentAt: string;
    isWhisper?: boolean;
};
export declare type UserList = {
    users: {
        youAreFollowing: null | true;
        username: string;
        roomPermissions: [Object];
        online: true;
        numFollowing: number;
        numFollowers: number;
        lastOnline: string;
        id: string;
        followsYou: null | true;
        displayName: string;
        currentRoomId: string;
        currentRoom: [Object];
        bio: string;
        avatarUrl: string;
    }[];
    roomId: string;
    raiseHandMap: {
        [key: string]: boolean;
    };
    muteMap: {
        [key: string]: boolean;
    };
    autoSpeaker: false;
    activeSpeakerMap: {
        [key: string]: boolean;
    };
};
