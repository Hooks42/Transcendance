function listen_signin_btn()
{
	document.getElementById("signin-form").addEventListener("submit", function (event)
	{
		event.preventDefault();
		fetch("https://localhost/hello/", {
			method: "POST",
			body: new FormData(document.getElementById("signin-form")),
			headers: {
				'Accept': "application/json",
			},
		})
			.then((response) => response.json())

			.then((data) =>
			{
				if (data.signin_status == "success")
				{
					let signin_modal = document.getElementById('connexion-modal');
					if (!signin_modal)
						console.log("signin_modal not found");
					else
					{
						let bootstrapModal = bootstrap.Modal.getInstance(signin_modal);
						bootstrapModal.hide();
						signin_modal.remove();
					}

					clear_connexion_page();
					connected = true;
				}

				if (data.signin_status == "fail")
				{
					var errors = data.errors;
					let div = document.getElementById("signin-form");
					for (let id = 0; document.getElementById("error-#" + id); id++)
						document.getElementById("error-#" + id).remove();
					let id = 0;
					for (var key in errors)
					{
						if (errors.hasOwnProperty(key))
						{
							errors[key].forEach(function (error)
							{
								var errorDiv = document.createElement("div");
								errorDiv.id = "error-#" + id;
								if (error == "Saisissez une adresse de courriel valide.")
									errorDiv.textContent = 'Veuillez saisir une addresse email valide❌';
								else if (error == "Ce champ est obligatoire.")
									errorDiv.textContent = 'Veuillez saisir une addresse email ainsi qu\'un mot de passe pour vous connecter❌';
								else
									errorDiv.textContent = error;
								document.getElementById("signin-form").appendChild(errorDiv);
								id++;
							});
						}
					}
				}
			});
	});
}