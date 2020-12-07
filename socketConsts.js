module.exports = {
  onEvent: {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    LOGIN: "login",

    ROOM_IN: "room in",
    MESSAGE_SEND: "message send",

    PONG: "socket pong",
  },

  emitEvent: {
    MESSAGE_RECEIVE: "message receive",

    MESSAGE_READ: "message read",

    CHAT_UPDATE: "chat update"
  }
}