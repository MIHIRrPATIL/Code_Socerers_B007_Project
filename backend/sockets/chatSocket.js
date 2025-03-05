export const handleSocket = (socket, io) => {
    console.log(`⚡ New WebSocket connection: ${socket.id}`);
  
    socket.on("joinRoom", (room) => socket.join(room));
  
    socket.on("sendMessage", (messageData) => {
      io.to(messageData.room).emit("receiveMessage", messageData);
    });
  
    socket.on("disconnect", () => console.log(`❌ User disconnected: ${socket.id}`));
  };
  