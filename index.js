const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let clients = [];
io.on("connection", (socket) => {
  socket.join(socket.id);
  console.log("socket connected");
  socket.emit("connectedUsers", clients);
  socket.on("connecti", (data) => {
    socket.join(data);
    clients = [...clients, data];
    console.log(clients);
    io.sockets.emit("connectedUsers", clients);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("disconnect", (name) => {});

  socket.on("removal", (name) => {
    console.log(name);
    clients = clients.filter((e) => e !== name);

    io.sockets.emit("connectedUsers", clients);
  });
});

http.listen(5000, () => {
  console.log("Server runing");
});
