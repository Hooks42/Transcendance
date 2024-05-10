pong.control = {
	onKeyDown : function(event)
	{
		if(pong.code[event.code])
		{
			console.log(event.code + " down");
			pong.code[event.code].pressed = true
		}
	},  

	onKeyUp : function(event)
	{
		if(pong.code[event.code])
		{
			console.log(event.code + " up");
			pong.code[event.code].pressed = false
		}
	}
};
