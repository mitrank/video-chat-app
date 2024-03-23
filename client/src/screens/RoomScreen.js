import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

const RoomScreen = () => {
  const [remoteSocketid, setRemoteSocketid] = useState(null);
  const socket = useSocket();

  const handleUserJoin = useCallback(({ emailId, id }) => {
    console.log(`Email ${emailId} has joined!`);
    setRemoteSocketid(id);
  }, []);

  useEffect(() => {
    socket.on("user:joined", (data) => handleUserJoin(data));

    return () => {
      socket.off("user:joined", (data) => handleUserJoin(data));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <>
      <h1>Room Screen</h1>
      <h4>{remoteSocketid ? "Connected!" : "No one in the room..."}</h4>
    </>
  );
};

export default RoomScreen;
