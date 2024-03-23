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
    io.to(socket.id).emit("room:join", data);
  });
});
