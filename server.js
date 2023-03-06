var fs = require('fs');
var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {
  var stream = fs.createReadStream('index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  stream.pipe(res);
});
var io = require('socket.io')(server);
server.listen(30000);

io.sockets.on('connection', function(socket){
  console.log("We have a new client: " + socket.id);

  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });

  socket.on('hello', function(width, height){
    console.log("width : " + width + " height : " + height);
    socket.broadcast.emit('hello', width, height);
  });

  socket.on('drawing', function(mouseX, mouseY, radius){
    console.log("Received drawing: " + mouseX + ' - ' + mouseY + ' - ' + radius );
    socket.broadcast.emit('drawing', mouseX, mouseY, radius);
  });

  socket.on('buttonPressed', function() {
    console.log("Button Pressed");
    socket.broadcast.emit('buttonPressed');
  });



  socket.emit('greeting', { message: 'hello, '}, function(data) {
    console.log('result: ' + data);
  });
});