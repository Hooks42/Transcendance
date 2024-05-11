

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
			if (data.message.command)
				console.log("command recieved ---> " + data.message.command);
			if (data.message.user_to_add)
				console.log("user_to_add ---> " + data.message.user_to_add);
			if (data.message.original_user)
				console.log("original_user ---> " + data.message.original_user);
			if (data.message.friend_to_delete)
				console.log("orignal_user_status ---> " + data.message.original_user_status);
			if (data.message.user_to_add_status)
				console.log("original_user_avatar ---> " + data.message.original_user_avatar);
			if (data.message.user_to_add_status)
				console.log("user_to_add_status ---> " + data.message.user_to_add_status);
			if (data.message.user_to_add_avatar)
				console.log("user_to_add_avatar ---> " + data.message.user_to_add_avatar);
			if (data.message.friend_to_delete)
				console.log("friend_to_delete ---> " + data.message.friend_to_delete);
			console.log("current_user ---> " + currentUser);

			if (data.message.command === 'add_friend' && data.message.user_to_add === currentUser)
			{
				original_user = data.message.original_user;
				create_notif(original_user, 'add_friend');
			}

			if (data.message.command === 'friend_accepted')
			{
				original_user = data.message.original_user;
				original_user_status = data.message.orignal_user_status;
				original_user_avatar = data.message.original_user_avatar;
				user_to_add = data.message.user_to_add;
				user_to_add_status = data.message.user_to_add_status;
				user_to_add_avatar = data.message.user_to_add_avatar;

				if (data.message.user_to_add === currentUser)
				{
					friend_list.push(original_user);
					chat.add_user_panel(original_user, original_user_status, original_user_avatar, "FRIEND");
					chat.add_disc_panel(original_user);

					notif_to_remove = document.getElementById('notif-' + original_user + '-add_friend');
					notif_to_remove.remove();
					notif_menu = document.getElementById('notif-menu');
					if (notif_menu.childElementCount == 0)
						show_no_notif();
					
					clear_button_if_friend(original_user);
				}
				else if(data.message.original_user === currentUser)
				{
					friend_list.push(user_to_add);
					chat.add_user_panel(data.message.user_to_add, data.message.user_to_add_status, data.message.user_to_add_avatar, "FRIEND");
					chat.add_disc_panel(data.message.user_to_add);
					clear_button_if_friend(data.message.user_to_add);
				}
			}
			
			if (data.message.command === 'friend_rejected' && data.message.user_to_add === currentUser)
			{
				original_user = data.message.original_user;
				notif_id = ('notif-' + original_user + '-add_friend');
				console.log('NOTIF_ID ==> ' + notif_id);
				notif_to_remove = document.getElementById('notif-' + original_user + '-add_friend');
				notif_to_remove.remove();
				notif_menu = document.getElementById('notif-menu');
				if (notif_menu.childElementCount == 0)
					show_no_notif();
			}

			if (data.message.command === 'friend_deleted')
			{
				if (data.message.original_user === currentUser)
				{
					friend_list = friend_list.filter(e => e !== data.message.friend_to_delete);
					document.getElementById("disc_list-" + data.message.friend_to_delete).remove();
					document.getElementById("friend_list-" + data.message.friend_to_delete).remove();
					let messages = document.getElementsByClassName("msg-" + data.message.friend_to_delete);
					for (let i = 0; i < messages.length; i++)
					{
						const button_add_friend = create_add_friend_btn("btn-set4", data.message.friend_to_delete);
						messages[i].appendChild(button_add_friend);
					}
				}
				else if(data.message.friend_to_delete === currentUser)
				{
					friend_list = friend_list.filter(e => e !== data.message.original_user);
					document.getElementById("disc_list-" + data.message.original_user).remove();
					document.getElementById("friend_list-" + data.message.original_user).remove();
					let messages = document.getElementsByClassName("msg-" + data.message.original_user);
					for (let i = 0; i < messages.length; i++)
					{
						const button_add_friend = create_add_friend_btn("btn-set4", data.message.original_user);
						messages[i].appendChild(button_add_friend);
					}
				}
				
			}

			if (data.message.command === 'friend_blocked')
			{
				if (data.message.original_user === currentUser)
				{
					block_list.push(data.message.user_to_add);
					if (friend_list.includes(data.message.user_to_add))
					{
						document.getElementById("disc_list-" + data.message.user_to_add).remove();
						document.getElementById("friend_list-" + data.message.user_to_add).remove();
						friend_list = friend_list.filter(e => e !== data.message.user_to_add);
						let messages = document.getElementsByClassName("msg-" + data.message.user_to_add);
						for (let i = 0; i < messages.length; i++)
						{
							const button_add_friend = create_add_friend_btn("btn-set4", data.message.user_to_add);
							messages[i].appendChild(button_add_friend);
						}
					}
					chat.add_user_panel(data.message.user_to_add, data.message.user_to_add_status, data.message.user_to_add_avatar, "BLOCKED");
					hide_or_unhide_msg(true, data.message.user_to_add);
				}
				else if (data.message.user_to_add === currentUser)
				{
					block_list.push(data.message.original_user);
					if (friend_list.includes(data.message.original_user))
					{
						document.getElementById("disc_list-" + data.message.original_user).remove();
						document.getElementById("friend_list-" + data.message.original_user).remove();
						friend_list = friend_list.filter(e => e !== data.message.original_user);
						let messages = document.getElementsByClassName("msg-" + data.message.original_user);
						for (let i = 0; i < messages.length; i++)
						{
							const button_add_friend = create_add_friend_btn("btn-set4", data.message.original_user);
							messages[i].appendChild(button_add_friend);
						}
					}
				}
			}

			if (data.message.command === 'friend_unblocked')
			{
				if (data.message.original_user === currentUser)
				{
					block_list = block_list.filter(e => e !== data.message.user_to_add);
					document.getElementById("friend_list-" + data.message.user_to_add).remove();
					hide_or_unhide_msg(false, data.message.user_to_add);
				}
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