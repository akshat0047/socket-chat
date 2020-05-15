var express = require('express');
var socket = require('socket.io');

// app
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

var port = process.env.PORT

var server = app.listen(port || 4000, ()=>{
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
