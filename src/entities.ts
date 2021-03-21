export type UUID = string;

export type UserPreview = {
  numFollowers: number;
  id: UUID;
  displayName: string;
};

export type Room = {
  voiceServerId: number | "";
  peoplePreviewList: UserPreview[];
  numPeopleInside: number;
  name: string;
  isPrivate: boolean;
  id: UUID;
  description: string;
  creatorId: UUID;
};

export type User = {
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

export type MessageToken<T extends string = string, V = unknown> = {
  t: T;
  v: V;
};

export type TextToken = MessageToken<"text", string>;
export type MentionToken = MessageToken<"mention", string>;
export type LinkToken = MessageToken<"link", string>;

export type Message = {
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

export type UserList = {
  users: {
    youAreFollowing: null | true;
    username: string;
    roomPermissions: [Object]; // needs updating, too lazy for that
    online: true;
    numFollowing: number;
    numFollowers: number;
    lastOnline: string;
    id: string;
    followsYou: null | true;
    displayName: string;
    currentRoomId: string;
    currentRoom: [Object]; // needs updating, too lazy for that
    bio: string;
    avatarUrl: string;
  }[];
  roomId: string;
  raiseHandMap: { [key: string]: boolean }; // seems broken
  muteMap: { [key: string]: boolean };
  autoSpeaker: false;
  activeSpeakerMap: { [key: string]: boolean };
};

export type RoomPermissions = {
  askedToSpeak: boolean;
  isSpeaker: boolean;
  isMod: boolean;
};

export type BaseUser = {
  username: string;
  online: boolean;
  lastOnline: Date;
  id: string;
  bio: string;
  displayName: string;
  avatarUrl: string;
  numFollowing: number;
  numFollowers: number;
  currentRoom?: Room;
};

export type UserWithFollowInfo = BaseUser & {
  followsYou?: boolean;
  youAreFollowing?: boolean;
};

export type RoomUser = {
  roomPermissions?: RoomPermissions | null;
} & UserWithFollowInfo;


export type GetRoomUsersResponse = {
  users: RoomUser[];
  muteMap: Record<string, boolean>;
  roomId: string;
  activeSpeakerMap: Record<string, boolean>;
  autoSpeaker: boolean;
};

export type Wrapper = {
  getTopPublicRooms: () => Promise<Room[]>;
  joinRoom: (id: UUID) => Promise<void>;
  sendRoomChatMsg: (ast: MessageToken[]) => Promise<void>;
  leaveRoom: () => Promise<{ roomId: UUID }>;
  listenForChatMsg: (
    callback: ({ userId, msg }: { userId: string; msg: Message }) => void
  ) => void;
  getRoomUsers: () => Promise<UserList>;
};
