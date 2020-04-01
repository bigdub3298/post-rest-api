let io;

exports.initializeSocketIO = httpServer => {
  io = require("socket.io")(httpServer);
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw Error("Socket.io not initialized");
  }
  return io;
};
