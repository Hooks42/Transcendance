var currentUser = null;
var profile_picture = null;
var friend_list = [];
var block_list = [];

async function clear_connexion_page()
{
	const user = await get_user_infos();
	if (user.username)
	{
		currentUser = user.username;
		if (user.profile_picture)
			profile_picture = user.profile_picture;
		const lists = await get_user_list();
		friend_list = lists[0];
		block_list = lists[1];
	}
	console.log("current user ---> " + currentUser);
	console.log("profile_picture ---> " + profile_picture);
	console.log("friend_list ---> " + friend_list);
	console.log("block_list ---> " + block_list);
	let log_div = document.getElementById('log-div');
	if (log_div)
		log_div.remove();
	socket.launch_socket();
}