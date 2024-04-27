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