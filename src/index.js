const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const filter = require("bad-words");

const app = express();
const server = http.createServer(app);
//need to pass the express server instance
//doing this server can now support websocket
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

//let count = 0;

//server (emit) --> client (receive) --> countUpdated
//client (emit) --> server (receive) --> countincrement

//socket is an obeject which contains information about the connection
io.on("connection", (socket) => {
  console.log("New Websocket connection");

  //server emits a message to the client
  socket.emit("message", "Welcome!");
  //sends/broadcast message to everyone else except the current socket
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (msgfromClient, callback) => {
    const filterWords = new filter();

    if (filterWords.isProfane(msgfromClient))
      return callback("Profanity is not allowed");

    io.emit("message", msgfromClient.toString());
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has let");
  });

  //#region test
  // socket.emit("countUpdated", count);

  // socket.on("countincrement", () => {
  //   count++;
  //   // socket.emit("countUpdated", count); //emait event to the specific socket or client
  //   io.emit("countUpdated", count); // this one emits the event to all the available connections
  // });

  //#endregion
});

server.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
