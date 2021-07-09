class WebsocketWorker {
  WorkerType = window.SharedWorker || window.Worker;
  events = new EventTarget();
  worker = null;
  socket = null;

  start() {
    return this.startWorker().catch((e) => {
      console.log(e);
      this.startSocketIo();
    });
  }

  startWorker() {
    return fetch("worker.js", {
      mode: "no-cors",
    })
      .then((response) => response.blob())
      .then((script) => {
        const workerUri = URL.createObjectURL(script);

        this.worker = new this.WorkerType("worker.js", {
          name: "socketIOWorker",
        });
        const port = this.worker.port || this.worker;

        port.onmessage = (event) => {
          this.log(
            "<< worker received message:",
            event.data.type,
            event.data.message
          );
          this.events.dispatchEvent(
            new CustomEvent(event.data.type, { detail: JSON.parse(event.data.message) })
          );
        };

        port.onerror = (event) => {
          this.log("<< worker error:", error);
          this.events.dispatchEvent("error", event);
        };

        this.log(">> worker started");
      });
  }

  startSocketIo() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.onload = () => {
        this.socket = io("localhost:3000");

        resolve();
      };
      script.src = "https://cdn.socket.io/4.1.2/socket.io.min.js";
      document.head.appendChild(script);
    });
  }

  emit(event, data, cb) {
    this.log(">> emit:", event, data, cb);
    if (this.worker) {
      const port = this.worker.port || this.worker;
      port.postMessage({
        eventType: "emit",
        event: event,
        data: data,
      });
    } else {
      this.socket.emit(...arguments);
    }
  }

  on(event, cb) {
    if (this.worker) {
      this.log("worker add handler on event:", event);
      const port = this.worker.port || this.worker;
      port.postMessage({
        eventType: "on",
        event: event,
      });
      this.events.addEventListener(event, cb);
    } else {
      this.log("socket add handler on event:", event);
      this.socket.on(...arguments);
    }
  }
}

WebsocketWorker.prototype.log = console.log.bind(console);
