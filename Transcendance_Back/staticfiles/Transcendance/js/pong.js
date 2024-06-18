const pong = {
	groundWidth: 0, // min groundwidth
	groundHeight: 0, // min groundheight
	groundColor: "#000000",

	netWidth: 6,
	netColor: "#565656",
	distanceFromEdge: 10,

	groundLayer: null,
	scoreLayer: null,
	ballPaddlesLayer: null,
	noticeLayer: null,

	is_tournament: null,
	player1: {},
	player2: {},
	player3: {},
	player4: {},
	actual_player1: {},
	actual_player2: {},
	leaderboard: [],
	round: 1,
	round_message: 0,

	scorePlayer1: 0,
	scorePlayer2: 0,

	textStartGame: "Barre d'espace : commencer la partie\nBarre d'espace : mettre en pause la partie\n\nTouches de controle :\na q et p m (azerty) ou q a et p ; (qwerty)",
	textPausedGame: "PAUSE",
	textNewGame: "Barre d'espace : commencer une nouvelle partie",
	textWINLOSE: "WINLOSE",
	textEndGame: "Fin de la partie",

	currentNotice: "",
	currentState: null, // states are: start, game, pause and end
	matchs: null,

	init: function (container, is_tournament) {
		pong.leaderboard = [];
		pong.round = 1;

		let left = Math.floor(container.getBoundingClientRect().left);
		let top = Math.floor(container.getBoundingClientRect().top);

		// pong fills up all of its (parent) container
		this.groundWidth = Math.floor(container.getBoundingClientRect().right) - left;
		this.groundHeight = Math.floor(container.getBoundingClientRect().bottom) - top;
		if (this.groundWidth % 2 == 1)
			this.groundWidth--;
		if (this.groundHeight % 2 == 1)
			this.groundHeight--;

		// creer 3 layers superposes, optimise le temps de refresh
		this.groundLayer = pong.display.createLayer("ground", this.groundWidth, this.groundHeight, container, 0, this.groundColor, left, top);
		pong.display.drawRecInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
		this.scoreLayer = pong.display.createLayer("score", this.groundWidth, this.groundHeight, container, 1, undefined, left, top);
		this.ballPaddlesLayer = pong.display.createLayer("ballPaddles", this.groundWidth, this.groundHeight, container, 2, undefined, left, top);
		this.noticeLayer = pong.display.createLayer("notice", this.groundWidth, this.groundHeight, container, 3, undefined, left, top);

		pong.paddleL.init(this.distanceFromEdge);
		pong.paddleR.init(this.distanceFromEdge);

		pong.is_tournament = is_tournament;

		pong.player1["name"] = pong.matchs[0].player1;
		pong.player1["phase_1_w"] = false;
		pong.player1["phase_2_w"] = false;
		pong.player2["name"] = pong.matchs[0].player2;
		pong.player2["phase_1_w"] = false;
		pong.player2["phase_2_w"] = false;
		if (pong.is_tournament == true)
		{
			console.log("is_tournament == true dans init");
			pong.player3["name"] = pong.matchs[1].player1;
			pong.player3["phase_1_w"] = false;
			pong.player3["phase_2_w"] = false;
			pong.player4["name"] = pong.matchs[1].player2;
			pong.player4["phase_1_w"] = false;
			pong.player4["phase_2_w"] = false;
		}

		pong.actual_player1["score"] = 0;
		pong.actual_player2["score"] = 0;

		this.centerBall();
		this.centerPaddles();
		this.randomizeBallDirection();
		// render
		this.displayBall();
		this.displayPaddles();

		// console.log("paddleL (" + pong.paddleL.posX + ", " + pong.paddleL.posY + ")");
		// console.log("paddleR (" + pong.paddleR.posX + ", " + pong.paddleR.posY + ")");
		// console.log("ball (" + pong.ball.posX + ", " + pong.ball.posY + ")");
		this.initKeyboard(pong.control.onKeyDown, pong.control.onKeyUp);
		this.currentNotice = this.textStartGame;
		this.displayNotice();
		this.currentState = pong.start;
	},

	adaptWindow: function(container) {
		if (this.currentState == pong.game)
			this.currentState = pong.pause;
		else if (this.currentState == null)
			return;
		let left = Math.floor(container.getBoundingClientRect().left);
		let top = Math.floor(container.getBoundingClientRect().top);
		let newWidth = Math.floor(container.getBoundingClientRect().right) - left;
		let newHeight = Math.floor(container.getBoundingClientRect().bottom) - top;
	
		pong.ball.posX = (pong.ball.posX / this.groundWidth) * newWidth;
		pong.ball.posY = (pong.ball.posY / this.groundHeight) * newHeight;
		pong.paddleL.posY = (pong.paddleL.posY / this.groundHeight) * newHeight;
		pong.paddleR.posY = (pong.paddleR.posY / this.groundHeight) * newHeight;
	
		this.groundWidth = newWidth;
		this.groundHeight = newHeight;
	
		pong.display.resizeLayer(pong.groundLayer, this.groundWidth, this.groundHeight);
		pong.display.resizeLayer(pong.scoreLayer, this.groundWidth, this.groundHeight);
		pong.display.resizeLayer(pong.ballPaddlesLayer, this.groundWidth, this.groundHeight);
		pong.display.resizeLayer(pong.noticeLayer, this.groundWidth, this.groundHeight);

		pong.display.drawRecInLayer(pong.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
		pong.paddleL.init(this.distanceFromEdge);
		pong.paddleR.init(this.distanceFromEdge);
		pong.displayBall();
		pong.displayPaddles();
		pong.displayNotice();
		pong.displayScore();
	},
	
	// Game state
	start: function () {
		pong.clearLayer(pong.scoreLayer);

		if (pong.is_tournament == true)
		{
			const general_inbox = document.getElementById('General_inbox');
			if (pong.round == 1)
			{
				pong.actual_player1["name"] = pong.player1["name"];
				pong.actual_player2["name"] = pong.player2["name"];
				if (pong.round_message < pong.round)
				{
					chat.add_chat("MEE42", new Date().toLocaleString(), "Le match commence entre " + pong.player1["name"] + " et " + pong.player2["name"] + " !", "https://localhost/media/avatars/bot_picture.jpg", general_inbox, true);
					pong.round_message++;
				}
				pong.actual_player1["score"] = 0;
				pong.actual_player2["score"] = 0;
			}
			else if (pong.round == 2)
			{
				pong.actual_player1["name"] = pong.player3["name"];
				pong.actual_player2["name"] = pong.player4["name"];
				if (pong.round_message < pong.round)
				{
					chat.add_chat("MEE42", new Date().toLocaleString(), "Le match commence entre " + pong.player3["name"] + " et " + pong.player4["name"] + " !", "https://localhost/media/avatars/bot_picture.jpg", general_inbox, true);
					pong.round_message++;
				}
				pong.actual_player1["score"] = 0;
				pong.actual_player2["score"] = 0;
			}
			else if (pong.round == 3)
			{
				loser_name_1 = pong.player1["phase_1_w"] ? pong.player2["name"] : pong.player1["name"];
				loser_name_2 = pong.player3["phase_1_w"] ? pong.player4["name"] : pong.player3["name"];
				if (pong.round_message < pong.round)
				{
					chat.add_chat("MEE42", new Date().toLocaleString(), "La petite Finale entre " + loser_name_1 + " et " + loser_name_2 + " commence !", "https://localhost/media/avatars/bot_picture.jpg", general_inbox, true);
					pong.round_message++;
				}
				pong.actual_player1["name"] = loser_name_1;
				pong.actual_player2["name"] = loser_name_2;
				pong.actual_player1["score"] = 0;
				pong.actual_player2["score"] = 0;
			}
			else if (pong.round == 4)
			{
				winner_name_1 = pong.player1["phase_1_w"] ? pong.player1["name"] : pong.player2["name"];
				winner_name_2 = pong.player3["phase_1_w"] ? pong.player3["name"] : pong.player4["name"];
				if (pong.round_message < pong.round)
				{
					chat.add_chat("MEE42", new Date().toLocaleString(), "La grande Finale entre " + winner_name_1 + " et " + winner_name_2 + " commence !", "https://localhost/media/avatars/bot_picture.jpg", general_inbox, true);
					pong.round_message++;
				}
				pong.actual_player1["name"] = winner_name_1;
				pong.actual_player2["name"] = winner_name_2;
				pong.actual_player1["score"] = 0;
				pong.actual_player2["score"] = 0;
			}
			else if (pong.round == 5)
			{
				console.log("Leaderboard --> " + pong.leaderboard);
				pong.display_leaderBoard();
				if (intervalId){
					clearInterval(intervalId);
				}
				return ;
			}
		}
		else
		{
			pong.actual_player1["name"] = pong.player1["name"];
			pong.actual_player2["name"] = pong.player2["name"];
			pong.actual_player1["score"] = 0;
			pong.actual_player2["score"] = 0;
		}
		pong.displayScore();
		if (pong.code["Space"].pressed) {
			pong.clearLayer(this.noticeLayer);
			pong.currentNotice = "";
			pong.code["Space"].pressed = false;
			pong.currentState = pong.game;
		}
	},

	// Game state
	game: function () {
		// clear notice layer
		if (pong.currentState == pong.pause)
			return;
		// clear old layers
		pong.clearLayer(this.noticeLayer);
		pong.clearLayer(pong.ballPaddlesLayer);

		// update values
		pong.moveBall();
		pong.movePaddles();

		// check if there is a winner and update scores
		pong.winLoseSystem();

		// draw new layers with updated values for ball and paddles
		pong.displayBall();
		pong.displayPaddles();
		// pause game
		if (pong.code["Space"].pressed) {
			pong.code["Space"].pressed = false;
			pong.currentState = pong.pause;
		}
	},

	// Game state
	pause: function () {
		// draw "PAUSE" on screen
		console.log("game is paused");
		pong.currentNotice = this.textPausedGame;
		pong.displayNotice();

		if (pong.code["Space"].pressed) {
			// remove on screen "PAUSE"
			pong.currentNotice = "";
			pong.clearLayer(this.noticeLayer);
			// resume the game
			pong.code["Space"].pressed = false; // needed bcs otherwise the key up event registers after the state change
			pong.currentState = pong.game;
		}
	},

	// Game state
	end: function () {
		this.currentNotice = this.textNewGame;
		this.displayNotice();
		this.currentNotice = this.textWINLOSE;
		this.displayNotice();
		this.currentNotice = this.textEndGame;
		this.displayNotice();
		// reset paddles and ball's positions
		pong.centerPaddles();
		pong.centerBall();
		pong.clearLayer(pong.ballPaddlesLayer);
		pong.displayBall();
		pong.displayPaddles();
		if (pong.code["Space"].pressed) {
			console.log("new game");
			pong.code["Space"].pressed = false;
			// reset score
			pong.actual_player1['score'] = 0; // change back to 0
			pong.actual_player2['score'] = 0;
			pong.round++;
			// randomize ball direction
			if ((Math.floor(Math.random() * 2)) % 2)
				pong.ball.velocityX *= -1;
			pong.clearLayer(pong.scoreLayer);
			pong.displayScore();
			// resume game
			if (pong.is_tournament == true)
				pong.currentState = pong.start;
			else
				pong.currentState = pong.game;
		}
	},

	initKeyboard: function (onKeyDownFunction, onKeyUpFunction) {
		window.onkeydown = onKeyDownFunction;
		window.onkeyup = onKeyUpFunction;
	},

	displayScore: function () {
		let scoreP1 = pong.actual_player1['name'] +" : " + this.actual_player1['score'];
		let scoreP2 = pong.actual_player2['name'] + " : " + this.actual_player2['score'];
		const padding = 30;
		pong.display.drawTextInLayer(this.scoreLayer, scoreP1, "30px mars", "#FF0000", padding, 30);
		pong.display.drawTextInLayer(this.scoreLayer, scoreP2, "30px mars", "#FF0000", this.groundWidth - (padding + (pong.actual_player2["name"].length) * 26), 30);
	},
	displayBall: function () {
		pong.display.drawRecInLayer(this.ballPaddlesLayer, pong.ball.width, pong.ball.height, pong.ball.color, pong.ball.posX, pong.ball.posY);
	},
	displayPaddles: function () {
		pong.display.drawRecInLayer(this.ballPaddlesLayer, pong.paddleL.width, pong.paddleL.height, pong.paddleL.color, pong.paddleL.posX, pong.paddleL.posY);
		pong.display.drawRecInLayer(this.ballPaddlesLayer, pong.paddleR.width, pong.paddleR.height, pong.paddleR.color, pong.paddleR.posX, pong.paddleR.posY);
	},
	displayNotice: function () {
		if (this.currentNotice == this.textStartGame) {
			let lines = this.currentNotice.split('\n');
			for (let i = 0; i < lines.length; i++) {
				pong.display.drawCenteredTextInLayer(this.noticeLayer, lines[i], "16px mars", "#FF0000", this.groundWidth, this.groundHeight * 0.2 + (i * 28));
			}
		}
		else if (this.currentNotice == this.textNewGame
			|| this.currentNotice == this.textPausedGame) {
			pong.display.drawCenteredTextInLayer(this.noticeLayer, this.currentNotice, "21px mars", "#FF0000", this.groundWidth, this.groundHeight * 0.5);
		}
		else if (this.currentNotice == this.textWINLOSE) {
			if (this.actual_player1['score'] > this.actual_player2['score']) {
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "GAGNANT", "16px mars", "#FF0000", this.groundWidth * 0.5, this.groundHeight * 0.2);
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "PERDANT", "16px mars", "#FF0000", this.groundWidth * 1.5, this.groundHeight * 0.2);
			}
			else {
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "PERDANT", "16px mars", "#FF0000", this.groundWidth * 0.5, this.groundHeight * 0.2);
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "GAGNANT", "16px mars", "#FF0000", this.groundWidth * 1.5, this.groundHeight * 0.2);
			}
		}
	},

	// supprime la trainee de la balle
	clearLayer: function (targetLayer) {
		targetLayer.clear();
	},

	randomizeBallDirection: function () {
		pong.ball.velocityX = pong.ball.speed;
		pong.ball.velocityY = 0;
		if ((Math.floor(Math.random() * 2)) % 2)
			pong.ball.velocityX *= -1;
	},

	centerBall: function () {
		pong.ball.posX = (this.groundWidth - pong.ball.width) / 2;
		pong.ball.posY = (this.groundHeight - pong.ball.height) / 2;
	},

	centerPaddles: function () {
		pong.paddleL.posY = (this.groundHeight - pong.paddleL.height) / 2;
		pong.paddleR.posY = (this.groundHeight - pong.paddleR.height) / 2;
	},

	winLoseSystem: function () {
		// game ends when one player gets 11 points
		if (this.actual_player1['score'] >= 11 || this.actual_player2['score'] >= 11) {
			let winner = null;
			let current_player_score = null;
			let opponent_score = null;
			if (this.actual_player1['score'] > this.actual_player2['score'])
			{
				winner = this.actual_player1['name'];
				loser = this.actual_player2['name'];
			}
			else
			{
				winner = this.actual_player2['name'];
				loser = this.actual_player1['name'];
			}
			if (pong.is_tournament == true)
			{
				if (!(winner === null))
				{
					if (pong.round >= 1 && pong.round <= 2)
						phase = "phase_1_w";
					else if (pong.round >= 3 && pong.round <= 4)
					{
						pong.leaderboard.push(loser);
						pong.leaderboard.push(winner);
					}

					if (winner == pong.player1["name"])
						pong.player1[phase] = true;
					else if (winner == pong.player2["name"])
						pong.player2[phase] = true;
					else if (winner == pong.player3["name"])
						pong.player3[phase] = true;
					else if (winner == pong.player4["name"])
						pong.player4[phase] = true;
				}
			}
			if (winner == currentUser)
				winner = true;
			else
				winner = false;
			if (this.actual_player1['name'] == currentUser)
			{
				current_player_score = this.actual_player1['score'];
				opponent_score = this.actual_player2['score'];
			}
			else if (this.actual_player2['name'] == currentUser)
			{
				current_player_score = this.actual_player2['score'];
				opponent_score = this.actual_player1['score'];
			}
			send_msg.pong_finished(pong.actual_player1["name"], pong.actual_player2['name'], winner, current_player_score, opponent_score);
			pong.currentState = pong.end;
		}
		// left player gagne 1 point
		if (pong.ball.posX + pong.ball.width >= this.groundWidth) {
			this.actual_player1['score']++;
			// ball moves toward loser
			if (pong.ball.velocityX < 0)
				pong.ball.velocityX *= -1;
			this.centerBall();
			this.clearLayer(this.scoreLayer);
			this.displayScore();
			// TODO add small delay here
			this.sleep(500);
		}
		else if (pong.ball.posX <= 0) {
			this.actual_player2['score']++;
			if (pong.ball.velocityX > 0)
				pong.ball.velocityX *= -1;
			this.centerBall();
			this.clearLayer(this.scoreLayer);
			this.displayScore();
			this.sleep(500);
		}
		else
			;
	},

	sleep: function (delay) {
		if (pong.ball.cooldown == false) {
			pong.ball.cooldown = true;
			setTimeout(() => pong.ball.cooldown = false, delay);
		}
	},

	moveBall: function () {
		pong.ball.bounceOffWall();
		pong.ball.move();
	},

	movePaddles: function () {
		Object.keys(pong.code).forEach(key => {
			if (key != "Space"
				&& key != "Enter")
				pong.code[key].pressed && pong.code[key].func();
		});
	},


	initialisation: function(matchs, is_tournament) {
		const run_game = function() {
			pong.currentState();
		}
		if (is_tournament == true)
		{
			let modal = document.getElementById('tournament-pong-modal');
			let modal_instance = bootstrap.Modal.getInstance(modal);
			modal_instance.hide();
		}
		else
		{
			let modal = document.getElementById('2-players-modal');
			let modal_instance = bootstrap.Modal.getInstance(modal);
			modal_instance.hide();
		}
		centerZone.inner.innerHTML = "";
		if (intervalId) {
			clearInterval(intervalId);
		}
		pong.matchs = matchs;
		pong.init(centerZone.inner, is_tournament);
		intervalId = setInterval(run_game, 1000 / 60); // 60 FPS
	},

	display_leaderBoard: function()
	{
		centerZone.inner.innerHTML = "";
		let title = document.createElement('h1');
		title.textContent = "Classement";

		let leaderboard = document.createElement('ol');
		let first = document.createElement('li');
		first.classList.add('leaderboard__li');
		let second = document.createElement('li');
		second.classList.add('leaderboard__li');
		let third = document.createElement('li');
		third.classList.add('leaderboard__li');
		let fourth = document.createElement('li');
		fourth.classList.add('leaderboard__li');

		first.textContent = pong.leaderboard[3];
		second.textContent = pong.leaderboard[2];
		third.textContent = pong.leaderboard[1];
		fourth.textContent = pong.leaderboard[0];

		centerZone.inner.append(title, leaderboard);
		leaderboard.append(first, second, third, fourth);

		const flowey = document.createElement('img');
		flowey.classList.add('floweyImg');
		flowey.setAttribute('src', "/media/kindpng_flowey.png" );		

		centerZone.inner.append(flowey);

		// src="/media/cc0-images/grapefruit-slice-332-332.jpg"
  //alt="Grapefruit slice atop a pile of other slices"
	}

	/* collisionWithBall : function() */
	/* { */
	/* 	if (pong.paddleL.detectCollision(pong.ball) */
	/* 		|| pong.paddleR.detectCollision(pong.ball)) */
	/* 	{ */
	/* 		console.log("paddle collision"); */
	/* 		return (true); */
	/* 	} */
	/* 	return false; */
	/* } */
};
