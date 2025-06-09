"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function WsStatus() {
  const [msg, setMsg] = useState<string>("");
  const [wsStatus, setWsStatus] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pubMsg, setPubMsg] = useState<string>("");

  useEffect(() => {
    const newSocket = io("http://localhost", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setWsStatus("Connected");
      console.log("Connected to WebSocket server");

      // Static subscribe to the "test-message" channel
      newSocket.emit("subscribe", { channel: "test-message" });
    });

    newSocket.on("disconnect", () => {
      setWsStatus("Disconnected");
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("test-message", (data) => {
        console.log(data);
        setPubMsg(data.message);
      });
    }
  }, [socket]);

  const sendTestMsg = () => {
    if (socket && socket.connected) {
      // Static publish on "test-message"
      socket.emit("publish", {
        channel: "test-message",
        message: msg,
      });
    }
  };

  return (
    <div>
      <div>wsStatus: {wsStatus}</div>
      <br />
      <hr />
      <div>
        <input
          type="text"
          className="border-2 border-black"
          placeholder="Enter message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </div>
      <div>
        <button className="bg-amber-500 text-black" onClick={sendTestMsg}>
          Send
        </button>
      </div>

      <div className="text-4xl">
        {pubMsg && (
          <div>
            <div>Received message from server: {pubMsg}</div>
          </div>
        )}
      </div>
    </div>
  );
}
