pong.paddleL = {
	width : 5,
	height : 50,
	color : "#FFFFFF",
	posX : 0,
	posY : 0,

	init : function(distanceFromEdge)
	{
		this.posX = distanceFromEdge;
	},
	moveDown : function()
	{
		if (pong.paddleL.posY < pong.groundHeight - pong.paddleL.height)
			pong.paddleL.posY += 5;
	},
	moveUp : function()
	{
		if (pong.paddleL.posY > 0)
			pong.paddleL.posY -= 5;
	},
	detectCollision : function(ball)
	{
		if (this.posX + this.width == ball.posX
			/* && this.posX <= ball.posX + ball.width */
			&& this.posY <= ball.posY + ball.height
			&& this.height + this.posY >= ball.posY)
			return (true);
		return (false);
	}
};

pong.paddleR = {
	width : 5,
	height : 50,
	color : "#FFFFFF",
	posX : 0,
	posY : 0,

	init : function(distanceFromEdge)
	{
		this.posX = pong.groundWidth - this.width - distanceFromEdge;
	},
	moveDown : function()
	{
		if (pong.paddleR.posY < pong.groundHeight - pong.paddleR.height)
			pong.paddleR.posY += 5;
	},
	moveUp : function()
	{
		if (pong.paddleR.posY > 0)
			pong.paddleR.posY -= 5;
	},
	detectCollision : function(ball)
	{
		if (this.posX == ball.posX + ball.width
			/* && this.posX + this.width >= ball.posX */
			&& this.posY <= ball.posY + ball.height
			&& this.height + this.posY >= ball.posY)
			return (true);
		return (false);
	}
};
