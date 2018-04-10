class Player {
    constructor (playerId){
        this.id = playerId;
        this.winScore = 0;
    }

    // Increase win score by one
    increaseWinScore() {
        this.winScore += 1;
    }
}

const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]];

class Game {
    constructor (roomId){
        this.roomId = roomId;
        this.gameBoard = [];
        this.players = [];
        this.turnPlayer = players[0]; // true-false is as bad idea as this (maybe little more convenient)
        this.createdAt = new Date().getTime();
    }

    // Adds player to game
    addPlayer(player) {
        if(this.isFull()) return 'Match is full';

        this.players.push(player);
    }

    getPlayer(playerId){
        return this.players.filter((player) => player.id === playerId)[0];
    }

    removePlayer(playerId) {
        const player = this.getPlayer(playerId);

        if (player) {
          this.players = this.players.filter((player) => player.id !== playerId);
        }
    
        return player;
    }

    makeMove(playerId, tileId){
        const player = this.getPlayer(playerId);

        // Make sure only proper player can make move
        if(this.turnPlayer !== player) return 'It is other player turn';

        //Check if move is valid
        if(this.gameBoard[tileId]) return 'Bad move';

        //Make move
        this.gameBoard[tileId] = player;


        //At least 5 turns have to pass to even consider that someone has won
        if(this.gameBoard.length >= 5) return checkBoardWin();
    }

    checkBoardWin(){
        let winner;
        winConditions.forEach((winCondition) => {
        
            //Can be improved
            winner = this.board[winCondition[0]];
        
            //If winner is set, and board[winCo[1]] and [2] are the same as winner
            if(winner && this.board[winCondition[1]] === winner && 
                this.board[winCondition[2]] === winner){
                return winner;
            }
        });
    }

    // Resets Game Board
    resetBoard() {
        this.gameBoard = [];
    }

    // Check if game is already full
    isFull(){
        //It is two player game
        return this.players.length >= 2;
    }
}