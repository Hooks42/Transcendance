//import {Tournament, display, PaddleL, PaddleR, Ball} from "./index.js";


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

	paddleL: null,
	paddleR: null,
	ball: null,

	scorePlayer1: 10,
	scorePlayer2: 10,

	playerName1: "",
	playerName2: "",
	players: [],
	tournament: null,

	textControlsGame: "touche Entree : commencer la partie\nBarre d'espace : mettre en pause la partie\n\nTouches de controle :\na q et p m (azerty) ou q a et p ; (qwerty)",
	textPausedGame: "PAUSE",
	textNewGame: "touche Entree : suivant",
	textWINLOSE: "WINLOSE",

	currentNotice: "",
	currentState: null, // states are in order: start, (game or pause) and then end

	code: {
		KeyA: {
			pressed: false,
		},
		KeyQ: {
			pressed: false,
		},
		Semicolon: {
			pressed: false,
		},
		KeyP: {
			pressed: false,
		},
		KeyT: {
			pressed: false,
		},
		Space: {
			pressed: false,
		},
		Enter: {
			pressed: false,
		}
	},

	onKeyDown: function (event)
	{
		if (pong.code[event.code])
		{
			pong.code[event.code].pressed = true;
		}
	},

	onKeyUp: function (event)
	{
		if (pong.code[event.code]
			&& event.code != "KeyT"
			&& event.code != "Space"
			&& event.code != "Enter")
		{
			pong.code[event.code].pressed = false;
		}
	},

	initTournament: function (players)
	{
		this.tournament.init(players);
	},

	init: function (container, players)
	{
		this.players = players;

		let left = Math.floor(container.getBoundingClientRect().left);
		let top = Math.floor(container.getBoundingClientRect().top);

		// pong fills up all of its (parent) container
		this.groundWidth = Math.floor(container.getBoundingClientRect().right) - left;
		this.groundHeight = Math.floor(container.getBoundingClientRect().bottom) - top;
		if (this.groundWidth % 2 == 1)
			this.groundWidth--;
		if (this.groundHeight % 2 == 1)
			this.groundHeight--;

		// creer des layers superposes, pour optimiser le temps de refresh
		this.groundLayer = pong.display.createLayer("ground", this.groundWidth, this.groundHeight, container, 0, this.groundColor, left, top);
		pong.display.drawRecInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
		this.scoreLayer = pong.display.createLayer("score", this.groundWidth, this.groundHeight, container, 1, undefined, left, top);
		this.ballPaddlesLayer = pong.display.createLayer("ballPaddles", this.groundWidth, this.groundHeight, container, 2, undefined, left, top);
		this.playerNamesLayer = pong.display.createLayer("playerNames", this.groundWidth, this.groundHeight, container, 3, undefined, left, top);
		this.noticeLayer = pong.display.createLayer("notice", this.groundWidth, this.groundHeight, container, 4, undefined, left, top);

		this.paddleL = new PaddleL(this.distanceFromEdge, this.groundWidth, this.groundHeight);
		this.paddleR = new PaddleR(this.distanceFromEdge, this.groundWidth, this.groundHeight);
		this.ball = new Ball(this.groundHeight, this.groundWidth);

		this.centerBall();
		this.centerPaddles();
		this.randomizeBallDirection();
		// render
		this.displayScore(this.scorePlayer1, this.scorePlayer2);
		this.displayBall();
		this.displayPaddles();

		this.initKeyboard(pong.onKeyDown, pong.onKeyUp);

		this.tournament = new Tournament(container);
		this.tournament.bs_modalPage1.show();
		// this.tournament.showTournamentNRankingPage();
		this.currentState = pong.start;
	},

	// state
	start: function ()
	{
		// listen to key presses linked to the game state
		pong.listenerGameState();
		// display key controls on screen for the players
		if (pong.currentNotice != pong.textControlsGame)
		{
			this.clearLayer(this.noticeLayer);
			this.currentNotice = this.textControlsGame;
			this.displayNotice();
		}
		// do not do anything if a modal is open
		if (document.getElementById("tournament-modal-page1").classList.contains("show")
			// || document.getElementById("tournament-modal-page2").classList.contains("show")
			|| pong.tournament.isOn == false)
		{

			console.log("not show");
			return;
		}
		// check if reached the end of tournament
		if (pong.tournament.currentRound == pong.tournament.maxRound)
		{
			console.log("fin tournois");
			// show ranking
			pong.tournament.rankingEl.classList.add('-highlight');
		}
		else // ongoing tournament
		{
			// show modal
			if (this.playerName1 == "" && this.playerName2 == "")
			{
				// highlight current round
				pong.tournament.js_rounds[pong.tournament.currentRound].classList.add('-highlight');
				console.log("forbid");

				// update usernames in layer
				this.playerName1 = pong.tournament.players[pong.tournament.currentRound * 2];
				this.playerName2 = pong.tournament.players[pong.tournament.currentRound * 2 + 1];
				this.clearLayer(pong.playerNamesLayer);
				this.displayPlayerNames();

			}
		}
		if (pong.tournament.isOn == true)
			pong.tournament.bs_modalPage2.show();
	},

	// state
	game: function ()
	{
		if (pong.currentState == pong.pause)
			return;
		// listen to key presses linked to the game state
		pong.listenerGameState();

		// clear old layers
		pong.clearLayer(this.noticeLayer);
		pong.clearLayer(this.ballPaddlesLayer);

		if (pong.tournament.isOn != false)
			pong.tournament.hide();

		// update ball and paddles values (make them move)
		pong.moveBall();
		pong.movePaddles();

		// check if there is a winner and update scores
		pong.winLoseSystem();

		// draw new layers with updated values for ball and paddles
		pong.displayBall();
		pong.displayPaddles();
	},

	// state
	pause: function ()
	{
		// display "PAUSE" on screen
		pong.currentNotice = this.textPausedGame;
		pong.displayNotice();

		// listen to key presses linked to the game state
		pong.listenerGameState();
	},

	// state. End of a match of 2 people (not the end of a tournament)
	end: function ()
	{
		pong.listenerGameState();
		let winner;
		let loser;
		if (this.currentNotice != this.textWINLOSE)
		{
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
		}

		// remember who won the current round
		if (pong.tournament.isOn != false
			&& pong.playerName1 != "" && pong.playerName2 != "")
		{
			// init winner and loser
			if (pong.scorePlayer1 > pong.scorePlayer2)
			{
				winner = pong.tournament.players[pong.tournament.currentRound * 2];
				loser = pong.tournament.players[pong.tournament.currentRound * 2 + 1];
				pong.tournament.js_players[pong.tournament.currentRound * 2].classList.add("winner");
			}
			else
			{
				loser = pong.tournament.players[pong.tournament.currentRound * 2];
				winner = pong.tournament.players[pong.tournament.currentRound * 2 + 1];
				pong.tournament.js_players[pong.tournament.currentRound * 2 + 1].classList.add("winner");
			}

			if (pong.tournament.currentRound >= pong.tournament.maxRound / 2) // final or semi final
			{
				pong.tournament.ranking.push(winner);
				pong.tournament.ranking.push(loser);
			}
			else
			{
				pong.tournament.players.push(winner);
				pong.tournament.losers.push(loser);
			}
			// concat players[] and losers[] from the 2 previous rounds
			if (pong.tournament.currentRound == 1)
				pong.tournament.players = pong.tournament.players.concat(pong.tournament.losers);

			// update tournament modal 
			for (let i = (pong.tournament.currentRound + 1) * 2; i < pong.tournament.js_players.length; i++)
			{
				if (pong.tournament.players[i])
				{
					pong.tournament.js_players[i].innerHTML = pong.tournament.players[i];
				}
			}
			// update ranking
			for (let i = 0; i < pong.tournament.ranking.length; i++)
			{
				pong.tournament.js_ranks[i].innerHTML = pong.tournament.ranking[i];
			}
			pong.playerName1 = "";
			pong.playerName2 = "";
			pong.tournament.bs_modalPage2.show();
		}
	},

	initKeyboard: function (onKeyDownFunction, onKeyUpFunction)
	{
		window.onkeydown = onKeyDownFunction;
		window.onkeyup = onKeyUpFunction;
	},

	displayScore: function (scorePlayer1, scorePlayer2)
	{
		let scoreP1 = this.scorePlayer1;
		if (scoreP1 < 10)
			scoreP1 = '0' + scoreP1;
		let scoreP2 = this.scorePlayer2;
		if (scoreP2 < 10)
			scoreP2 = '0' + scoreP2;
		pong.display.drawTextInLayer(this.scoreLayer, scoreP1, "30px mars", "#FF0000", this.groundWidth / 2 - 80, 30);
		pong.display.drawTextInLayer(this.scoreLayer, scoreP2, "30px mars", "#FF0000", this.groundWidth / 2 + 40, 30);
	},
	displayBall: function ()
	{
		pong.display.drawRecInLayer(this.ballPaddlesLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
	},
	displayPaddles: function ()
	{
		pong.display.drawRecInLayer(this.ballPaddlesLayer, this.paddleL.width, this.paddleL.height, this.paddleL.color, this.paddleL.posX, this.paddleL.posY);
		pong.display.drawRecInLayer(this.ballPaddlesLayer, this.paddleR.width, this.paddleR.height, this.paddleR.color, this.paddleR.posX, this.paddleR.posY);
	},
	displayNotice: function ()
	{
		if (this.currentNotice == this.textControlsGame)
		{
			let lines = this.currentNotice.split('\n');
			for (let i = 0; i < lines.length; i++)
			{
				pong.display.drawCenteredTextInLayer(this.noticeLayer, lines[i], "16px mars", "#FF0000", this.groundWidth, this.groundHeight * 0.2 + (i * 28));
			}
		}
		else if (this.currentNotice == this.textNewGame
			|| this.currentNotice == this.textPausedGame)
		{
			pong.display.drawCenteredTextInLayer(this.noticeLayer, this.currentNotice, "21px mars", "#FF0000", this.groundWidth, this.groundHeight * 0.5);
		}
		else if (this.currentNotice == this.textWINLOSE)
		{
			if (this.scorePlayer1 > this.scorePlayer2)
			{
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "GAGNANT", "16px mars", "#FF0000", this.groundWidth * 0.5, this.groundHeight * 0.2);
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "PERDANT", "16px mars", "#FF0000", this.groundWidth * 1.5, this.groundHeight * 0.2);
			}
			else
			{
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "PERDANT", "16px mars", "#FF0000", this.groundWidth * 0.5, this.groundHeight * 0.2);
				pong.display.drawCenteredTextInLayer(this.noticeLayer, "GAGNANT", "16px mars", "#FF0000", this.groundWidth * 1.5, this.groundHeight * 0.2);
			}
		}
	},
	displayPlayerNames: function ()
	{

		pong.display.drawCenteredTextInLayer(this.playerNamesLayer, this.playerName1, "16px mars", "#FF0000", this.groundWidth * 0.5, this.groundHeight * 0.1);
		pong.display.drawCenteredTextInLayer(this.playerNamesLayer, this.playerName2, "16px mars", "#FF0000", this.groundWidth * 1.5, this.groundHeight * 0.1);
	},

	// supprime la trainee de la balle
	clearLayer: function (targetLayer)
	{
		targetLayer.clear();
	},

	randomizeBallDirection: function ()
	{
		this.ball.velocityX = this.ball.speed;
		this.ball.velocityY = 0;
		if ((Math.floor(Math.random() * 2)) % 2)
			this.ball.velocityX *= -1;
	},

	centerBall: function ()
	{
		this.ball.posX = (this.groundWidth - this.ball.width) / 2;
		this.ball.posY = (this.groundHeight - this.ball.height) / 2;
	},

	centerPaddles: function ()
	{
		this.paddleL.posY = (this.groundHeight - this.paddleL.height) / 2;
		this.paddleR.posY = (this.groundHeight - this.paddleR.height) / 2;
	},

	winLoseSystem: function ()
	{
		// game ends when one player gets 11 points
		if (this.scorePlayer1 >= 11 || this.scorePlayer2 >= 11)
		{
			pong.currentState = pong.end;
		}
		// left player gagne 1 point
		if (this.ball.posX + this.ball.width >= this.groundWidth)
		{
			this.scorePlayer1++;
			// ball moves toward loser
			if (this.ball.velocityX < 0)
				this.ball.velocityX *= -1;
			this.centerBall();
			this.clearLayer(this.scoreLayer);
			this.displayScore();
			// TODO add small delay here
			this.sleep(500);
		}
		else if (this.ball.posX <= 0)
		{
			this.scorePlayer2++;
			if (this.ball.velocityX > 0)
				this.ball.velocityX *= -1;
			this.centerBall();
			this.clearLayer(this.scoreLayer);
			this.displayScore();
			this.sleep(500);
		}
		else
			;
	},

	sleep: function (delay)
	{
		if (this.ball.cooldown == false)
		{
			this.ball.cooldown = true;
			setTimeout(() => this.ball.cooldown = false, delay);
		}
	},

	moveBall: function ()
	{
		this.ball.bounceOffWall();
		this.moveBallDetectPaddle();
		// this.ball.move();
	},

	movePaddles: function ()
	{
		Object.keys(pong.code).forEach(key =>
		{
			if (key == "KeyQ" && pong.code[key].pressed)
				pong.paddleL.moveUp();
			else if (key == "KeyA" && pong.code[key].pressed)
				pong.paddleL.moveDown();
			else if (key == "Semicolon" && pong.code[key].pressed)
				pong.paddleR.moveDown();
			else if (key == "KeyP" && pong.code[key].pressed)
				pong.paddleR.moveUp();
		});
	},

	listenerGameState: function ()
	{
		Object.keys(pong.code).forEach(key =>
		{
			if (key == "Space")
			{
				if (pong.code["Space"].pressed == false)
					return;
				pong.code["Space"].pressed = false;
				pong.toggleGameOrPause();
			}
			else if (key == "KeyT")
			{
				if (pong.code["KeyT"].pressed == false)
					return;
				pong.code["KeyT"].pressed = false;
				// always pause game
				console.log("T pressed");
				if (pong.currentState == pong.game)
				{
					pong.currentState = pong.pause;
				}
				// if tournament is ongoing
				if (pong.tournament.isOn != false)
				{
					pong.tournament.bs_modalPage2.toggle();
				}
				if (pong.tournament.isOn == false && pong.currentState == pong.start)
				{
					pong.tournament.bs_modalPage1.toggle();
				}
			}
			else if (key == "Enter")
			{
				if (pong.code["Enter"].pressed == false)
					return;
				pong.code["Enter"].pressed = false;
				if (pong.currentState == pong.start)
				{
					this.sleep(1000);
					pong.currentState = pong.game;
				}
				else if (pong.currentState == pong.end)
				{
					console.log("new game");
					// reset score
					pong.scorePlayer1 = 10;
					pong.scorePlayer2 = 10;
					// randomize ball direction
					if ((Math.floor(Math.random() * 2)) % 2)
						pong.ball.velocityX *= -1;
					pong.clearLayer(pong.scoreLayer);
					pong.displayScore();

					// resume tournament 
					if (pong.tournament.isOn != false && pong.tournament.currentRound < pong.tournament.maxRound)
					{
						pong.tournament.js_rounds[pong.tournament.currentRound].classList.remove('-highlight');
						pong.tournament.currentRound++;
						// pong.tournament.hide();
					}
					pong.currentState = pong.start;
				}

			}
		});
	},

	toggleGameOrPause: function ()
	{
		if (pong.currentState == pong.game)
		{
			pong.currentState = pong.pause;
			return;
		}
		pong.currentState = pong.game;
	},


	moveBallDetectPaddle: function ()
	{
		if (this.ball.cooldown == true)
			return;
		// recalculate the ball velocity after a collision with a paddle
		let angle = 0;
		if (this.paddleL.detectCollision(this.ball))
		{
			angle = this.calculateAngle(this.paddleL, this.ball);
			this.ball.velocityX = Math.round(this.ball.speed * Math.cos(angle));
			this.ball.velocityY = Math.round(this.ball.speed * Math.sin(angle) * (-1));
		}
		else if (this.paddleR.detectCollision(this.ball))
		{
			angle = this.calculateAngle(this.paddleR, this.ball);
			this.ball.velocityX = Math.round(this.ball.speed * Math.cos(angle) * (-1));
			this.ball.velocityY = Math.round(this.ball.speed * Math.sin(angle) * (-1));
		}
		else
			;

		// ball makes small increments bcs
		// ball must never be INSIDE our paddles
		if (this.ball.posX < this.paddleL.posX + this.paddleL.width + 10
			&& this.ball.velocityX < 0
			|| this.ball.posX + this.ball.width > this.paddleR.posX - 10
			&& this.ball.velocityX > 0)
		{
			let j = 0;
			let i = 0;
			let countY = 0;
			let countX = 0;
			let ratio;
			let bigAbsVel;
			let smallAbsVel;
			/* console.log(this.velocityX + ","  + this.velocityY + " = velx vely"); */
			// velX will never be equal to 0
			if (Math.abs(this.ball.velocityY / this.ball.velocityX) > 1)
			{
				// posY increments faster than posX 
				bigAbsVel = Math.abs(this.ball.velocityY);
				smallAbsVel = Math.abs(this.ball.velocityX);
				ratio = Math.round(bigAbsVel / smallAbsVel);
				/* console.log("before loop, ballx=" + this.posX + "bally=" + this.posY + ", ratio = " + ratio); */
				while (i++ < bigAbsVel
					&& !(countX == smallAbsVel && countY == bigAbsVel)
					&& !(pong.detectAllBallCollisions(pong.paddleL, pong.paddleR, pong.ball)))
				{
					j = 0;
					while (j++ < ratio
						&& (!(pong.detectAllBallCollisions(pong.paddleL, pong.paddleR, pong.ball))))
					{
						if (countY != bigAbsVel)
						{
							this.ball.movePosYOnePixel();
							countY++;
						}
					}
					if (countX != smallAbsVel)
					{
						this.ball.movePosXOnePixel();
						countX++;
					}
				}
				/* console.log("countX=" + countX + ", countY="+ countY); */
			}
			else
			{
				// posX increments faster than posY 
				bigAbsVel = Math.abs(this.ball.velocityX);
				smallAbsVel = Math.abs(this.ball.velocityY);
				if (this.ball.velocityY != 0)
					ratio = Math.round(bigAbsVel / smallAbsVel);
				else
				{
					i = -1;
					ratio = Math.round(bigAbsVel);
				}
				/* console.log("before loop, ballx=" + this.posX + "bally=" + this.posY + ", ratio = " + ratio); */
				while (i++ < bigAbsVel
					&& !(countX == bigAbsVel && countY == smallAbsVel)
					&& !(pong.detectAllBallCollisions(pong.paddleL, pong.paddleR, pong.ball)))
				{
					j = 0;
					while (j++ < ratio
						&& (!(pong.detectAllBallCollisions(pong.paddleL, pong.paddleR, pong.ball))))
					{
						if (countX != bigAbsVel)
						{
							this.ball.movePosXOnePixel();
							countX++;
						}
					}
					if (countY != smallAbsVel)
					{
						this.ball.movePosYOnePixel();
						countY++;
					}
				}
				/* console.log("countX=" + countX + ", countY="+ countY); */
			}

		}
		else
		{
			this.ball.posY += this.ball.velocityY;
			this.ball.posX += this.ball.velocityX;
		}
	},

	calculateAngle: function (paddle, ball)
	{
		let relative = (paddle.posY + (paddle.height / 2) - (ball.posY + ball.height / 2)); // values between (-paddleHeight/2) and paddleHeight/2
		let normal = relative / (paddle.height / 2); // values between -1 and 1
		return (normal * 0.25 * Math.PI); // 0.25 * PI rad is equal to 45 degrees, it is the max bounce angle
	},

	detectAllBallCollisions(paddleL, paddleR, ball)
	{
		if (paddleL.detectCollision(ball)
			|| paddleR.detectCollision(ball))
			return (true);
		return (false);
	}

};