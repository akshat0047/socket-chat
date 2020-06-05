const express = require('express'),
     socket = require('socket.io'),
     path = require('path'),
     route = require('./routes/home'),
     bodyParser = require('body-parser'),
     formatMessage = require('./utils/process'),
     { userJoin, getCurrentUser } = require('./utils/users');


var app = express();

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', route);

var server = app.listen(app.get('port'), ()=>{
    console.log('App listening on 4000');
});


//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
    console.log("connection made");
    socket.on('joinRoom', data => {
       const user = userJoin(socket.id, data.name, data.room);
       socket.join(user.room);

    // Broadcast joining to everyone
    socket.broadcast.to(user.room).emit('entry', `${user.username} has joined the chat`);

    // Handle typing event
    socket.on('chat', data => {
        io.sockets.to(user.room).emit('chat', formatMessage(user.username, data.message, user.color));
    });

     // Handle typing event
     socket.on('typing', () => {
        socket.broadcast.to(user.room).emit('typing', user.username);
    });

    // Broadcast leaving to everyone
    socket.on('disconnect', () => {
        io.to(user.room).emit('exit', `${user.username} has left the chat`);
    });
});   
});
