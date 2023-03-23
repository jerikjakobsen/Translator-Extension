const http = require('http');
const {Translator} = require("./audioTranslator")

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
let count = 0
io.on('connection', (socket) => {
  console.log('a user connected');
  const translator = new Translator()
  let firstConnect = true
  socket.on('audioData', (data) => {
    // handle incoming audio data here
    if (firstConnect) {
      firstConnect = false
      translator.startWritingStream()
    }
    translator.writeToStream(data)

  });
  socket.on('disconnect', function() {
    console.log('Disconnected!');
    translator.endStream()
 });
});