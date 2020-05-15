var express = require('express');
var socket = require('socket.io');

// app
var app = express();
var server = app.listen(process.env.TIMES || 4000, ()=>{
    console.log('App listening on 4000');
});

//Static Files
app.use(express.static('public'));

//Socket Setup
var io = socket(server);

io.on('connection', function(socket){

    // Handle typing event
    console.log('made socket connection');
    socket.on('chat', data => {
        io.sockets.emit('chat', data);
    });

     // Handle typing event
     socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});
