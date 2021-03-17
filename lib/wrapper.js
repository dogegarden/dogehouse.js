"use strict";
// @ts-nocheck because internet is unpredictable
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = void 0;
var wrap = function (connection) { return ({
    getTopPublicRooms: function () {
        return connection.fetch("get_top_public_rooms", { cursor: 0 }).then(function (data) { return data.rooms; });
    },
    joinRoom: function (id) {
        return connection.fetch("join_room", { roomId: id }, "join_room_done");
    },
    sendRoomChatMsg: function (ast, whisperedTo) {
        if (whisperedTo === void 0) { whisperedTo = []; }
        return connection.send("send_room_chat_msg", { tokens: ast, whisperedTo: whisperedTo });
    },
}); };
exports.wrap = wrap;
