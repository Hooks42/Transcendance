async function get_actual_user()
{
	return fetch('/get-actual-user/')
		.then(response => response.json())
		.then(data =>
		{
			if (data.username)
				return (data.username);
			else
				return (null);
		});
}

async function get_user_list()
{
	friend_list = [];
	block_list = [];
	return fetch('/get-user-lists/')
		.then(response => response.json())
		.then(data =>
		{
			if (data.friend_list)
				friend_list = data.friend_list;
			if (data.block_list)
				block_list = data.block_list;	
			return [friend_list, block_list];
		});
}