import Collection from '../Collection';
import { TypedEmitter } from 'tiny-typed-emitter';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Socket } from 'socket.io-client';

export class BaseClient extends TypedEmitter<ClientEvents> {
	constructor();

	get randStrConst(): string;

	public randStr(length: number): string
	public generateUUID(): string;
	private registerEvents(dir: string): Promise<void>;
	private registerHooks(dir: string): Promise<void>;
}

export class Client extends BaseClient {
	private _startTime: Date | null;
	private _telemetry: Telemetry | null;
	private _sendTelemetry: boolean;
	private _connectionDate: Date | null;
	private _botUser: BotUser | null;
	
	public socket: ReconnectingWebSocket | null;
	public api: API | null;
	public users: Users | null;
	public rooms: Rooms;
	public chat: Chat | null;
	
	private incommingChatMessageListener: Map<string, Function[]>
	private registerIncommingChatMessageListener: (text: string, fn: Function) => void

	private _hooks: Collection<string, any>
	private _eventCache: Collection<string, Function>

	get uptime(): number | null;
	get bot(): BotUser | null;

	public connect(token?: string, refreshToken?: string): Promise<Client>;
}

/**
 * Classes
 */
export class API {
	constructor(client: Client);

	private _messageCallbacks: Map<OpCode, Function[]>;
	private _messageOnceQueue: Map<OpCode, Function>;
	private _onFetchDoneQueue: Map<string, Function>

	private _registerMessageCallbackHandler(): void;

	public send(opCode: OpCode, data: any, fetchId?: string): Promise<void>;
	public fetchData(opCode: OpCode, data: any): Promise<SocketMessage>;
	
	public onMessageAny(callback: (msg: SocketMessage) => void): void; 
	public onMessage(opCode: OpCode, callback: (msg: SocketMessage) => void): void;
	public onMessageOnce(opCode: OpCode, callback: (msg: SocketMessage) => void): void;
	public onMessageOnceP(opCode: OpCode): Promise<SocketMessage>;
	
	public onFetchDone(fetchID: string, callback: (msg: SocketMessage) => void): void; 
	public onFetchDoneP(fetchID: string): Promise<SocketMessage>;

	public authenticate(token: string, refreshToken: string): Promise<void>;
}

export class BotUser {
	private _client: Client;
	private _rawData: any;
	private _muted: boolean;
	private _username: string;
	private _numFollowing: number;
	private _numFollowers: number;
	private _lastOnline: Date;
	private _id: string;
	private _displayName: string;
	private _bio: string;
	private _avatarURL: string;

	get id(): string;
	get bio(): string;
	get username(): string;
	get displayName(): string;
	get numFollowing(): number;
	get numFollowers(): number;
	get lastOnline(): Date;
	get avatarURL(): string;
	get muted(): boolean;
	get room(): RoomController;

	askToSpeak(): Promise<BotUser>;

	mute(): Promise<BotUser>;
	unmute(): Promise<BotUser>;
	toggleMute(): Promise<BotUser>;

	sendMessage(message: Message, options: SendMessageOptions)
}

export class Chat {
	private _client: Client;
	private _cooldown: number;

	send(message: Message, options: SendMessageOptions): Promise<MessageController>;
	sendMessage(message: Message, options: SendMessageOptions): Promise<MessageController>;
}

export class Rooms {
	private _client: Client;
	private _roomControllerCache: Map<string, RoomController>

	private setRoomData(data: any): void;

	get cache(): Map<string, RoomController>
	async get top(): TopRoom[];
	get current(): RoomController;

	public join(roomUnresolved: any): Promise<RoomController>;
	public get(id: string): RoomController | null;
}

export class Telemetry {
	constructor(client: Client);

	private _client: Client;
	private _socketDoge: Socket;
	
	public transmit(): Promise<void>;
}

export class Users {
	constructor(client: Client);

	private _client: Client;
	private _userControllerCache: Collection<string, UserController>;

	get cache(): Collection<string, UserController>;

	public setUserData(data: any): UserController;
	public get(value: string): UserController | Promise<UserController>;
}

/**
 * Controllers
 */
export class MessageController {
	constructor(data: RawMessageData, client: Client);

	private _client: Client;
	private _rawData: RawMessageData;
	private _id: string;
	private _author: UserController;
	private _date: Date;
	private _msgTokens: MessageToken[];

	readonly get id(): string;
	get author(): UserController;
	readonly get date(): Date;
	readonly get tokens(): MessageToken[];
	readonly get content(): string;
	readonly get mentions(): MessageMention[];
	readonly get links(): MessageLink[];

	reply(msg: Message, opitons: MessageReplyOptions): Promise<MessageController>;
	delete(): Promise<MessageController>;
	toString(): string;

}

export class RoomController {
	constructor(data: RawRoomData, client: Client);

	private _client: Client;
	private _rawData: RawRoomData;
	private _id: string;
	private _name: string;
	private _description: string;
	private _isPrivate: boolean;
	private _created: Date;
	private _creator: string;
	private _voiceServer: any;

	
	readonly get id(): string;
	readonly get name(): string;
	readonly get description(): string;
	readonly get isPrivate(): boolean;
	readonly get created(): Date;
	get creator(): UserController;
	readonly get voiceServer(): string;
	async get users(): Collection<string, UserController>;
}

export class UserController {
	constructor(data: any, client: Client);

	private _client: Client;
	private _id: string;
	private _bio: string;
	private _username: string;
	private _numFollowing: number;
	private _numFollowers: number;
	private _lastOnline: Date;
	private _followsBot: boolean;
	private _displayName: string;
	private _avatarURL: string;

	readonly get id(): string;
	readonly get bio(): string;
	readonly get avatarUrl(): string;
	readonly get username(): string;
	readonly get displayName(): string;
	readonly get numFollowers(): number;
	readonly get numFollowing(): number;
	readonly get followsBot(): boolean;

	follow(): Promise<UserController>;
	unfollow(): Promise<UserController>;

	whisper(msg: Message): Promise<MessageController>;
	mention(msg: Message): Promise<MessageController>;

	setListener(): Promise<UserController>;
	setSpeaker(): Promise<UserController>;

	private update(data: any): void;
}


/**
 * Other
 */
interface ClientEvents {
	"ready": (client: Client) => void;

	"telemetryInitialized": () => void;
	"socketMessagePong": (msg: SocketMessage) => void;
	"message": (msg: SocketMessage, arrivedId?: any) => void;
}

interface SendMessageOptions {
	whisperedTo?: string;
	priority: number;
}

interface SocketMessage {
	op: OpCode,
	fetchId?: string,
	d: any,
}

type TokenType =
	| "text"
	| "emote"
	| "link"
	| "block"
	| "mention"

interface MessageToken {
	t: TokenType,
	v: string;
}

type Message = 
	| string
	| MessageToken[]

interface RawRoomData {
	numFollowers: number,
	id: string,
	displayName: string,
}

interface RawMessageData {
	id: string,
	username: string,
	userId: string,
	tokens: MessageToken[],
	sentAt: string,
	isWhisper: boolean,
	displayName: string,
	avatarUrl: string
}

interface TopRoom {
	voiceServerId: any,
	peoplePreviewList: RawRoomData[],
	numPeopleInside: number,
	name: string,
	isPrivate: boolean,
	inserted_at: string,
	id: string,
	description: string,
	creatorId: string,
}

interface MessageMention {
	user: UserController,
	token: MessageToken
}

interface MessageLink {
	link: string,
	token: MessageToken
}

interface MessageReplyOptions {
	whispered?: boolean,
	mentionUser?: boolean
}

export enum Events {
	READY = 'ready',

	CONNECTION_TAKEN = 'connectionTaken',
	
	SOCKET_MESSAGE = 'message',
	SOCKET_MESSAGE_PONG = 'socketMessagePong',
	
	NEW_CHAT_MESSAGE = 'newChatMessage',
	
	MOD_CHANGED = 'modChanged',
	
	USER_JOINED_ROOM = 'userJoinedRoom',
	USER_LEFT_ROOM = 'userLeftRoom',
	
	BOT_JOINED_ROOM = 'botJoinedRoom',
	
	HAND_RAISED = 'handRaised',
	
	WEBRTC_VOIC_OPTS_REVIEVED = 'webRtcVoiceOptsRecieved',
	
	IMPORT_HOOK_FAILED = 'hookImportFailed',
	IMPORT_HOOK_SUCCESS = 'hookImportSuccess',
	
	NEW_TRANSPORT_CREATED = 'newTransportCreated',
	
	TELEMETRY_INITIALIZED = 'telemetryInitialized',
	TELEMETRY_DATA_TRANSMITTED = 'telemetryDataTransmitted',
}

export enum OpCode {
	AUTH_GOOD = 'auth-good',
	NEW_TOKENS = 'new-tokens',
	
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
}

export interface OpCodeData {
	''
}

