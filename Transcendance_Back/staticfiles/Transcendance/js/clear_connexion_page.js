function clear_connexion_page()
{
	let log_div = document.getElementById('log-div');
	log_div.remove();
	socket.launch_socket();
}