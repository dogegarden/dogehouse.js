"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = exports.randomHex = exports.randomString = exports.randomNumber = exports.random = exports.alphabet = exports.ctx = exports.SIGMA = exports.BLAKE2S_IV = exports.ROTR32 = exports.B2S_G = exports.B2S_GET32 = exports.toHex = void 0;
function toHex(arr) {
    const n = (arr instanceof Uint32Array ? 0x100000000 : (arr instanceof Uint16Array ? 0x10000 : 0x100));
    return Array.prototype.map.call(arr, (v) => (+n + +v).toString(16).substr(1)).join('');
}
exports.toHex = toHex;
function B2S_GET32(v, i) {
    return v[i] ^ (v[i + 1] << 8) ^ (v[i + 2] << 16) ^ (v[i + 3] << 24);
}
exports.B2S_GET32 = B2S_GET32;
function B2S_G(a, b, c, d, x, y) {
    v[a] = v[a] + v[b] + x;
    v[d] = ROTR32(v[d] ^ v[a], 16);
    v[c] = v[c] + v[d];
    v[b] = ROTR32(v[b] ^ v[c], 12);
    v[a] = v[a] + v[b] + y;
    v[d] = ROTR32(v[d] ^ v[a], 8);
    v[c] = v[c] + v[d];
    v[b] = ROTR32(v[b] ^ v[c], 7);
}
exports.B2S_G = B2S_G;
function ROTR32(x, y) {
    return (x >>> y) ^ (x << (32 - y));
}
exports.ROTR32 = ROTR32;
exports.BLAKE2S_IV = new Uint32Array([
    0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
    0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
]);
exports.SIGMA = new Uint8Array([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
    11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
    7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
    9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
    2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
    12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
    13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
    6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
    10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0
]);
exports.ctx = {
    h: new Uint32Array(exports.BLAKE2S_IV),
    b: new Uint32Array(64),
    c: 0,
    t: 0,
};
exports.ctx.h[0] ^= 0x01010000 ^ (32 << 8) ^ 32;
const v = new Uint32Array(16);
const m = new Uint32Array(16);
function blake2sCompress() {
    var i = 0;
    for (i = 0; i < 8; i++) {
        v[i] = exports.ctx.h[i];
        v[i + 8] = exports.BLAKE2S_IV[i];
    }
    v[12] ^= exports.ctx.t;
    v[13] ^= (exports.ctx.t / 0x100000000);
    for (i = 0; i < 16; i++) {
        ;
        m[i] = B2S_GET32(exports.ctx.b, 4 * i);
    }
    for (i = 0; i < 10; i++) {
        B2S_G(0, 4, 8, 12, m[exports.SIGMA[i * 16 + 0]], m[exports.SIGMA[i * 16 + 1]]);
        B2S_G(1, 5, 9, 13, m[exports.SIGMA[i * 16 + 2]], m[exports.SIGMA[i * 16 + 3]]);
        B2S_G(2, 6, 10, 14, m[exports.SIGMA[i * 16 + 4]], m[exports.SIGMA[i * 16 + 5]]);
        B2S_G(3, 7, 11, 15, m[exports.SIGMA[i * 16 + 6]], m[exports.SIGMA[i * 16 + 7]]);
        B2S_G(0, 5, 10, 15, m[exports.SIGMA[i * 16 + 8]], m[exports.SIGMA[i * 16 + 9]]);
        B2S_G(1, 6, 11, 12, m[exports.SIGMA[i * 16 + 10]], m[exports.SIGMA[i * 16 + 11]]);
        B2S_G(2, 7, 8, 13, m[exports.SIGMA[i * 16 + 12]], m[exports.SIGMA[i * 16 + 13]]);
        B2S_G(3, 4, 9, 14, m[exports.SIGMA[i * 16 + 14]], m[exports.SIGMA[i * 16 + 15]]);
    }
    for (i = 0; i < 8; i++) {
        exports.ctx.h[i] ^= v[i] ^ v[i + 8];
    }
}
function blake2sUpdate(input) {
    for (var i = 0; i < input.length; i++) {
        if (exports.ctx.c === 64) {
            exports.ctx.t += exports.ctx.c;
            blake2sCompress();
            exports.ctx.c = 0;
        }
        exports.ctx.b[exports.ctx.c++] = input[i];
    }
}
const seed = Buffer.from(JSON.stringify(process.env) + Object.values(process).map(a => typeof a === 'string' ? a : typeof a));
exports.alphabet = '8QMVCXSJKD0L7FGU24T539RN6WH1PBYZ';
const secrets = [];
for (let i = 0; i < seed.length; i += 32) {
    for (let j = i, k = i + 32, l = 0; j < k; ++j, ++l) {
        exports.ctx.b[l] ^= seed[j];
    }
    blake2sCompress();
    secrets.push(exports.ctx.h[4], exports.ctx.h[13], exports.ctx.h[16], exports.ctx.h[28]);
}
function random(buf) {
    blake2sUpdate(Buffer.allocUnsafeSlow(1024));
    if (!(buf instanceof Uint8Array)) {
        buf = Buffer.allocUnsafe(buf || 32);
    }
    for (let i = 0; i < buf.length; ++i) {
        blake2sUpdate([buf[i], secrets[i % secrets.length] >> 16, secrets[i % secrets.length] >> 8, secrets[i]]);
        buf[i] = exports.ctx.h[i & 7] >> ((i & 127) >> 3);
    }
    return buf;
}
exports.random = random;
function randomNumber() {
    let b = random(4);
    return (b[0] << 23) | (b[1] << 15) | (b[2] << 7) | (b[3] >> 1);
}
exports.randomNumber = randomNumber;
function randomString(length = 32) {
    const ar = random(length);
    let ret = '';
    for (let i = 0; i < length; ++i) {
        ret += exports.alphabet[ar[i] & 31];
    }
    return ret;
}
exports.randomString = randomString;
function randomHex(length = 32) {
    return toHex(random(length >> 1));
}
exports.randomHex = randomHex;
function randomUUID() {
    return `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
}
exports.randomUUID = randomUUID;
