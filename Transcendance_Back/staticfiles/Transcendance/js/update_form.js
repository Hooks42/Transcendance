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

	document.getElementById('yes-del-btn').addEventListener('click', function ()
	{
		send_msg.delete_profile_request(currentUser);
	});
}

function listen_toggle_btn()
{
    let btns = document.getElementsByClassName('profile_toggle_btn');
	let pong_things = document.getElementsByClassName('profile_toggle_pong');
	let pfc_things = document.getElementsByClassName('profile_toggle_pfc');

	for (let i = 0; i < btns.length; i++)
	{
		if (i === 0)
		{
			btns[i].addEventListener('click', function ()
			{
				for (let j = 0; j < pong_things.length; j++)
				{
					if (pong_things[j].classList.contains('hide'))
					{
						pong_things[j].classList.remove('hide');
						pong_things[j].classList.add('unhide');
					}
					else if (pong_things[j].classList.contains('unhide'))
					{
						pong_things[j].classList.add('hide');
						pong_things[j].classList.remove('unhide');
					}
				}
					
			});
		}
		else if (i === 1)
		{
			btns[i].addEventListener('click', function ()
			{
				for (let j = 0; j < pfc_things.length; j++)
				{
					if (pfc_things[j].classList.contains('hide'))
					{
						pfc_things[j].classList.remove('hide');
						pfc_things[j].classList.add('unhide');
					}
					else if (pfc_things[j].classList.contains('unhide'))
					{
						pfc_things[j].classList.add('hide');
						pfc_things[j].classList.remove('unhide');
					}
				}
			});
		}
	}
}