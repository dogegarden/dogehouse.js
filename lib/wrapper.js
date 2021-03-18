"use strict";
// @ts-nocheck because internet is unpredictable
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = void 0;
var wrap = function (connection) { return ({
    getTopPublicRooms: function () {
        return connection
            .fetch("get_top_public_rooms", { cursor: 0 })
            .then(function (data) { return data.rooms; });
    },
    joinRoom: function (id) {
        return connection.fetch("join_room", { roomId: id }, "join_room_done");
    },
    sendRoomChatMsg: function (ast, whisperedTo) {
        if (whisperedTo === void 0) { whisperedTo = []; }
        return connection.send("send_room_chat_msg", { tokens: ast, whisperedTo: whisperedTo });
    },
    leaveRoom: function () {
        return connection.fetch("leave_room", {}, "you_left_room");
    },
    listenForChatMsg: function (callback) {
        connection.addListener("new_chat_msg", function (_a) {
            var userId = _a.userId, msg = _a.msg;
            return callback({ userId: userId, msg: msg });
        });
    },
}); };
exports.wrap = wrap;
