var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      name = document.getElementById('hide-em-user').innerHTML,
      room = document.getElementById('hide-em-room').innerHTML;

socket.emit('joinRoom', { name , room })

// Emit events
btn.addEventListener('click', function(){
  socket.emit('chat', {
      message: message.value,
  });
  message.value = "";
});

message.addEventListener('keypress', function(){
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

// Local Video


    const controls = document.querySelector('.controls');
    const cameraOptions = document.querySelector('.video-options>select');
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const screenshotImage = document.querySelector('img');
    const buttons = [...controls.querySelectorAll('button')];
    let streamStarted = false;
    
    const [play, pause, screenshot] = buttons;
    
    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440
        },
      }
    };
    
    const getCameraSelection = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
      });
      cameraOptions.innerHTML = options.join('');
    };
    
    play.onclick = () => {
      if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
      }
      if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions.value
          }
        };
        startStream(updatedConstraints);
      }
    };
    
    const startStream = async (constraints) => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleStream(stream);
    };
    
    const handleStream = (stream) => {
      video.srcObject = stream;
      play.classList.add('d-none');
      pause.classList.remove('d-none');
      screenshot.classList.remove('d-none');
      streamStarted = true;
    };
    
    getCameraSelection();
    
    
