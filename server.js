// Dependencies
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');
let serial = require('./util/serial')

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Write all socket messages to the Arduino
io.on('connection', function(socket) {
  socket.on('message', function(data) {
    serial.port.write(data, (err) => {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        // console.log(data);
    });
  })
});

serial.parser.on('data', data =>{
  console.log('Arduino: ', data);
});