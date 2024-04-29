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
			document.documentElement.innerHTML = login_page_html;
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
