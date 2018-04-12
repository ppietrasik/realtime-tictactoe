const {Game, Player} = require('./game');

const gameSocketsHandler = (gamesManager, io) => {
    io.on('connection', (socket) => {
        console.log('New User connected.');

        socket.on('join', (gameId, callback) => {
            let game = gamesManager.getGame(gameId.roomId);

            if(!game) return callback('Game not found');

            let player = game.getPlayer(socket.id);

            //If player does 
            if(game.isFull()) return callback('Game is full');
            
            //If player does not exist, create one
            if(!player) game.addPlayer(socket.id);

            //Join socket room
            socket.join(game.roomId);

            //Send gamestate to players
            io.to(game.roomId).emit('updateGameState', game.getGameState());
            callback();
        });

        socket.on('playerMove', (message, callback) => {
            //Get game
            const game = gamesManager.getGame(message.roomId);

            if(!game) return callback('Game not found');

            //Get player
            const player = game.getPlayer(socket.id);

            //If game or player does not exist
            if(!player) return callback('Invalid move');

            //Check if move is valid
            game.makeMove(player, message.tileId);

            //Send updated game state to players
            io.to(message.roomId).emit('updateGameState', game.getGameState());
            callback();
        });

        socket.on('disconnect', () => {
            console.log('User has disconnected form server.');
            //Update state to tell other player that oppenent has disconnected
            //Get game
            const game = gamesManager.getGameByPlayer(socket.id);
            if(!game) return console.log('Game not found Dissconect');

            //Get player
            const player = game.getPlayer(socket.id);

            //If game or player does not exist
            if(!game || !player) return console.log('Invalid Dissconect');

            game.removePlayer(player);

            io.to(game.roomId).emit('updateGameState', game.getGameState());
        });
    });
};

module.exports = {gameSocketsHandler};