const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

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
    io.emit("message", JSON.stringify({type: 'time', 'value': new Date().getTime()}));
    io.emit("message", JSON.stringify({type: 'connections', 'value': connectedSockets}));
}, 1000); 

server.listen(3000, () => {
  console.log("listening on *:3000");
});
