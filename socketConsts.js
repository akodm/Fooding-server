module.exports = {
  onEvent: {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    LOGIN: "login",

    MESSAGE_SEND: "message send",

    PONG: "socket pong",
  },

  emitEvent: {
    MESSAGE_RECEIVE: "message receive"
  }
}