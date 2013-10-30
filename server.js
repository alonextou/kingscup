var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {
	log: false
});

var fs = require('fs');

server.listen(3000);

var players = [];
var cards = fs.readFileSync('./cards.json');
cards = JSON.parse(cards);

cards.forEach(function(card){
	//console.log(card.name);
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var playerCount = 0;
io.sockets.on('connection', function (socket) {

	// player join
	console.log('connected');
	playerCount++;
	console.log(playerCount);
	socket.emit('setPlayerId', socket.id);
	socket.emit('updatePlayerCount', playerCount);

	players[playerCount] = socket.id;

	// player leave
	socket.on('disconnect', function() {
		console.log('disconnected');
		playerCount--;
		console.log(playerCount);
		socket.emit('updatePlayerCount', playerCount);
	});

	socket.on('getPlayerCount', function() {
		return playerCount;
	});

	// new game
	socket.on('newGame', function() {

		console.log('newGame');
		var deck = shuffle(cards);
		var countDeck = 0;
		var playerTurn = 1;
		var loopDeck = function(deck) {
			newTurn(deck[countDeck], function(){

				console.log('called back');
				countDeck++;
				console.log(deck[countDeck])

				if (playerTurn === players.length - 1) {
					playerTurn = 1;
				} else {
					playerTurn++;
				}

				console.log(countDeck + ' : ' + deck.length)
				if (countDeck < deck.length) {
					loopDeck(deck);
				} else {
					loopDeck(deck);
					console.log('GAME OVER');
				}
			});
		}
		function newTurn(card, callback) {
			console.log('Player turn: ' + players[playerTurn]);
			socket.emit('newTurn', {
				player: players[playerTurn],
				card: card
			});
			socket.on('turnDone', function() {
				console.log('calling back');
				callback();
			});
		}
		loopDeck(deck);

/*
		deck.forEach(function(card){
			if (playerTurn === players.length - 1) {
				playerTurn = 1;
			} else {
				playerTurn++;
			}
			socket.emit('newTurn', {
				user: playerTurn,
				card: card
			});
			socket.on ('turnDone', function() {
				
			});
		});
*/

	});

});


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};