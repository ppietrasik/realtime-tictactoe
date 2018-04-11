const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const uuidv1 = require('uuid/v1');

const {GamesManager, Game} = require('./logic/game');
const gs = require('./logic/game-socket');

// Set private/public paths
const publicPath = path.join(__dirname, './public');
const privatePath = path.join(__dirname, './private');

// Dev/Prod port switch
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var gameManager = new GamesManager();

// Serve static files
app.use(express.static(publicPath));

// GET / - returns index page
app.get('/', (req, res) => {
    res.sendFile(path.join(privatePath + '/index.html'));
});

// POST / - game creation route
app.post('/', (req, res) => {
    //Create game room
    const roomId = uuidv1();
    gameManager.addGame(new Game(roomId));
    //Redirect to 
    res.redirect(`/game/${roomId}`);
});

// GET /game/:id - join game with :id route
app.get('/game/:id', (req, res) => {
    res.sendFile(path.join(privatePath + '/game.html'));
});

gs.gameSocketsHandler(gameManager, io);

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

module.exports = {gameManager, io};