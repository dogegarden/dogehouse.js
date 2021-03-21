import { Connection } from "./raw";
import { MessageToken, Room, UUID, Message, UserList, GetRoomUsersResponse } from "./entities";
export declare const wrap: (connection: Connection) => {
    getTopPublicRooms: () => Promise<Room[]>;
    joinRoom: (id: UUID) => Promise<void>;
    sendRoomChatMsg: (ast: MessageToken[], whisperedTo?: string[]) => Promise<void>;
    leaveRoom: () => Promise<{
        roomId: UUID;
    }>;
    listenForChatMsg: (callback: ({ userId, msg }: {
        userId: string;
        msg: Message;
    }) => void) => void;
    getCurrentRoomUsers: () => Promise<GetRoomUsersResponse>;
    getRoomUsers: () => Promise<UserList>;
};
