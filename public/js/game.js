//Written as if ES6 was unavailable

var socket = io();

 //TODO aka fast-fix (sure not for prod :) )
 var pathname = window.location.pathname;
 var id = pathname.substring(pathname.lastIndexOf('/') + 1);

socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('join', {roomId:id}, function (err) {
      if(err){
        alert(err);
        return (window.location.href = '/');
      }

    });
});

jQuery('#make-move').on('submit', function (e) {
    e.preventDefault();
  
    var tileId = jQuery('[name=tileId]');
  
    socket.emit('playerMove', {
        tileId: tileId.val(),
        roomId: id
    }, function () {
      tileId.val('');
    });
  });
  
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});