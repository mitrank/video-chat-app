import React, { useCallback, useState } from "react";

const LobbyScreen = () => {
  const [emailId, setEmailId] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log({ emailId, roomCode });
    },
    [emailId, roomCode]
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
