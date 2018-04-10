//Written as if ES6 was unavailable

var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    //TODO aka fast-fix (sure not for prod :) )
    var pathname = window.location.pathname;
    var id = pathname.substring(pathname.lastIndexOf('/') + 1);
    console.log(id);
    
    socket.emit('join', {id:id}, function (err) {
      if(err){
        alert(err);
        return (window.location.href = '/');
      }

      
    });
  });
  
  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });