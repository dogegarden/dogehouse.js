/// <reference types="node" />
export declare function toHex(arr: Buffer | Uint8Array | Uint16Array | Uint32Array): string;
export declare function B2S_GET32(v: Uint32Array, i: number): number;
export declare function B2S_G(a: number, b: number, c: number, d: number, x: number, y: number): void;
export declare function ROTR32(x: number, y: number): number;
export declare const BLAKE2S_IV: Uint32Array;
export declare const SIGMA: Uint8Array;
export declare const ctx: {
    h: Uint32Array;
    b: Uint32Array;
    c: number;
    t: number;
};
export declare const alphabet = "8QMVCXSJKD0L7FGU24T539RN6WH1PBYZ";
export declare function random(buf: number | Buffer | Uint8Array): Buffer | Uint8Array;
export declare function randomNumber(): number;
export declare function randomString(length?: number): string;
export declare function randomHex(length?: number): string;
export declare function randomUUID(): string;
