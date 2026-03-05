import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initSocket = async () => {
      await fetch("/api/socket");
      const socket = io({ path: "/api/socket", addTrailingSlash: false });

      socket.on("connect", () => {
        console.log("[Gathered] Socket connected:", socket.id);
        setIsReady(true);
      });

      socket.on("disconnect", () => {
        console.log("[Gathered] Socket disconnected");
        setIsReady(false);
      });

      socketRef.current = socket;
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return { socket: socketRef.current, isReady };
}
