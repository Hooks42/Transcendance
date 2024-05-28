
class Ball
{
	width = 10;
	height = 10; // must be equal to width
	color = "#0000FF";
	posX = 0;
	posY = 0;
	cooldown = false;

	speed = 5;

	velocityX = 0;
	velocityY = 0;

	groundHeight = 0;
	groundWidth = 0;


	constructor(groundHeight, groundWidth)
	{
		this.groundHeight = groundHeight;
		this.groundWidth = groundWidth;
	}
	bounceOffWall()
	{
		if (this.posY + this.height >= this.groundHeight || this.posY <= 0)
			this.velocityY *= -1;
		if (this.posX + this.width >= this.groundWidth || this.posX <= 0)
			this.velocityX *= -1;
	}

	// move()
	// {
	// 	if (this.cooldown == true)
	// 		return;
	// 	// recalculate the ball velocity after a collision with a paddle
	// 	let angle = 0;
	// 	if (paddleL.detectCollision(this))
	// 	{
	// 		angle = this.calculateAngle(paddleL);
	// 		this.velocityX = Math.round(this.speed * Math.cos(angle));
	// 		this.velocityY = Math.round(this.speed * Math.sin(angle) * (-1));
	// 	}
	// 	else if (paddleR.detectCollision(this))
	// 	{
	// 		angle = this.calculateAngle(paddleR);
	// 		this.velocityX = Math.round(this.speed * Math.cos(angle) * (-1));
	// 		this.velocityY = Math.round(this.speed * Math.sin(angle) * (-1));
	// 	}
	// 	else
	// 		;

	// 	// ball makes small increments bcs
	// 	// ball must never be INSIDE our paddles
	// 	if (this.posX < paddleL.posX + paddleL.width + 10
	// 		&& this.velocityX < 0
	// 		|| this.posX + this.width > paddleR.posX - 10
	// 		&& this.velocityX > 0)
	// 	{
	// 		let j = 0;
	// 		let i = 0;
	// 		let countY = 0;
	// 		let countX = 0;
	// 		let ratio;
	// 		let bigAbsVel;
	// 		let smallAbsVel;
	// 		/* console.log(this.velocityX + ","  + this.velocityY + " = velx vely"); */
	// 		// velX will never be equal to 0
	// 		if (Math.abs(this.velocityY / this.velocityX) > 1)
	// 		{
	// 			// posY increments faster than posX 
	// 			bigAbsVel = Math.abs(this.velocityY);
	// 			smallAbsVel = Math.abs(this.velocityX);
	// 			ratio = Math.round(bigAbsVel / smallAbsVel);
	// 			/* console.log("before loop, ballx=" + this.posX + "bally=" + this.posY + ", ratio = " + ratio); */
	// 			while (i++ < bigAbsVel
	// 				&& !(countX == smallAbsVel && countY == bigAbsVel)
	// 				&& !(this.detectAllBallCollisions()))
	// 			{
	// 				j = 0;
	// 				while (j++ < ratio
	// 					&& (!(this.detectAllBallCollisions())))
	// 				{
	// 					if (countY != bigAbsVel)
	// 					{
	// 						this.movePosYOnePixel();
	// 						countY++;
	// 					}
	// 				}
	// 				if (countX != smallAbsVel)
	// 				{
	// 					this.movePosXOnePixel();
	// 					countX++;
	// 				}
	// 			}
	// 			/* console.log("countX=" + countX + ", countY="+ countY); */
	// 		}
	// 		else
	// 		{
	// 			// posX increments faster than posY 
	// 			bigAbsVel = Math.abs(this.velocityX);
	// 			smallAbsVel = Math.abs(this.velocityY);
	// 			if (this.velocityY != 0)
	// 				ratio = Math.round(bigAbsVel / smallAbsVel);
	// 			else
	// 			{
	// 				i = -1;
	// 				ratio = Math.round(bigAbsVel);
	// 			}
	// 			/* console.log("before loop, ballx=" + this.posX + "bally=" + this.posY + ", ratio = " + ratio); */
	// 			while (i++ < bigAbsVel
	// 				&& !(countX == bigAbsVel && countY == smallAbsVel)
	// 				&& !(this.detectAllBallCollisions()))
	// 			{
	// 				j = 0;
	// 				while (j++ < ratio
	// 					&& (!(this.detectAllBallCollisions())))
	// 				{
	// 					if (countX != bigAbsVel)
	// 					{
	// 						this.movePosXOnePixel();
	// 						countX++;
	// 					}
	// 				}
	// 				if (countY != smallAbsVel)
	// 				{
	// 					this.movePosYOnePixel();
	// 					countY++;
	// 				}
	// 			}
	// 			/* console.log("countX=" + countX + ", countY="+ countY); */
	// 		}

	// 	}
	// 	else
	// 	{
	// 		this.posY += this.velocityY;
	// 		this.posX += this.velocityX;
	// 	}
	// }

	// calculateAngle(paddle)
	// {
	// 	let relative = (paddle.posY + (paddle.height / 2) - (this.posY + this.height / 2)); // values between (-paddleHeight/2) and paddleHeight/2
	// 	let normal = relative / (paddle.height / 2); // values between -1 and 1
	// 	return (normal * 0.25 * Math.PI); // 0.25 * PI rad is equal to 45 degrees, it is the max bounce angle
	// }

	movePosXOnePixel()
	{
		if (this.velocityX > 0)
			this.posX++;
		else
			this.posX--;
		/* console.log("move X, ballx=" + this.posX + "bally=" + this.posY ); */
	}

	movePosYOnePixel()
	{
		if (this.velocityY > 0)
			this.posY++;
		else
			this.posY--;
		/* console.log("move Y, ballx=" + this.posX + "bally=" + this.posY ); */
	}

	// detectAllBallCollisions()
	// {
	// 	if (paddleL.detectCollision(this)
	// 		|| paddleR.detectCollision(this))
	// 		return (true);
	// 	return (false);
	// }
}
