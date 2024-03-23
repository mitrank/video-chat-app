import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";

const RoomScreen = () => {
  const [remoteSocketid, setRemoteSocketid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const socket = useSocket();

  const handleUserJoin = useCallback(({ emailId, id }) => {
    console.log(`Email ${emailId} has joined!`);
    setRemoteSocketid(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
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
      {remoteSocketid && <button onClick={handleCallUser}>Call</button>}
      {localStream && <>
        <h2>My Stream</h2>
        <ReactPlayer url={localStream} playing muted width={150} height={100} />
      </>}
    </>
  );
};

export default RoomScreen;
