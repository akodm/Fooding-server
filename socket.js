const { onEvent, emitEvent } = require("./socketConsts");

module.exports = (io) => {
  try {
    io.sockets.on(onEvent.CONNECTION, (socket) => {
      // client to server pong test
      socket.on(onEvent.PONG, (data) => {
        console.log("server socket pong event:", data);
      });
  
      // user login & connection
      socket.on(onEvent.LOGIN, (id) => {
        console.log("user login & join socket room:", (id).toString());
        console.log("user login token:", socket.handshake.query.token);
        const stringId = (id).toString();
        socket.join(stringId);
      });
  
      // message send & message emit to target room user
      socket.on(onEvent.MESSAGE_SEND, (data) => {
        console.log("msg on:", data.target, data.message);
        const stringId = (data.target).toString();
        io.sockets.to(stringId).emit(emitEvent.MESSAGE_RECEIVE, data.message);
        io.sockets.to(stringId).emit(emitEvent.CHAT_UPDATE, data.message);
      });

      socket.on(onEvent.ROOM_IN, (data) => {
        console.log("user chat room in:", data);
        const stringId = (data.user.id).toString();
        io.sockets.to(stringId).emit(emitEvent.MESSAGE_READ, { roomId: data.roomId, read: true });
      });
  
      // disconnect user
      socket.on(onEvent.DISCONNECT, (data) => {
        console.log("user disconnect & token:", socket.handshake.query.token);
        console.log(data);
      });
    }); 
  } catch(err) {
    console.log("socket error :", err);
  }
}