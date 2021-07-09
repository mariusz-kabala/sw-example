# POC structure

*server* - very simple server side socket implementation which sends current time, and number of clients every second to all connected to it clients

*client* - worker implementation 
    - settings.js - contains url to the socket.io server


# How to run

### server

* in the server folder run *npm i*
* do `node index.js` to start socket.io server

### client

* go to client folder and run `python3 -m http.server`; open `localhost:8000` in your browser
