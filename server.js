const app = require("./app");
const debug = require("debug")("node-vue");
const http = require("http");
const WebSocket = require("ws");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

// trza zmienić port 3000, koliduje z praco
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

const server = http.createServer(app);

const websocketServer = new WebSocket.Server({ server });

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

websocketServer.on('connection', (socket) => {
  // Log a message when a new client connects
  console.log('client connected.');
  // Listen for incoming WebSocket createApiEntry
  socket.on('message', (data) => {
    // Broadcast the message to all connected clients
     websocketServer.clients.forEach(function each(client) {
       if (client !== socket && client.readyState === WebSocket.OPEN) {
         client.send(data.toString());
       }
     });
   });
   // Listen for WebSocket connection close events
   socket.on('close', () => {
     // Log a message when a client disconnects
     console.log('Client disconnected');
   });
})