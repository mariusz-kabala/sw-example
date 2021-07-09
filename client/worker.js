const SharedWorker = () => {
  importScripts("https://cdn.socket.io/4.1.2/socket.io.min.js");
  importScripts("settings.js");

  const ports = [];
  const pusherConnection = io(self.socketIOUrl);
  let isConnected = false;
  
  onconnect = function (e) {
    const port = e.ports[0];

    ports.push(port);

    port.start();

    port.onmessage = function (event) {
      const model = event.data;

      switch (model.eventType) {
        case "on":
          const eventName = model.event;
          if (eventName == "connect") {
            if (socketConnected) {
              port.postMessage({
                type: eventName,
              });
            }
            break;
          }
          if (eventName == "disconnect") {
            break;
          }
          pusherConnection.on(eventName, function (msg) {
            port.postMessage({
              type: eventName,
              message: msg,
            });
          });
          break;

        case "emit":
          pusherConnection.emit(model.event, model.data); 
          break;
      }
    };
  };

  pusherConnection.on("error", (err) => {
    console.log('on error')
    ports.forEach(function (port) {
      port.postMessage({
        type: "error",
        message: err,
      });
    });
  });

  pusherConnection.on("connect", (msg) => {
    isConnected = true;
    console.log('on connect')
    ports.forEach(function (port) {
      port.postMessage({
        type: "connect",
        message: msg,
      });
    });
  });

  pusherConnection.on("disconnect", (msg) => {
    isConnected = true;
    console.log('on disconnect')
    ports.forEach(function (port) {
      port.postMessage({
        type: "disconnect",
        message: msg,
      });
    });
  });
};

SharedWorker();
