import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const RoomScreen = () => {
  const [remoteSocketid, setRemoteSocketid] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
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
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketid, offer });
    setLocalStream(stream);
  }, [remoteSocketid, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketid(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      console.log("Incoming call: ", from, offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  const sendLocalStreamToRemote = useCallback(() => {
    localStream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, localStream);
    });
  }, [localStream]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      await peer.setLocalDescription(answer);
      console.log("Call Accepted!");
      sendLocalStreamToRemote();
    },
    [sendLocalStreamToRemote]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiation:needed", { to: remoteSocketid, offer });
  }, [remoteSocketid, socket]);

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:negotiation:done", { to: from, answer });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      const remoteStream = e.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:negotiation:needed", handleNegotiationIncoming);
    socket.on("peer:negotiation:final", handleNegotiationFinal);

    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:negotiation:needed", handleNegotiationIncoming);
      socket.off("peer:negotiation:final", handleNegotiationFinal);
    };
  }, [
    handleCallAccepted,
    handleIncomingCall,
    handleNegotiationFinal,
    handleNegotiationIncoming,
    handleUserJoin,
    socket,
  ]);

  return (
    <>
      <h1>Room Screen</h1>
      <h4>{remoteSocketid ? "Connected!" : "No one in the room..."}</h4>
      {remoteSocketid && <button onClick={handleCallUser}>Call</button>}
      {localStream && (
        <button onClick={sendLocalStreamToRemote}>Send Stream</button>
      )}
      {localStream && (
        <>
          <h2>Local Stream {socket}</h2>
          <ReactPlayer
            url={localStream}
            playing
            muted
            width={150}
            height={100}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h2>Remote Stream</h2>
          <ReactPlayer
            url={remoteStream}
            playing
            muted
            width={150}
            height={100}
          />
        </>
      )}
    </>
  );
};

export default RoomScreen;
