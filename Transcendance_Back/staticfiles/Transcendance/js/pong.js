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

	scorePlayer1: 0,
	scorePlayer2: 0,

	textStartGame: "touche Entree : commencer la partie\nBarre d'espace : mettre en pause la partie\n\nTouches de controle :\na q et p m (azerty) ou q a et p ; (qwerty)",
	textPausedGame: "PAUSE",
	textNewGame: "touche Entree : commencer une nouvelle partie",
	textWINLOSE: "WINLOSE",

	currentNotice: "",
	currentState: null, // states are: start, game, pause and end

	init: function (container, match, is_tournament) {
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

		this.centerBall();
		this.centerPaddles();
		this.randomizeBallDirection();
		// render
		this.displayScore(this.scorePlayer1, this.scorePlayer2, match);
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
		pong.displayScore(pong.scorePlayer1, pong.scorePlayer2, match);
		pong.displayBall();
		pong.displayPaddles();
		pong.displayNotice();
	},
	
	// Game state
	start: function () {
		if (pong.code["Enter"].pressed) {
			pong.clearLayer(this.noticeLayer);
			pong.currentNotice = "";
			pong.code["Enter"].pressed = false;
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
		// reset paddles and ball's positions
		pong.centerPaddles();
		pong.centerBall();
		pong.clearLayer(pong.ballPaddlesLayer);
		pong.displayBall();
		pong.displayPaddles();
		if (pong.code["Enter"].pressed) {
			console.log("new game");
			pong.code["Enter"].pressed = false;
			// reset score
			pong.scorePlayer1 = 0;
			pong.scorePlayer2 = 0;
			// randomize ball direction
			if ((Math.floor(Math.random() * 2)) % 2)
				pong.ball.velocityX *= -1;
			pong.clearLayer(pong.scoreLayer);
			pong.displayScore();
			// resume game
			pong.currentState = pong.game;
		}
	},

	initKeyboard: function (onKeyDownFunction, onKeyUpFunction) {
		window.onkeydown = onKeyDownFunction;
		window.onkeyup = onKeyUpFunction;
	},

	displayScore: function (scorePlayer1, scorePlayer2, match) {
		let scoreP1 = match["player1"] + " : " + this.scorePlayer1;
		let scoreP2 = match["player2"] + " : " + this.scorePlayer2;
		const padding = 30;
		pong.display.drawTextInLayer(this.scoreLayer, scoreP1, "30px mars", "#FF0000", padding, 30);
		pong.display.drawTextInLayer(this.scoreLayer, scoreP2, "30px mars", "#FF0000", this.groundWidth - (padding + (match["player2"].length) * 26), 30);
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
			if (this.scorePlayer1 > this.scorePlayer2) {
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
		if (this.scorePlayer1 >= 11 || this.scorePlayer2 >= 11) {
			let winner;
			let Player2 = 'player2';
			if (this.scorePlayer1 > this.scorePlayer2)
				winner = currentUser;
			else
				winner = Player2;
			send_msg.pong_finished(Player2, winner, this.scorePlayer1, this.scorePlayer2);
			pong.currentState = pong.end;
		}
		// left player gagne 1 point
		if (pong.ball.posX + pong.ball.width >= this.groundWidth) {
			this.scorePlayer1++;
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
			this.scorePlayer2++;
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


	initialisation: function(match, is_tournament) {
		const run_game = function() {
			pong.currentState();
		}
		let modal = document.getElementById('tournament-pong-modal');
		let modal_instance = bootstrap.Modal.getInstance(modal);
		modal_instance.hide();
		centerZone.inner.innerHTML = "";
		if (intervalId) {
			pong.scorePlayer1 = 0;
			pong.scorePlayer2 = 0;
			clearInterval(intervalId);
		}
		pong.init(centerZone.inner, match, is_tournament);
		intervalId = setInterval(run_game, 1000 / 60); // 60 FPS
	},

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
