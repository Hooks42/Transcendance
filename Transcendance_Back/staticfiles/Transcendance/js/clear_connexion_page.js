function clear_connexion_page()
{
	let log_div = document.getElementById('log-div');
	log_div.remove();
	chat.create();
	chat.load()
	navbar.create();
	navbar.load();
	// load_navbar();
	// load_tabnav();
	// load_tabcontent();
}