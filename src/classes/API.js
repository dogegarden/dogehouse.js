const { default: ReconnectingWebSocket } = require("reconnecting-websocket");
const Client = require("../Client");
const { CONNECTION } = require("../util/constraints");

class API  {

    /**
     * @param {Client} client 
     */
    constructor(client) {
        
        /**
         * Client declaration
         * @private
         */
        this._client = client;

    }
    
    /**
     * Send an API request
     *  
     * This function will send an API request to the socket connection established by the client
     * connection function.
     * 
     * @param {string} opCode Socket OP Code
     * @param {Object} data Data sent to the socket connection.
     * @param {string} [fetchId] UUID (if any)
     * 
     * @function
     * @returns {Promise<any>}
     */
    send(opCode, data, fetchId) {
        return new Promise(async (resolve, reject) => {
            let dat = { op: opCode, d: data }
            if (fetchId) dat.fetchId = fetchId;

            try {
                await this._client.socket.send(JSON.stringify(dat));
                return resolve();
            } catch (err) {
                return reject(err);
            }
        })
    }

    /**
     * Authenticate Bot
     * 
     * This function will authenticate the bot account with the credentials provided in the 
     * client connection function.
     * 
     * @param {string} token Bot Authentication Token
     * @param {string} refreshToken Bot Refresh Token
     * 
     * @function
     * @returns {Promise<ReconnectingWebSocket>}
     */
    authenticate(token, refreshToken) {
        return new Promise(async (resolve, reject) => {
            this.send('auth', {
                accessToken: token,
                refreshToken: refreshToken,
                reconnectToVoice: CONNECTION.AUTH.RECONNECT_TO_VOICE,
                currentRoomId: CONNECTION.AUTH.CURRENT_ROOM_ID,
                muted: CONNECTION.AUTH.MUTED,
                platform: CONNECTION.AUTH.PLATFORM
            }).then(() => {
                return resolve(this._client.socket);
            }).catch(err => {
                return reject(err);
            })
        })
    }
}

module.exports = API;