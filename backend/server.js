const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const draw = require('./draw');

function RoomService() {
  this.roomIds = [];
  this.rooms = [];

  for(let i=1; i<20; i++) {

  }
}

RoomService.prototype.

//app.use(cors());

const io = require('socket.io')(http);


http.listen(9999, (err) => {
  if(err) { throw err }
  console.log('listening on *:'+9999);
});
draw.init(io);
