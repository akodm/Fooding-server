const { onEvent, emitEvent } = require("./socketConsts");

module.exports = (io) => {
  io.sockets.on(onEvent.CONNECTION, (socket) => {
    // on events
    console.log(socket.handshake.query.token);

    socket.on(onEvent.LOGIN, (data) => {
      console.log("user connect !", data);
    });






    // emit events
    socket.emit(emitEvent.PING, { text: "ping" });
  }); 
}