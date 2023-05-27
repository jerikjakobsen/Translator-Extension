const http = require('http');
const TranslatorSocket = require("./TranslatorSocket.js")

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello, world!');
    res.end();
  });
const io = require('socket.io')(server, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

io.on('connection', (socket) => {
  const translatorSocket = new TranslatorSocket(socket);

});