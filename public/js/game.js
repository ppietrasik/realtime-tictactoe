//Written as if ES6 was unavailable
var socket = io();
var player;
var cbjs = new ClipboardJS('.btn');

// Set href link
$('#gamelink').val(window.location.href);

 //TODO aka fast-fix (sure not for prod :) )
 var pathname = window.location.pathname;
 var id = pathname.substring(pathname.lastIndexOf('/') + 1);

socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('join', {roomId:id}, function (err, player) {
      if(err){
        alert(err);
        return (window.location.href = '/');
      }
    });
});

socket.on('updateGameState', function (gameState) {
  //TODO add another event where client fetch info about player after on.('join')
  // Set client player
  if(socket.id === gameState.playerX.id){
    player =  gameState.playerX;
  } else {
    player =  gameState.playerO;
  }
  
  // Change turn text
  $('.turnmove').html('It\'s <strong>' + gameState.turnPlayer + '</strong> move');

  // Fill html game board
  var board = $('.square');

  for (i = 0; i < board.length; i++) { 
    $(board[i]).text(gameState.gameBoard[i]?gameState.gameBoard[i]:'');
    $(board[i]).removeClass('o-marker x-marker');
    if(gameState.gameBoard[i] === 'X'){
      $(board[i]).addClass('x-marker');
    } else if (gameState.gameBoard[i] === 'O'){
      $(board[i]).addClass('o-marker');
    }
  }

  // Set game score
  $('.gamescore').html(gameState.playerX.winScore + '-' + gameState.playerO.winScore);

  // Set turn player
  if(gameState.turnPlayer === player.playerChar){
    playerTakeTurn();
  }
});

function sendMove(tileId) {
  socket.emit('playerMove', {
        tileId: tileId,
        roomId: id
  }, function () {
  });
}
  
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});


function playerTakeTurn() {
  $('.square:empty').hover(function() {
    $(this).text(player.playerChar);
  }, function() {
    $(this).text('');
  });

  $('.square:empty').click(function() {
    var tileId = $(this).attr('id');
    sendMove(tileId);
    $('.square').off();
  });
}