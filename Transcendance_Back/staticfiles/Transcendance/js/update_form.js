function listen_update_btn()
{
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
				console.log("data: ", data);
				if (data.edit_status === "success")
				{
					console.log("✅ update profile success");
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