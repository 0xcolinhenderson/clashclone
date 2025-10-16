const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

let clients = {};
let nextId = 1;
let freedIds = [];

server.on("connection", (ws) => {
  const clientId = generateUniqueId();
  clients[clientId] = { ws, username: null, id: clientId, state: "connected" };
  console.log(`Client ${clientId} connected`);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const requestId = data.requestId;

      if (data.type == "joinQueue") {
        clients[clientId].username = data.username;
        clients[clientId].id = data.id;
        clients[clientId].state = "searching";
        console.log(`Client ${clientId} joined queue as ${data.username}`);
      }

      if (data.type === "leaveQueue") {
        if (clients[clientId]) {
          clients[clientId].state = "connected";
          console.log(`Client ${clientId} left queue`);
        }
      }

      if (data.type === "getId") {
        const id = clients[clientId].id;
        clients[clientId].id = id;
        ws.send(
          JSON.stringify({
            type: "getIdResponse",
            requestId,
            id,
          })
        );
      }

      if (data.type === "verifyUser") {
        console.log("Verifying username: ", data.username);
        const { username } = data;
        const isTaken = Object.values(clients).some(
          (client) => client.username === username
        );
        const valid = !isTaken;

        console.log(`Username "${username}" valid: ${valid}`);

        ws.send(
          JSON.stringify({
            type: "verifyUserResponse",
            requestId,
            valid,
          })
        );
        return;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    if (clients[clientId]?.id) {
      freeId(clients[clientId].id);
    }
    delete clients[clientId];
    console.log(`Client ${clientId} disconnected`);
  });
});

setInterval(() => {
  console.log("\n[LOG] Connected players searching for game:");
  for (const clientId in clients) {
    const client = clients[clientId];
    if (client.state === "searching") {
      console.log(`- Username: ${client.username}, ID: ${client.id}`);
    }
  }
}, 2000);

function generateUniqueId() {
  if (freedIds.length > 0) {
    return freedIds.pop();
  }
  return nextId++;
}

function freeId(id) {
  freedIds.push(id);
}
