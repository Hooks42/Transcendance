function clear_connexion_page()
{
	let log_div = document.getElementById('log-div');
	log_div.remove();
	chat.create();
	chat.load()
	console.log("chat created");
	navbar.create();
	navbar.load();
}