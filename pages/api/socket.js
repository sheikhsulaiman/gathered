import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`[Gathered] Socket connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, userId, userName }) => {
      socket.join(roomId);
      socket.data.userName = userName;
      socket.data.roomId = roomId;

      const existingUsers = [];
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        room.forEach((socketId) => {
          if (socketId !== socket.id) {
            const s = io.sockets.sockets.get(socketId);
            existingUsers.push({
              socketId,
              userName: s?.data?.userName || "Anonymous",
            });
          }
        });
      }

      socket.emit("existing-users", existingUsers);

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        userName,
      });

      console.log(`[Gathered] ${userName} joined room: ${roomId}`);
    });

    socket.on("signal", ({ to, from, signal }) => {
      io.to(to).emit("signal", { from, signal });
    });

    socket.on("chat-message", ({ roomId, message }) => {
      io.to(roomId).emit("chat-message", message);
    });

    socket.on("disconnect", () => {
      const { roomId } = socket.data;
      if (roomId) {
        socket.to(roomId).emit("user-left", { socketId: socket.id });
      }
      console.log(`[Gathered] Socket disconnected: ${socket.id}`);
    });
  });

  res.end();
}
