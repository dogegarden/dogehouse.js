export declare type Token = string;
export declare type FetchID = string;
export declare type Opcode = string;
export declare type Logger = (direction: "in" | "out", opcode: Opcode, data?: object, fetchId?: FetchID, raw?: string) => void;
export declare type ListenerHandler = (data: object, fetchId?: FetchID) => boolean | undefined;
export declare type Listener = {
    opcode: Opcode;
    handler: ListenerHandler;
};
export declare type Connection = {
    addListener: (opcode: Opcode, handler: ListenerHandler) => void;
    user: unknown;
    send: (opcode: Opcode, data: object, fetchId?: FetchID) => void;
    fetch: (opcode: Opcode, data: object, doneOpcode: Opcode) => Promise<object>;
};
export declare const connect: (token: Token, refreshToken: Token, { logger, onConnectionTaken }: {
    logger?: Logger | undefined;
    onConnectionTaken?: (() => void) | undefined;
}) => Promise<Connection>;
