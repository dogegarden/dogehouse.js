"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    var _b = _a.logger, logger = _b === void 0 ? function () { } : _b, _c = _a.onConnectionTaken, onConnectionTaken = _c === void 0 ? function () { } : _c;
    return new Promise(function (resolve, reject) {
        var socket = new reconnecting_websocket_1.default(apiUrl, [], { connectionTimeout: connectionTimeout, WebSocket: isomorphic_ws_1.default });
        var apiSend = function (opcode, data, fetchId) {
            var raw = "{\"op\":\"" + opcode + "\",\"d\":" + JSON.stringify(data) + (fetchId ? ",\"fetchId\":\"" + fetchId + "\"" : "") + "}";
            socket.send(raw);
            logger("out", opcode, data, fetchId, raw);
        };
        var listeners = [];
        var runListener = function (listener, data, fetchId) { return __awaiter(void 0, void 0, void 0, function () {
            var result, remove, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = listener.handler(data, fetchId);
                        if (!(result instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, result];
                    case 1:
                        _a = !!(_b.sent());
                        return [3 /*break*/, 3];
                    case 2:
                        _a = !!result;
                        _b.label = 3;
                    case 3:
                        remove = _a;
                        if (remove)
                            listeners.splice(listeners.indexOf(listener), 1);
                        return [2 /*return*/];
                }
            });
        }); };
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
                    var connection = {
                        addListener: function (opcode, handler) { return listeners.push({ opcode: opcode, handler: handler }); },
                        user: message.d.user,
                        send: apiSend,
                        fetch: function (opcode, data, doneOpcode) { return new Promise(function (resolveFetch) {
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
