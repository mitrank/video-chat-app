import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [emailId, setEmailId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const socket = useSocket();

  useEffect(() => {
    socket.on("room:join", data => {
      console.log("Data from backend: ", data)
    });
  }, [socket]);

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { emailId, roomCode });
    },
    [emailId, roomCode, socket]
  );

  return (
    <>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email-ID</label>
        <input
          type="email"
          id="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label htmlFor="room">Room Code</label>
        <input
          type="text"
          id="room"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button>Join</button>
      </form>
    </>
  );
};

export default LobbyScreen;
