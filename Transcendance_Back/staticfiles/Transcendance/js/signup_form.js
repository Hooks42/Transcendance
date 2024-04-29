function listen_signup_btn()
{
    document.getElementById('signup_form').addEventListener('submit', function (event)
    {
        event.preventDefault();
        fetch('https://localhost/hello/', {
            method: 'POST',
            body: new FormData(document.getElementById('signup_form')),
            headers: {
                'Accept': 'application/json',
            }
        })

            .then(response => response.json())

            .then(data =>
            {
                console.log(data);

                if (data.signup_status == 'success')
                {
                    let signup_modal = document.getElementById('signup-modal');
                    let bootstrapModal = bootstrap.Modal.getInstance(signup_modal);
                    bootstrapModal.hide();
                    signup_modal.remove();

                    clear_connexion_page();
                    connected = true;
                }

                if (data.signup_status == 'fail')
                {
                    var errors = data.errors;
                    let div = document.getElementById('signup_form');
                    for (let id = 0; document.getElementById('error-#' + id); id++)
                        document.getElementById('error-#' + id).remove();
                    let id = 0;
                    for (var key in errors)
                    {

                        if (errors.hasOwnProperty(key))
                        {
                            errors[key].forEach(function (error)
                            {
                                console.log('key -->' + key + ' error -->' + error);
                                var errorDiv = document.createElement('div');
                                errorDiv.id = 'error-#' + id;
                                if (key == 'username' && error == 'Ce champ est obligatoire.')
                                    errorDiv.textContent = 'Veuillez saisir un nom d\'utilisateur❌';
                                else if (key == 'password' && error == 'Ce champ est obligatoire.')
                                    errorDiv.textContent = 'Veuillez saisir un mot de passe❌';
                                else if (key == 'confirm_password' && error == 'Ce champ est obligatoire.')
                                    errorDiv.textContent = 'Veuillez confirmer votre mot de passe❌';
                                else if (key == 'email' && error == 'Ce champ est obligatoire.')
                                    errorDiv.textContent = 'Veuillez saisir une addresse email❌';
                                else if (key == 'email' && error == 'Saisissez une adresse de courriel valide.')
                                    errorDiv.textContent = 'Veuillez saisir une addresse email valide❌';
                                else
                                    errorDiv.textContent = error;
                                document.getElementById('signup_form').appendChild(errorDiv);
                            });
                        }
                        id++;
                    }
                }
            });
    });
}