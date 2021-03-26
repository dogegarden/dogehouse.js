"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = exports.randomString = exports.randomHex = exports.randomNumber = exports.random = void 0;
var random_1 = require("./random");
Object.defineProperty(exports, "random", { enumerable: true, get: function () { return random_1.random; } });
Object.defineProperty(exports, "randomNumber", { enumerable: true, get: function () { return random_1.randomNumber; } });
Object.defineProperty(exports, "randomHex", { enumerable: true, get: function () { return random_1.randomHex; } });
Object.defineProperty(exports, "randomString", { enumerable: true, get: function () { return random_1.randomString; } });
Object.defineProperty(exports, "randomUUID", { enumerable: true, get: function () { return random_1.randomUUID; } });
