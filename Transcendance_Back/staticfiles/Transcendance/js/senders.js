send_msg = {

	add_friend_request: function(currentUser, user_to_add)
	{
		var message = {
			'command': 'add_friend',
			'original_user': currentUser,
			'user_to_add' : user_to_add,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
		console.log("Demande d'ajout d'ami envoyée");
	},

	block_friend_request: function(friend_to_block, original_user)
	{
		var message = {
			'command': 'block_friend',
			'user_to_add': friend_to_block,
			'original_user' : original_user,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	 // Envoie de l'acceptation en ami
	accept_friend_request: function(original_user, user_to_add)
	{
		var message = {
			'command': 'accept_friend',
			'original_user': original_user,
			'user_to_add' : user_to_add,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie du refus d'ami
	reject_friend_request: function(original_user, user_to_add)
	{
		console.log("Refus d'ami" + original_user + " " + user_to_add);
		var message = {
			'command': 'reject_friend',
			'original_user': original_user,
			'user_to_add' : user_to_add,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie de la demande de suppression d'ami
	delete_friend_request: function(friend_to_delete, original_user)
	{
		var message = {
			'command': 'delete_friend',
			'friend_to_delete': friend_to_delete,
			'original_user' : original_user,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie de la demande de deblocage d'ami
	unblock_friend_request: function(friend_to_unblock, original_user)
	{
		var message = {
			'command': 'unblock_friend',
			'user_to_add': friend_to_unblock,
			'original_user' : original_user,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie de la demande de demande de jeux pour PFC
	pfc_request: function(friend_to_play, original_user)
	{
		var message = {
			'command': 'pfc_request',
			'user_to_add': friend_to_play,
			'original_user' : original_user,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie de l'acceptation de partie de PFC
	accept_pfc_request: function(original_user, user_to_add)
	{
		var message = {
			'command': 'pfc_accepted',
			'original_user': original_user,
			'user_to_add' : user_to_add,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	// Envoie du refus de partie de PFC
	reject_pfc_request: function(original_user, user_to_add)
	{
		var message = {
			'command': 'pfc_rejected',
			'original_user': original_user,
			'user_to_add' : user_to_add,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	edit_profile_request: function(user_to_edit, new_username, new_avatar)
	{
		var message = {
			'command': 'edit_profile',
			'user_to_edit': user_to_edit,
			'new_username': new_username,
			'new_avatar': new_avatar,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	update_friend_request_and_block_list: function(user_to_edit, new_username)
	{
		var message = {
			'command': 'update_friend_request_and_block_list',
			'user_to_edit': user_to_edit,
			'new_username': new_username,
		}

		var messageJson = JSON.stringify(message);
		socket.system_socket.send(messageJson);
	},

	pong_finished: function(player2, winner, player1Score, player2Score)
	{
		var message = {
			'command': 'pong_finished',
			'player1': currentUser,
			'player2': player2,
			'winner': winner,
			'loser': 'player2',
			'player1Score': player1Score,
			'player2Score': player2Score,
		}

		var messageJson = JSON.stringify(message);
		socket.pong_socket.send(messageJson);
	},

	get_game_id: function(player, pfc_socket)
	{
		var message = {
			'player': player,
			'command': 'get_game_id'
		};
		pfc_socket.send(JSON.stringify(message));
	},

    timeout: function(player, pfc_socket)
	{
		var message = {
			'player': player,
			'command': 'timeout'
		};
		pfc_socket.send(JSON.stringify(message));
	},

	generate_game_id: function(player, pfc_socket)
	{
		var message = {
			'player': player,
			'command': 'generate_game_id'
		};
		pfc_socket.send(JSON.stringify(message));
	},

	ready: function(player, pfc_socket)
	{
		var message = {
			'player': player,
			'command': 'ready'
		};
		pfc_socket.send(JSON.stringify(message));
	},

	have_played: function(action, player, pfc_socket)
	{
		var message = {
			'command': 'have_played',
			'player': player,
			'action': action
		};
		pfc_socket.send(JSON.stringify(message));
	},

	stop_game: function(player, pfc_socket)
	{
		var message = {
			'command': 'stop_game',
			'player': player
		};
		pfc_socket.send(JSON.stringify(message));
	},

	join_queue: function(player)
	{
		var message = {
			'command': 'join_queue',
			'player_to_add_in_queue': player
		};
		socket.system_socket.send(JSON.stringify(message));
	},

	kick_queue: function(players)
	{
		var message = {
			'command': 'kick_queue',
			'players_to_kick': players
		};
		socket.system_socket.send(JSON.stringify(message));
	},

	find_match: function()
	{
		var message = {
			'command': 'find_match'
		};
		socket.system_socket.send(JSON.stringify(message));
	},

	edit_profile: function(user_to_edit, new_username)
	{
		var message = {
			'command': 'edit_profile',
			'user_to_edit': user_to_edit,
			'new_username': new_username,
		}
		socket.chat_socket.send(JSON.stringify(message));
	},
}
