class Player {
    constructor (playerId, playerChar){
        this.id = playerId;
        this.winScore = 0;
        this.playerChar = playerChar;
    }

    // Increase win score by one
    increaseWinScore() {
        this.winScore += 1;
    }

    isSet(){
        //(should work with js falsy/truthy)
        return typeof this.id === 'string';
    }
}

class GamesManager {
    constructor (){
        this.games = [];
    }

    addGame(game) {
        if(this.getGame(game.roomId)) return 'Game already exists';

        this.games.push(game);
        return game;
    }

    getGame(roomId) {
        return this.games.filter((game) => game.roomId === roomId)[0];
    }

    getGameByPlayer(playerId) {
        this.games.forEach((game) => {
            const playersArray = [game.playerX, game.playerO];
            playersArray.forEach((player) => {
                if(player.id === playerId) return game;
            });
        });
        return null;
    }

    removeGame(roomId) {
        const game = this.getGame(roomId);

        if (game) {
          this.games = this.games.filter((game) => game.roomId !== roomId);
        }
    
        return user;
    }
}

const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];

class Game {
    constructor (roomId){
        this.roomId = roomId;
        this.gameBoard = [];
        this.playerX = new Player(undefined, 'X');
        this.playerO = new Player(undefined, 'O');
        this.turnPlayer = this.playerX;
        this.createdAt = new Date().getTime();
    }

    // Adds player to game
    addPlayer(playerId) {
        if(!this.playerX.isSet()) this.playerX.id = playerId;
        else if (!this.playerO.isSet()) this.playerO.id = playerId;

        return this.getPlayer(playerId);
    }

    getPlayer(playerId){
        if(this.playerX.id === playerId) return this.playerX;
        else if (this.playerO.id === playerId) return this.playerO;
    }

    removePlayer(playerId) {
        let playerToRemove = this.getPlayer(playerId);
        playerToRemove.id = false;
    }

    makeMove(player, tileId){
        // Make sure only proper player can make move
        if(this.turnPlayer !== player) return console.log('It is other player turn');

        //Check if move is valid
        if(this.gameBoard[tileId] != undefined || (tileId < 0 || tileId > 8)) return console.log('Bad move');

        //Make move
        this.gameBoard[tileId] = player.playerChar;

        //Switch player turn
        this.turnPlayer = this.turnPlayer === this.playerX ? this.playerO : this.playerX;

        //At least 5 turns have to pass to even consider that someone has won
        if(this.boardPlays() >= 5) return this.checkBoardWin();
    }

    checkBoardWin(){
        let winner = null;

        //Can be improved
        winConditions.forEach((winCondition) => {
            winner = this.gameBoard[winCondition[0]];
        
            //If winner is set, and board[winCo[1]] and [2] are the same as winner
            if(winner && this.gameBoard[winCondition[1]] === winner && 
                this.gameBoard[winCondition[2]] === winner){
                // Increase winner's score
                winner = this.getPlayerByChar(winner);
                winner.increaseWinScore();
                // Reset GameBoard for next round
                this.resetBoard();
            }
        });

        // Tie
        if(this.boardPlays() >= 9){
            this.resetBoard();
            return winner;
        }

        return winner;
    }

    getGameState() {
        //TODO lodash
        return {
            gameBoard: this.gameBoard,
            turnPlayer: this.turnPlayer.playerChar,
            playerX: this.playerX,
            playerO: this.playerO
        };
    }

    // Return number of valid moves in game board (basiclly arr.length without undefined)
    boardPlays(){
        return this.gameBoard.filter((value) =>{ return value != null; }).length;
    }

    // Resets Game Board
    resetBoard() {
        this.gameBoard = [];
    }

    // Returns player by its char
    getPlayerByChar(playerChar){
        if(playerChar === this.playerX.playerChar) return this.playerX;
        else if(playerChar === this.playerO.playerChar) return this.playerO;
    }

    // Check if game is already full
    isFull(){
        return (this.playerX.isSet() && this.playerO.isSet());
    }
}


module.exports = {GamesManager, Game, Player};