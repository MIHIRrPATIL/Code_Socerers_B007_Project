import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:5000"; // Backend WebSocket server URL

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server.");
    });
  }
  return socket;
};

// ✅ Join a room
export const joinRoom = (roomName: string) => {
  if (socket) {
    socket.emit("joinRoom", roomName);
    console.log(`Joined room: ${roomName}`);
  } else {
    console.error("Socket not initialized.");
  }
};

// ✅ Send a message
export const sendMessage = (message: string) => {
  if (socket) {
    socket.emit("message", message);
    console.log(`Sent message: ${message}`);
  } else {
    console.error("Socket not initialized.");
  }
};

// ✅ Receive messages (fixing your issue)
export const receiveMessage = (callback: (message: string) => void) => {
  if (socket) {
    socket.on("message", callback);
  } else {
    console.error("Socket not initialized.");
  }
};

// Get current socket instance
export const getSocket = () => socket;
