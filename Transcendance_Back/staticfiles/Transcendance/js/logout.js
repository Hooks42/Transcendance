function getCookie(name)
{
	let cookieValue = null;
	if (document.cookie && document.cookie !== '')
	{
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++)
		{
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '='))
			{
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}


async function display_login_page()
{
	fetch('/login-page/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		}
	})
		.then(response => response.json())
		.then(data =>
		{
			let login_page_html = data.login_page_html;
			

			let list = [];
			let discuss_btn = document.getElementById('discuss-btn');
			let user_btn = document.getElementById('user-btn');
			let disc_pane = document.getElementById('disc_pane');
			let tabpanel = document.getElementById('tabpanel');
			let user_pane = document.getElementById('user_pane');
			let navbar_icons = document.getElementById('navbar-icons');
			let arrow_btn = document.getElementById('arrow-btn');
			let inbox = document.getElementById('active-pane');
			let text_area = document.getElementById('text-area');

	
			list.push(arrow_btn, inbox, text_area, discuss_btn, disc_pane, tabpanel, user_pane, inbox, user_btn, navbar_icons);
			list.forEach((elem) =>
			{
				if (elem)
					elem.remove();
			});


			let main_div = document.getElementById('main-div');
			main_div.innerHTML = login_page_html;
			listen_log_btn();
		})
		.catch(error => console.log('error', error));
}



function listen_logout(logout_btn)
{
	logout_btn.addEventListener('click', function ()
	{
		fetch('/logout/', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
				'Accept': 'application/json'
			}
			
		}).then(data =>
		{
			if (data.logout_status === 'fail')
				console.log('logout failed');
			else
			{
				display_login_page();
			}
		});
	});
}
