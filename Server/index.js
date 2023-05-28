const http = require('http');
const express = require('express');
const app = express();
const TranslatorSocket = require("./TranslatorSocket.js");
const languages = require("./languages.json");
app.get('/availableLanguages', (req, res) => {
  const namesToCodes = Object.entries(languages.translation).map(([key, val]) => {
    var nameToCode = {};
    nameToCode[val.name] = key;
    return nameToCode;
  });
  res.status(200).json(namesToCodes);
})

app.get("/", (req, res) => {
  res.send("Translator Extension Server");
})

const server = http.Server(app);
server.listen(3000);

const io = require('socket.io')(server, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});

const connectedClients = {};
io.on('connection', (socket) => {
  connectedClients[socket.id] = socket
  console.log("CONNECTION!", Object.values(connectedClients).length)
  const translatorSocket = new TranslatorSocket(socket);
  socket.on('disconnect', () => {
    // Remove the disconnected socket from the object
    delete connectedClients[socket.id];
    console.log(socket.id, Object.values(connectedClients).length)
  });
});