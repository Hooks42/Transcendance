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
	}

}