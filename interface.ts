export interface ClientOptions {
  sendTelemetry: boolean;
  blockAngular: boolean;
}

export interface SendMessageOptions {
  whisperedTo: string;
  priority: number;
}

export interface MessageToken {
  t: string;
  v: number;
}

export interface ChatOptions {
  cooldown: number;
}

export interface BotTelemetryData {
  uuid: string;
  username: string;
  avatarURL: string;
}

export interface RoomUserTelemetryData {
  id: string;
  bio: string;
  avatarURL: string;
  username: string;
  displayName: string;
  numFollowers: number;
  numFollowing: number;
  followsBot: boolean;
}

export interface RoomTelemetryData {
  uuid: string;
  name: string;
  listening: number;
  users: RoomUserTelemetryData[];
}

export interface TelemetryData {
  bot: Partial<BotTelemetryData>;
  room: Partial<RoomTelemetryData>;
}

export interface MessageReplyOptions {
  whispered: boolean;
  mentionUser: boolean;
}

export interface MessageData {
  id: string;
  username: string;
  userId: string;
  tokens: MessageToken[];
  sentAt: string;
  isWhisper: boolean;
  displayName: string;
  avatarUrl: string;
}

export interface PeoplePreviewObject {
  numFollowers: number;
  id: string;
  displayName: string;
}

export interface RawRoomData {
  voiceServerId: string;
  peoplePreviewList: [];
  numPeopleInside: number;
  name: string;
  isPrivate: boolean;
  inserted_at: string;
  id: string;
  description: string;
  creatorId: string;
}
