import betterLogging from "better-logging";
import express from "express";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";


import auth from "./controllers/auth.controller.js";
import chat from "./controllers/game.controller.js";
import timer from "./controllers/timer.controller.js";

import model from "./model.js";

const port = 8989;
const app = express(); // Create express app.
const server = createServer(app);
const io = new Server(server); // Create socket.io app.



const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

// Enable debug output.
console.logLevel = 4;

// Enhance log messages with timestamps etc.
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  })
);

/*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});

// Configure session management.
app.use(sessionConf);
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
    saveUninitialized: true,
  })
);

app.use("/admin/", auth.checkAuth);
// Bind REST controllers to /api/*.
// /api calls går till auth.router

app.use("/api", auth.router);

// All chat endpoints require the user to be authenticated.
// Vid användning av chatten kontrolleras användarens autentikation
// sedan går den till chat router
app.use("/api", timer.router, chat.router);

// Initialize model.
// Kallar först /api/rooms och sedan /api/rooms/xxxxx
// Skapar ett rum som användaren kan gå in i
model.init(io);

// Sker när client connectar till server
// Handle socket.io connections.
io.on("connection", (socket) => {
  const { session } = socket.handshake;
  session.socketID = socket.id;
  session.save((err) => {
    if (err) console.error(err);
    else console.debug(`Saved socketID: ${session.socketID}`);
  });
});

const currentPath = dirname(fileURLToPath(import.meta.url));
const publicPath = join(currentPath, "..", "..", "client", "dist");

// Serve static files.
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
