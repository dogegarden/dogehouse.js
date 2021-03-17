"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
var reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
var uuid_1 = require("uuid");
var heartbeatInterval = 8000;
var apiUrl = "wss://api.dogehouse.tv/socket";
var connectionTimeout = 15000;
var connect = function (token, refreshToken, _a) {
    var _b = _a.logger, logger = _b === void 0 ? function () { } : _b, _c = _a.onConnectionTaken, onConnectionTaken = _c === void 0 ? function () {
        console.error("\nAnother client has taken the connection");
        process.exit();
    } : _c;
    return new Promise(function (resolve, reject) {
        var socket = new reconnecting_websocket_1.default(apiUrl, [], { connectionTimeout: connectionTimeout, WebSocket: isomorphic_ws_1.default });
        var apiSend = function (opcode, data, fetchId) {
            var raw = "{\"op\":\"" + opcode + "\",\"d\":" + JSON.stringify(data) + (fetchId ? ",\"fetchId\":\"" + fetchId + "\"" : "") + "}";
            socket.send(raw);
            logger("out", opcode, data, fetchId, raw);
        };
        var listeners = [];
        var runListener = function (listener, data, fetchId) {
            var remove = listener.handler(data, fetchId);
            if (remove)
                listeners.splice(listeners.indexOf(listener), 1);
        };
        var connection = {
            addListener: function (opcode, handler) { return listeners.push({ opcode: opcode, handler: handler }); },
            user: null,
            send: apiSend,
            fetch: function (opcode, data, doneOpcode) { return new Promise(function (resolveFetch, rejectFetch) {
                var fetchId = !doneOpcode && uuid_1.v4();
                listeners.push({
                    opcode: doneOpcode !== null && doneOpcode !== void 0 ? doneOpcode : "fetch_done",
                    handler: function (data, arrivedId) {
                        if (!doneOpcode && arrivedId !== fetchId)
                            return;
                        resolveFetch(data);
                        return true;
                    }
                });
                apiSend(opcode, data, fetchId || undefined);
            }); }
        };
        socket.addEventListener("open", function () {
            var heartbeat = setInterval(function () {
                socket.send("ping");
                logger("out", "ping");
            }, heartbeatInterval);
            socket.addEventListener("close", function (error) {
                clearInterval(heartbeat);
                if (error.code === 4003)
                    onConnectionTaken();
                reject(error);
            });
            apiSend("auth", {
                accessToken: token,
                refreshToken: refreshToken,
                reconnectToVoice: false,
                currentRoomId: null,
                muted: false,
                platform: "uhhh web sure"
            });
            socket.addEventListener("message", function (e) {
                if (e.data === "\"pong\"") {
                    logger("in", "pong");
                    return;
                }
                var message = JSON.parse(e.data);
                logger("in", message.op, message.d, message.fetchId, e.data);
                if (message.op === "auth-good") {
                    connection.user = message.d.user;
                    resolve(connection);
                }
                else {
                    listeners
                        .filter(function (_a) {
                        var opcode = _a.opcode;
                        return opcode === message.op;
                    })
                        .forEach(function (it) { return runListener(it, message.d, message.fetchId); });
                }
            });
        });
    });
};
exports.connect = connect;
