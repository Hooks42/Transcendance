async function listen_update_btn()
{
	let new_username = currentUser;
	let new_profile_picture = profile_picture;
	let has_changed = false;

	document.getElementById("edit-profile-form").addEventListener('submit', function (event)
	{
		event.preventDefault();
		fetch('https://localhost/hello/', {
			method: 'POST',
			body: new FormData(document.getElementById("edit-profile-form")),
			headers: {
				'Accept': 'application/json',
			},
		})

			.then((response => response.json()))

			.then((data) => 
			{
				let old_username = currentUser;
				let old_profile_picture = profile_picture;
				if (data.edit_status === "success")
				{
					fetch('/get-user-infos/')
						.then(response => response.json())
						.then(data =>
						{
							if (data.username)
							{
								if (data.username !== old_username)
									new_username = data.username;
								has_changed = true;
							}
							if (data.profile_picture)
							{
								if (data.profile_picture !== old_profile_picture)
									new_profile_picture = data.profile_picture;
								has_changed = true;
							}
							if (has_changed)
								send_msg.edit_profile_request(currentUser, new_username, new_profile_picture);
							let modal = document.getElementById('edit-profile-modal');
							let modal_instance = bootstrap.Modal.getInstance(modal);
							modal_instance.hide();
						});		
				}

				else if (data.edit_status === 'fail')
				{
					let errors = data.errors;
					let div = document.getElementById('edit-profile-form');
					for (let id = 0; document.getElementById('error-#' + id); id++)
						document.getElementById('error-#' + id).remove();
					let id = 0;
					for (var key in errors)
					{
						if (errors.hasOwnProperty(key))
						{
							errors[key].forEach(function (error)
							{
								let error_div = document.createElement('div');
								error_div.id = 'error-#' + id;
								error_div.textContent = error;
								document.getElementById('edit-profile-form').appendChild(error_div);
							});
						}
						id++;
					}

				}
			})
	});
}

function listen_toggle_btn()
{
	let toggle_btn = Array.from(document.getElementsByClassName('profile_toggle_btn'));
	let toggle_lists = Array.from(document.getElementsByClassName('profile_toggle_list'));

	for (let i = 0; i < toggle_lists.length; i++)
		toggle_lists[i].style.display = 'none';

	for (let i = 0; i < toggle_btn.length; i++)
	{
		toggle_btn[i].addEventListener('click', function ()
		{
			if (toggle_lists[i].style.display === 'none')
				toggle_lists[i].style.display = 'block';
			else
				toggle_lists[i].style.display = 'none';
		});
	}
}