import { Connection } from "./raw";
import { MessageToken, Room, UUID, UserList } from "./entities";
export declare const wrap: (connection: Connection) => {
    getTopPublicRooms: () => Promise<Room[]>;
    joinRoom: (id: UUID) => Promise<void>;
    sendRoomChatMsg: (ast: MessageToken[], whisperedTo?: string[]) => Promise<void>;
    leaveRoom: () => Promise<{
        roomId: UUID;
    }>;
    listenForChatMsg: (callback: any) => void;
    getRoomUsers: () => Promise<UserList>;
};
