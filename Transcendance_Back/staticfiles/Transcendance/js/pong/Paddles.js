class PaddleL {
	width = 5;
	height = 50;
	color = "#FFFFFF";
	posX = 0;
	posY = 0;

	groundHeight= 0;
	groundWidth = 0;

	 constructor(distanceFromEdge, groundWidth, groundHeight)
	{
		this.posX = distanceFromEdge;
		this.groundHeight = groundHeight;
		this.groundWidth = groundWidth;
	}

	get height()
	{
		return (this.height);
	}
	moveDown ()
	{
		if (this.posY < this.groundHeight - this.height)
		{
			this.posY += 5;
			}
	}
	moveUp  ()
	{
		if (this.posY > 0)
			this.posY -= 5;
	}
	detectCollision  (ball)
	{
		if (this.posX + this.width == ball.posX
			/* && this.posX <= ball.posX + ball.width */
			&& this.posY <= ball.posY + ball.height
			&& this.height + this.posY >= ball.posY)
			return (true);
		return (false);
	}
};

class PaddleR  {
	width = 5;
	height = 50;
	color = "#FFFFFF";
	posX = 0;
	posY = 0;

	groundHeight= 0;
	groundWidth = 0;

	constructor(distanceFromEdge, groundWidth, groundHeight)
	{
		this.posX = groundWidth - this.width - distanceFromEdge;
		this.groundHeight = groundHeight;
		this.groundWidth = groundWidth;
	}
	get height()
	{
		return (this.height);
	}
	moveDown ()
	{
		if (this.posY < this.groundHeight - this.height)
			this.posY += 5;
	}
	 moveUp ()
	{
		if (this.posY > 0)
			this.posY -= 5;
	}
	detectCollision (ball)
	{
		if (this.posX == ball.posX + ball.width
			/* && this.posX + this.width >= ball.posX */
			&& this.posY <= ball.posY + ball.height
			&& this.height + this.posY >= ball.posY)
			return (true);
		return (false);
	}
};

// export {PaddleL, PaddleR};