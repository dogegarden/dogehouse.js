// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { MessageToken, Room, UUID, Message, UserList, GetRoomUsersResponse } from "./entities";

export const wrap = (connection: Connection) => ({
  getTopPublicRooms: (): Promise<Room[]> =>
    connection
      .fetch("get_top_public_rooms", { cursor: 0 })
      .then((data) => data.rooms),

  joinRoom: (id: UUID): Promise<void> =>
    connection.fetch("join_room", { roomId: id }, "join_room_done"),

  sendRoomChatMsg: (
    ast: MessageToken[],
    whisperedTo: string[] = []
  ): Promise<void> =>
    connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),

  leaveRoom: (): Promise<{ roomId: UUID }> =>
    connection.fetch("leave_room", {}, "you_left_room"),

  listenForChatMsg: (
    callback: ({ userId, msg }: { userId: string; msg: Message }) => void
  ): void => {
    connection.addListener(
      "new_chat_msg",
      ({ userId, msg }: { userId: string; msg: Message }) =>
        callback({ userId, msg })
    );
  },

  getCurrentRoomUsers: (): Promise<GetRoomUsersResponse> =>
    connection.fetch("get_current_room_users"),

  getRoomUsers: async (): Promise<UserList> =>
    connection.fetch(
      "get_current_room_users",
      {},
      "get_current_room_users_done"
    ),
});
