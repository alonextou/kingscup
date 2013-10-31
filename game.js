$(document).foundation();

$(document).ready(function() {

	var socket = io.connect('http://game.dev:3000');

	var players = [];
	var player = {};
	var playerCount;
	var currentPlayer;

	socket.on('getPlayer', function() {
		player.name = prompt("Please enter your name:","Yupi");
		$('#playerName').html(player.name);
		socket.emit('setPlayer', player);
	});

	socket.on('updatePlayerCount', function (count) {
		playerCount = count;
		$('#playerCount').html(playerCount);
	});

	$('#newGame').click(function(){
		socket.emit('newGame');
	});

	socket.on('newTurn', function (player) {
		console.log('new players turn: ' + player.name);
		$('#currentTurn').html(player.name);
	});

	socket.on('yourTurn', function (card) {
		$('#currentTurn').html('YOUR TURN, ' + player.name);
		$('#card').on('click', function(){
			$('#card').attr('src', '/images/cards/' + card.path);
			$('#cardName').html(card.name);
			$('#cardRule').html(card.rule);
			$('#card').off('click');
			socket.emit('turnDone');
		});
	});

	/*
	socket.on('updatePlayerCount', function (count) {
		playerCount = count;
		$('#playerCount').html(playerCount);
	});

	socket.on('getPlayer', function () {
		player.name = prompt("Please enter your name:","Yupi");
		$('#playerName').html(player.name);
		socket.emit('setPlayer', player.name);
	});

	socket.on('setPlayerId', function (id) {
		player.id = id;
	});

	socket.on('newTurn', function (data) {
		$('#currentTurn').html(data.player);
		$('#card').off('click');
		if(player === data.player) {
			$('#card').on('click', function(){
				$('#card').attr('src', '/images/cards/' + data.card.path);
				$('#cardName').html(data.card.name);
				$('#cardRule').html(data.card.rule);
				socket.emit('turnDone');
			});
		} else {
			$('#card').off('click', function(){
				alert('BIND OFF');
			});
		}
	});

	$('#newGame').click(function(){
		socket.emit('newGame');
	});

	*/

});