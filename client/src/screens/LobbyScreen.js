import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
  const [emailId, setEmailId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("room:join", (data) => handleRoomJoin(data));

    return () => {
      socket.off("room:join", (data) => handleRoomJoin(data));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleRoomJoin = useCallback(
    (data) => {
      const { roomCode } = data;
      navigate(`/room/${roomCode}`);
    },
    [navigate]
  );

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
          required
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label htmlFor="room">Room Code</label>
        <input
          type="text"
          id="room"
          required
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button>Join</button>
      </form>
    </>
  );
};

export default LobbyScreen;
