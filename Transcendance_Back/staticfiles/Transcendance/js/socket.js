const socket = {

	chat_socket: null,
	system_socket: null,


	launch_chat_socket: function ()
	{
		this.chat_socket = new WebSocket('wss://localhost/ws/chat/');

		this.chat_socket.onopen = function (e)
		{
			console.log('Chat Socket opened');
			chat.create();
			chat.load();
			navbar.create();
			navbar.load();
		};

		this.chat_socket.onclose = function (e)
		{
			console.error('Chat Socket closed');
		}

		this.chat_socket.onmessage = (event) => 
		{
			let data = JSON.parse(event.data);
			console.log("message recieved ---> " + data.message);
			console.log("profile_picture ---> " + data.profile_picture);
			chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture);
		};
	},

	launch_system_socket: function ()
	{
		this.system_socket = new WebSocket('wss://localhost/ws/system/');

		this.system_socket.onopen = function (e)
		{
			console.log('System Socket opened');
		};

		this.system_socket.onclose = function (e)
		{
			console.error('System Socket closed');
		}

		this.system_socket.onmessage = (event) => 
		{
			let data = JSON.parse(event.data);
			console.log("message recieved ---> " + data.message);
			if (data.message.command == 'add_friend' && data.message.user_to_add == currentUser)
			{
				original_user = data.message.original_user;
				orignal_user_status = data.message.orignal_user_status;
				original_user_avatar = data.message.original_user_avatar;
				chat.add_user_panel(data);
				notif_to_remove = document.getElementById('notif-' + original_user + '-add_friend');
				notif_to_remove.remove();

			}
			
			if (data.message.command == 'friend_rejected' && data.message.user_to_add == currentUser)
			{
				original_user = data.message.original_user;
				notif_to_remove = document.getElementById('notif-' + original_user + '-add_friend');
				notif_to_remove.remove();
			}
		};
	},

	launch_socket: function ()
    {
		this.launch_chat_socket();
		this.launch_system_socket();
    },

	sendMessage: function (message)
    {
        if (this.chat_socket.readyState === this.chat_socket.OPEN)
        {
            if (message.length > 0)
            {
                this.chat_socket.send(JSON.stringify({
                    'type': 'send_message',
                    'message': message
                }));
            }
        }
    }
}