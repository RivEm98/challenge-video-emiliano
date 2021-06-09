const path = require('path');
const express = require('express');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//start the server
const server = app.listen(app.get('port'), function(){
  console.log('Server on port', app.get('port'));
});

//websockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection', function(socket){
  console.log('New connection', socket.id);

  socket.on('stateVideo', function(data){
    socket.broadcast.emit('stateVideo',data);
  })
  socket.on('stateVolume', function(data){
    socket.broadcast.emit('stateVolume',data);
  })
  socket.on('timeVideo', function(data){
    socket.broadcast.emit('timeVideo',data);
  })
});

