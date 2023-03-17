const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello, world!');
    res.end();
  });
const io = require('socket.io')(server, {cors: {
  origin: "https://www.youtube.com",
  methods: ["GET", "POST"]
}});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('audioData', (data) => {
    // handle incoming audio data here
    console.log("Receiving audio")
  });
});