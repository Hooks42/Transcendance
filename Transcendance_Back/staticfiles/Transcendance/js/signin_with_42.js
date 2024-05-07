var current_user = null;

function listen_42_btn()
{
	document.getElementById('signin-42-btn').addEventListener('click', function ()
	{
		let popupWindow = window.open("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8bb20f850854bdd9328693e91af550746179e66027373d8195e08e66afbd5e80&redirect_uri=https%3A%2F%2Flocalhost%2Fcallback&response_type=code", "popupWindow", "width=600,height=600");
		let checkClosingPopup = setInterval(function ()
		{
			get_actual_user().then(user =>
			{
				if (user)
				{
					current_user = user;
					clearInterval(checkClosingPopup);
					clear_connexion_page();
					connected = true;
				}
			});
		}, 1000);
	});
}