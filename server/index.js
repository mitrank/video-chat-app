import { Server } from "socket.io";

const io = new Server(8000, {
  cors: true,
});

const mapEmailIdToSocketId = new Map();
const mapSocketIdToEmailId = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);
  socket.on("room:join", (data) => {
    const { emailId, roomCode } = data;
    mapEmailIdToSocketId.set(emailId, socket.id);
    mapSocketIdToEmailId.set(socket.id, emailId);
    io.to(roomCode).emit("user:joined", { emailId, id: socket.id });
    socket.join(roomCode);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, answer }) => {
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });

  socket.on("peer:negotiation:needed", ({ to, offer }) => {
    io.to(to).emit("peer:negotiation:needed", { from: socket.id, offer });
  });

  socket.on("peer:negotiation:done", ({ to, answer }) => {
    io.to(to).emit("peer:negotiation:final", { from: socket.id, answer });
  });
});
