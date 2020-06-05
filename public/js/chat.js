var socket = io.connect('https://alias-chat.herokuapp.com');

// Query DOM
var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      name = document.getElementById('hide-em-user').innerHTML,
      room = document.getElementById('hide-em-room').innerHTML;
      mywindow = document.getElementById("conf");

socket.emit('joinRoom', { name , room })

// Emit events
btn.addEventListener('click', function(){
  socket.emit('chat', {
      message: message.value,
  });
  message.value = "";
});

message.addEventListener('keyup', function(){
    socket.emit('typing');
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    console.log(data);
    output.innerHTML += '<p><strong style="color:' + data.color + '" >' + data.username + ': </strong>' + data.text + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('entry', function(data){
    output.innerHTML += '<div style="margin:auto; text-align:center">' + data + '</div>';
});

socket.on('exit', function(data){
    output.innerHTML += '<div style="margin:auto; text-align:center">' + data + '</div>';
});

// Video Handling
mywindow.addEventListener('click', function(){
  getMedia({ 
    video:{
      frameRate: 60.0,
      height:300,
     brightness: 2000.0
    } , 
    audio:{
    sampleSize: 8,
    echoCancellation: true} 
  });
  callUser(room);
})

async function getMedia(constraints) {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    const localVideo = document.getElementById("local-video");
    if (localVideo) {
       localVideo.srcObject = stream;

       stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
     }
   } catch(err) {
    console.log(err);
  }
}

const { RTCPeerConnection, RTCSessionDescription } = window;
peerConnection = new RTCPeerConnection();

async function callUser(roomn) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  
  socket.emit("call-user", {
    offer,
    id: roomn
  });
}

socket.on("call-made", async data => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  
  socket.emit("make-answer", {
    answer,
    to: data.socket
  });
 });

 socket.on("answer-made", async data => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
  
  if (!isAlreadyCalling) {
    callUser(data.socket);
    isAlreadyCalling = true;
  }
 });
    
 peerConnection.ontrack = function({ streams: [stream] }) {
  const remoteVideo = document.getElementById("remote-video");
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
 };

