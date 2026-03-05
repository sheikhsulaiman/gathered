import { useEffect, useRef, useState, useCallback } from "react";

export default function useWebRTC({ roomId, userName, socket }) {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef({});

  const createPeer = useCallback(
    async (targetSocketId, initiator, stream) => {
      const SimplePeer = (await import("simple-peer")).default;

      const peer = new SimplePeer({
        initiator,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      peer.on("signal", (signal) => {
        socket.emit("signal", {
          to: targetSocketId,
          from: socket.id,
          signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        setPeers((prev) => ({
          ...prev,
          [targetSocketId]: {
            ...prev[targetSocketId],
            stream: remoteStream,
          },
        }));
      });

      peer.on("error", (err) => {
        console.error("[Gathered] Peer error:", err);
      });

      peer.on("close", () => {
        setPeers((prev) => {
          const updated = { ...prev };
          delete updated[targetSocketId];
          return updated;
        });
        delete peersRef.current[targetSocketId];
      });

      return peer;
    },
    [socket],
  );

  useEffect(() => {
    if (!socket || !roomId) return;

    const init = async () => {
      try {
        // Guard: mediaDevices only available in secure contexts
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error(
            "[Gathered] getUserMedia not available. Use HTTPS or localhost.",
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join-room", { roomId, userId: socket.id, userName });
      } catch (err) {
        console.error("[Gathered] Failed to get user media:", err);
      }
    };

    init();

    socket.on("existing-users", async (users) => {
      for (const { socketId, userName: existingUserName } of users) {
        const peer = await createPeer(socketId, true, localStreamRef.current);
        peersRef.current[socketId] = peer;
        setPeers((prev) => ({
          ...prev,
          [socketId]: { peer, stream: null, userName: existingUserName },
        }));
      }
    });

    socket.on("user-joined", async ({ socketId, userName: newUserName }) => {
      const peer = await createPeer(socketId, false, localStreamRef.current);
      peersRef.current[socketId] = peer;
      setPeers((prev) => ({
        ...prev,
        [socketId]: { peer, stream: null, userName: newUserName },
      }));
    });

    socket.on("signal", ({ from, signal }) => {
      const peer = peersRef.current[from];
      if (peer) {
        peer.signal(signal);
      }
    });

    socket.on("user-left", ({ socketId }) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].destroy();
        delete peersRef.current[socketId];
      }
      setPeers((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      socket.off("existing-users");
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      Object.values(peersRef.current).forEach((peer) => {
        try {
          peer.destroy();
        } catch (_) {}
      });
      peersRef.current = {};
    };
  }, [socket, roomId, userName, createPeer]);

  // Sync localVideoRef when stream is set
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setAudioMuted((prev) => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setVideoMuted((prev) => !prev);
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];
      const originalTrack = localStreamRef.current?.getVideoTracks()[0];

      Object.values(peersRef.current).forEach((peer) => {
        if (originalTrack) {
          peer.replaceTrack(originalTrack, screenTrack, localStreamRef.current);
        }
      });

      if (localVideoRef.current) {
        const displayStream = new MediaStream([
          screenTrack,
          ...localStreamRef.current.getAudioTracks(),
        ]);
        localVideoRef.current.srcObject = displayStream;
      }

      setScreenSharing(true);

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("[Gathered] Screen share error:", err);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (!screenStreamRef.current) return;

    const screenTrack = screenStreamRef.current.getVideoTracks()[0];
    const originalTrack = localStreamRef.current?.getVideoTracks()[0];

    Object.values(peersRef.current).forEach((peer) => {
      if (screenTrack && originalTrack) {
        peer.replaceTrack(screenTrack, originalTrack, localStreamRef.current);
      }
    });

    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;

    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setScreenSharing(false);
  }, []);

  return {
    localStream,
    localVideoRef,
    peers,
    audioMuted,
    videoMuted,
    screenSharing,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  };
}
