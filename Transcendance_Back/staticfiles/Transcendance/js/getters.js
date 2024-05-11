async function get_user_infos(username = null)
{
	//console.log("get_user_infos called with username: " + username);
	let url = '/get-user-infos';
	if (!username)
		url = url + "?username=" + username;
	return fetch(url)
		.then(response => response.json())
		.then(data =>
		{
			if (data)
				return (data);
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

