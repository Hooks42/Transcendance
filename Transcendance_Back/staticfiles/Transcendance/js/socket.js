has_loaded = false;

const socket = {

	chat_socket: null,
	system_socket: null,
	pong_socket: null,
	private_chat_sockets: {},


	launch_private_chat_socket: function (room_name)
	{
		let private_chat_socket = new WebSocket('wss://localhost/ws/private_chat/' + room_name + '/');

		private_chat_socket.onopen = function (e)
		{
			console.log('Private Chat Socket opened with room_name: ' + room_name);
			socket.private_chat_sockets[room_name] = private_chat_socket;
		};

		private_chat_socket.onclose = function (e)
		{
			console.log('Private Chat Socket closed');
		}

		private_chat_socket.onmessage = (event) => 
		{
			let data = JSON.parse(event.data);
			console.log("message recieved ---> " + data.message);
			console.log("profile_picture ---> " + data.profile_picture);
			let inbox = document.getElementById(room_name + '_inbox');
			if (!inbox)
				console.log("⚠️ inbox not found");
			chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture, inbox);
		};
	},

	init_private_chat_sockets: function (room_names)
	{
		for (let i = 0; i < room_names.length; i++)
		{
			if (!socket.private_chat_sockets[room_names[i]])
				socket.launch_private_chat_socket(room_names[i]);
		}
	},

	update_socket: function (user_to_edit, new_username)
	{
		if (currentUser === new_username)
		{
			friend_list.forEach(element => {
				const old_room_name = get_room_name(user_to_edit, element);
				socket.private_chat_sockets[old_room_name].close();
				delete socket.private_chat_sockets[old_room_name];

				const new_room_name = get_room_name(new_username, element);
				socket.launch_private_chat_socket(new_room_name);
			});
		}
		else if (friend_list.includes(new_username))
		{
			Object.keys(socket.private_chat_sockets).forEach(key => {
				console.log("🔱 key --> ", key);
			});
			const old_room_name = get_room_name(user_to_edit, currentUser);
			socket.private_chat_sockets[old_room_name].close();
			delete socket.private_chat_sockets[old_room_name];
			
			const new_room_name = get_room_name(new_username, currentUser);
			socket.launch_private_chat_socket(new_room_name);
		}
	},

	launch_pfc_socket: function (room_name, original_user, user_to_add)
	{
		let pfc_socket = new WebSocket('wss://localhost/ws/pfc/' + room_name + '/');

		pfc_socket.onopen = function (e)
		{
			console.log('PFC Socket opened');
			if (original_user === currentUser)
			{
				send_msg.generate_game_id(original_user, pfc_socket);
			}
		}

		pfc_socket.onclose = function (e)
		{
			console.log('PFC Socket closed');
		}

		pfc_socket.onmessage = (event) =>
		{
			let data = JSON.parse(event.data);
			if (data.message.command)
				console.log("command recieved ---> " + data.message.command);
			if (data.message.player_to_inform)
				console.log("player_to_inform ---> " + data.message.player_to_inform);

			if (data.message.command === 'game_id_generated' && data.message.player_to_inform === currentUser)
			{
				send_msg.get_game_id(currentUser, pfc_socket);
			}

			if (data.message.command === 'start_game' || data.message.command === 'round_finished')
			{
				if (data.message.command === 'round_finished')
					pfc.update_pfc(data, pfc_socket);
				pfc.create_pfc_buttons(pfc_socket);
			}

			if (data.message.command === 'game_finished')
			{
				pfc.update_pfc(data, pfc_socket);
			}

			if (data.message.command === 'game_stopped')
			{
				pfc.observer.disconnect();
				clearInterval(pfc.timer_id);
				pfc_socket.close();
				let main_div = document.getElementById('main-div');
				main_div.innerHTML = "";
				display_game_button();
			}

			
		}

		return pfc_socket;
	},

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
			display_game_button();
			centerZone.listen();
			history.pushState({page: 'hello'}, 'hello', '/hello/');
		};

		this.chat_socket.onclose = function (e)
		{
			console.log('Chat Socket closed');
		}

		this.chat_socket.onmessage = (event) => 
		{
			let data = JSON.parse(event.data);
			console.log("message recieved ---> " + data.message);
			console.log("profile_picture ---> " + data.profile_picture);
			let inbox = document.getElementById('General_inbox');
			if (!inbox)
				console.log("⚠️ inbox not found");
			chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture, inbox);
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
			console.log('System Socket closed');
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
			if (data.message.user_to_edit)
				console.log("user_to_edit ---> " + data.message.user_to_edit);
			if (data.message.new_avatar)
				console.log("new_avatar ---> " + data.message.new_avatar);
			if (data.message.new_username)
				console.log("new_username ---> " + data.message.new_username);
			if (data.message.match_tab)
				console.log("match_tab ---> " + JSON.stringify(data.message.match_tab));

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
					const room_name = get_room_name(original_user, user_to_add);
					chat.create_chatroom(room_name);
					socket.launch_private_chat_socket(room_name);
				}
				else if(data.message.original_user === currentUser)
				{
					friend_list.push(user_to_add);
					chat.add_user_panel(data.message.user_to_add, data.message.user_to_add_status, data.message.user_to_add_avatar, "FRIEND");
					chat.add_disc_panel(data.message.user_to_add);
					clear_button_if_friend(data.message.user_to_add);
					const room_name = get_room_name(original_user, user_to_add);
					chat.create_chatroom(room_name);
					socket.launch_private_chat_socket(room_name);
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
					const room_name = get_room_name(currentUser, data.message.friend_to_delete);
					socket.private_chat_sockets[room_name].close();
					delete socket.private_chat_sockets[room_name];
					document.getElementById("disc_btn-" + data.message.friend_to_delete).remove();
					document.getElementById("friend_list-" + data.message.friend_to_delete).remove();
					let btns = document.getElementsByClassName("add_friend_btn-" + data.message.friend_to_delete);
					for (let i = 0; i < btns.length; i++)
						btns[i].style.display = "inline";
				}
				else if(data.message.friend_to_delete === currentUser)
				{
					friend_list = friend_list.filter(e => e !== data.message.original_user);
					const room_name = get_room_name(currentUser, data.message.original_user);
					socket.private_chat_sockets[room_name].close();
					delete socket.private_chat_sockets[room_name];
					document.getElementById("disc_btn-" + data.message.original_user).remove();
					document.getElementById("friend_list-" + data.message.original_user).remove();
					let btns = document.getElementsByClassName("add_friend_btn-" + data.message.original_user);
					for (let i = 0; i < btns.length; i++)
						btns[i].style.display = "inline";
				}
				
			}

			if (data.message.command === 'friend_blocked')
			{
				if (data.message.original_user === currentUser)
				{
					block_list.push(data.message.user_to_add);
					if (friend_list.includes(data.message.user_to_add))
					{
						document.getElementById("disc_btn-" + data.message.user_to_add).remove();
						document.getElementById("friend_list-" + data.message.user_to_add).remove();
						friend_list = friend_list.filter(e => e !== data.message.user_to_add);
						const room_name = get_room_name(currentUser, data.message.user_to_add);
						socket.private_chat_sockets[room_name].close();
						delete socket.private_chat_sockets[room_name];
						let btns = document.getElementsByClassName("add_friend_btn-" + data.message.user_to_add);
						for (let i = 0; i < btns.length; i++)
							btns[i].style.display = "inline";
					}
					chat.add_user_panel(data.message.user_to_add, data.message.user_to_add_status, data.message.user_to_add_avatar, "BLOCKED");
					hide_or_unhide_msg(true, data.message.user_to_add);
				}
				else if (data.message.user_to_add === currentUser)
				{
					block_list.push(data.message.original_user);
					if (friend_list.includes(data.message.original_user))
					{
						document.getElementById("disc_btn-" + data.message.original_user).remove();
						document.getElementById("friend_list-" + data.message.original_user).remove();
						friend_list = friend_list.filter(e => e !== data.message.original_user);
						const room_name = get_room_name(currentUser, data.message.original_user);
						socket.private_chat_sockets[room_name].close();
						delete socket.private_chat_sockets[room_name];
						let btns = document.getElementsByClassName("add_friend_btn-" + data.message.original_user);
						for (let i = 0; i < btns.length; i++)
							btns[i].style.display = "inline";
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

			if (data.message.command === 'profile_edited')
			{
				let user_to_edit = data.message.user_to_edit;
				let new_username = data.message.new_username;
				let new_avatar = data.message.new_avatar;

				console.log("✅ Message recu ! : --> user_to_edit(" + user_to_edit + ") currentUser (" + currentUser + ")");
				if (user_to_edit === currentUser)
				{
					currentUser = new_username;
					profile_picture_tmp = new_avatar;
					send_msg.edit_profile(user_to_edit, new_username);
				}
				if (user_to_edit != currentUser)
				{
					if (friend_list.includes(user_to_edit))
					{
						friend_list = friend_list.filter(e => e !== user_to_edit);
						friend_list.push(new_username);
					}
					if (block_list.includes(user_to_edit))
					{
						block_list = block_list.filter(e => e !== user_to_edit);
						block_list.push(new_username);
					}
					send_msg.update_friend_request_and_block_list(user_to_edit, new_username);
				}
				socket.update_socket(user_to_edit, new_username);
				update_when_user_edit(user_to_edit, new_username, new_avatar);

			}
			// if (data.message.command === 'friend_request_and_block_list_updated')
			// 	console.log("✅ modification de la liste d'amis et de bloqués ! status --> " + data.message.is_updated);

			if (data.message.command === 'pfc_asked' && data.message.user_to_add === currentUser)
			{
				original_user = data.message.original_user;
				create_notif(original_user, 'challenge');
			}

			if (data.message.command === 'pfc_accepted')
			{
				original_user = data.message.original_user;
				user_to_add = data.message.user_to_add;
				if (user_to_add === currentUser || original_user === currentUser)
				{
					let room_name = original_user + "_" + user_to_add;
					let pfc_socket = this.launch_pfc_socket(room_name, original_user, user_to_add);
					pfc.display_pfc(pfc_socket);
					if (user_to_add === currentUser)
					{
						clear_notif(original_user);
					}
				}
			}

			if (data.message.command === 'match_found')
			{
				if (data.message.match_tab)
				{
					let match_tab = data.message.match_tab;
					for (let i = 0;  i < match_tab.length; i++)
					{
						if (match_tab[i]["player1"] == currentUser || match_tab[i]["player2"] == currentUser)
						{
							let room_name = match_tab[i]["player1"] + "_" + match_tab[i]["player2"];
							let pfc_socket = this.launch_pfc_socket(room_name, match_tab[i]["player1"], match_tab[i]["player2"]);
							pfc.display_pfc(pfc_socket);
						}
					}
				}
			}
		};
	},

	launch_pong_socket: function ()
	{
		this.pong_socket = new WebSocket('wss://localhost/ws/pong/');
		this.pong_socket.onopen = function (e)
		{
			console.log('Pong Socket opened');
		};

		this.pong_socket.onclose = function (e)
		{
			console.log('Pong Socket closed');
		}

	// 	this.pong_socket.onmessage = (event) => 
	// 	{
	// 		let data = JSON.parse(event.data);
	// 		console.log("message recieved ---> " + data.message);
	// 		if (data.message.command === "pong_game_saved")
	// 			centerZone.inner.innerHTML = "";
    //         (function () {
	// 				// let requestAnimId;
	// 				/* const framePerSecond = 60; */
	// 				let initialisation = function()
	// 				{
    //                             if (intervalId) {
    //                                 pong.scorePlayer1 = 0;
    //                                 pong.scorePlayer2 = 0;
    //                                 clearInterval(intervalId);
    //                             }
	// 							pong.init(centerZone.inner);
	// 							intervalId = setInterval(run_game, 1000 / 60); // 60 FPS
	// 				};
	// 				// un cycle d'affichage = un passage dans main()
	// 				const run_game = function() {
	// 							/* setInterval(pong.animate(), 1000 / framePerSecond); */
	// 							pong.currentState();
	// 						}

	// 				// appel de la fonction initialisation au chargement de la page
	// 				initialisation(); 

	// 			})();
				
	// 		};
	},
		
	launch_socket: function ()
    {
		if (!has_loaded)
		{
			this.launch_chat_socket();
			this.launch_system_socket();
			this.launch_pong_socket();
			let room_names = [];
			fetch('/get-friends-list/')
				.then(response => response.json())
				.then(data =>
				{
					let friends = data.friends;
					for (let i = 0; i < friends.length; i++)
						room_names.push(get_room_name(currentUser, friends[i].username));
					socket.init_private_chat_sockets(room_names);
				});
			has_loaded = true;
		}
    },

	sendMessage: function (message, chatroom)
    {
        if (chatroom === 'General' && this.chat_socket.readyState === this.chat_socket.OPEN)
        {
            if (message.length > 0)
            {
                this.chat_socket.send(JSON.stringify({
                    'type': 'send_message',
                    'message': message,
					'username': currentUser,
					'profile_picture': profile_picture,
					'timestamp': new Date().toLocaleString(),
                }));
            }
        }
		else if (socket.private_chat_sockets[chatroom] && socket.private_chat_sockets[chatroom].readyState === this.private_chat_sockets[chatroom].OPEN)
		{
			if (message.length > 0)
			{
				this.private_chat_sockets[chatroom].send(JSON.stringify({
					'type': 'send_message',
					'message': message,
					'username': currentUser,
					'profile_picture': profile_picture,
					'timestamp': new Date().toLocaleString(),
				}));
			}
		}
    }
}