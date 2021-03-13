const WebSocket = require("ws");
const { v4: generateUuid } = require("uuid");

const heartbeatInterval = 8000;
const apiUrl = "wss://api.dogehouse.tv/socket";

const connect = (
  token, refreshToken,
  {
    logger = () => {},
    onConnectionTaken = () => console.error("Another client has taken the connection")
  }
) => new Promise((resolve, reject) => {
  const socket = new WebSocket(apiUrl);
  const apiSend = (opcode, data) => {
    socket.send(JSON.stringify({ op: opcode, d: data }));
    logger("out", opcode, data);
  };

  const listeners = [];
  const connection = {
    addListener: (opcode, handler) => listeners.push({ opcode, handler }),
    user: null,
    send: (opcode, data) => apiSend(opcode, data),
    fetch: (opcode, data, doneOpcode) =>
      new Promise((resolveFetch, rejectFetch) => {
        const fetchId = !doneOpcode && generateUuid();
        const listener = {
          opcode: doneOpcode ?? "fetch_done",
          handler: (data, arrivedId) => {
            if(!doneOpcode && arrivedId !== fetchId) return;
            listeners.splice(listeners.indexOf(listener), 1);
            resolveFetch(data);
          }
        };

        listeners.push(listener);
        apiSend(opcode, data);
      })
  }

  socket.addEventListener("open", () => {
    const heartbeat = setInterval(
      () => socket.send("ping"),
      heartbeatInterval
    );

    socket.addEventListener("close", (error) => {
      clearInterval(heartbeat);
      if(error.code === 4003) onConnectionTaken();
      reject(error);
    });

    apiSend(
      "auth",
      {
        accessToken: token,
        refreshToken: refreshToken,
        reconnectToVoice: false,
        currentRoomId: null,
        muted: false,
        platform: "uhhh web sure"
      }
    );

    socket.addEventListener("message", e => {
      if(e.data === `"pong"`) {
        logger("in", "pong");
        return;
      }

      const message = JSON.parse(e.data);
      logger("in", message.op, message.d);

      if(message.op === "auth-good") {
        connection.user = message.d.user;
        resolve(connection);
      } else {
        listeners
          .filter(({ opcode }) => opcode === message.op)
          .forEach(({ handler }) => handler(message.d, message.fetchId));
      }
    });
  });
});

module.exports = connect
