const ws = new WebsocketWorker();

ws.start()
  .then(() => {
    ws.on("message", (msg) => {
        switch (msg.detail.type) {
            case 'connections':
                document.getElementById('connectedClients').innerHTML = msg.detail.value
            break

            case 'time':
                document.getElementById('serverTime').innerHTML = msg.detail.value
            break
        }
    });
  })
  .catch((e) => console.log("worker error", e));
