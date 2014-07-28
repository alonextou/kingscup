var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {
	log: false
});

var fs = require('fs');

server.listen(3000);

console.log('server started');

var players = [];
var cards = fs.readFileSync('./cards.json');
cards = JSON.parse(cards);

cards.forEach(function(card){
	//console.log(card.name);
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var gameInProgress = false;
var countDeck = 0;
var playerTurn = 0;

io.sockets.on('connection', function (socket) {

	// player join
	console.log('connect');
	socket.emit('getPlayer');
	socket.on('setPlayer', function(player){
		player.id = socket.id;
		player.turn = getPlayerCount(players) + 1;
		players[socket.id] = player;
		console.log(players);
		io.sockets.emit('updatePlayerCount', getPlayerCount(players));
	});

	// player leave
	socket.on('disconnect', function() {
		delete players[socket.id]
		var count = 1;
		for (i in players){
			players[i].turn = count;
			count++;
		}
		console.log(players);
		io.sockets.emit('updatePlayerCount', getPlayerCount(players));
	});

	/*
	console.log('connected');
	playerCount++;
	console.log(playerCount);

	socket.emit('setPlayerId', socket.id);
	socket.emit('getPlayer');
	socket.on('setPlayerName', function(playerName){
		players[socket.id] = playerName;
	});
	*/

	//socket.broadcast.emit('updatePlayerCount', playerCount);
	//console.log(players[socket.id])

	// new game
	socket.on('newGame', function() {
		if(gameInProgress === true){
			console.log('Game already in progress');
		} else {
			console.log(players);
			console.log('Starting new game');
			gameInProgress = true;
			deck = shuffle(cards);

			var loopDeck = function() {
				var card = deck[countDeck];
				for(var i in players) {
					console.log(players[i]);
					console.log(playerTurn);
					if(players[i].turn === playerTurn + 1){
						var id = players[i].id;
						io.sockets.socket(id).emit('yourTurn', card);
						socket.broadcast.emit('newTurn', players[i]);
					}
				}
			}

			socket.on('turnDone', function() {
				countDeck++;
				playerTurn++;
				console.log(playerTurn);
				if (playerTurn === getPlayerCount(players)) {
					playerTurn = 0;
				}
				loopDeck();
			});

			loopDeck();

/*
			deck.forEach(function(card){
				if (playerTurn === playerCount) {
					playerTurn = 0;
				} else {
					playerTurn++;
				}
				for(var i in players) {
					if(players[i].turn === playerTurn){
						console.log('Player turn: ' + players[i]);
						socket.emit('yourTurn', card);
						socket.broadcast.emit('newTurn', players[i]);
					}
				}
			});
*/
		}
	});

	/*
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
		*/

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


	});
*/
});

function getPlayerCount(players) {
  var count = 0;
  for(var player in players) {
  	count++;
  }
  return count;
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};