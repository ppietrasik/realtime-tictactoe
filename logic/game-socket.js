io.on('connection', (socket) => {
    console.log('New User connected.');

    socket.on('join', (gameId, callback) => {
        //Let player join if room is not already full
        socket.join(gameId.id);

        //Send gamestate to players
        io.to('test-room').emit('updateGameState', {state});

        callback();
    });

    socket.on('playerMove', (message, callback) => {
        //Get game
        //Check if move is valid
        //Send updated game state to players
        io.to('test-room').emit('updateGameState', {state});
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected form server.');
        //Update state to tell other player that oppenent has disconnected.
    });
});