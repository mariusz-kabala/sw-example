const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server);

let connectedSockets = 0;

io.on('connection', (socket) => {
    connectedSockets++;
    console.log("Socket connected! Conected sockets:", connectedSockets);

    socket.on('disconnect', function () {
        connectedSockets--;
        console.log("Socket disconnect! Conected sockets:", connectedSockets);
    });
});

setInterval(function() {
    io.emit("message", "Hola " + new Date().getTime());
}, 1000); 

server.listen(3000, () => {
  console.log("listening on *:3000");
});
