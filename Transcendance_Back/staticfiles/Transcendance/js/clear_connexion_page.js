function clear_connexion_page()
{
	let log_div = document.getElementById('log-div');
	log_div.remove();
	load_navbar();
	load_tabnav();
	load_tabcontent();
}