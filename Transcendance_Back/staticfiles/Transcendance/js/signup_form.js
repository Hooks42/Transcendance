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

            if (data.signup_status == 'success') {
                let signup_modal = document.getElementById('signup-modal');
                let bootstrapModal = bootstrap.Modal.getInstance(signup_modal);
                bootstrapModal.hide();
                signup_modal.remove();

                let log_div = document.getElementById('log-div');
                log_div.remove();



                create_navbar();
                load_navbar();
                //create_tabnav();
                //create_tabcontent();
                //load_tabcontent();
                //load_tabnav();
            }

            if (data.signup_status == 'fail') {
                var errors = data.errors;
                let div = document.getElementById('signup_form');
                for (let id = 0; document.getElementById('error-#' + id); id++)
                    document.getElementById('error-#' + id).remove();
                let id = 0;
                for (var key in errors) {
                
                    if (errors.hasOwnProperty(key)) {
                        errors[key].forEach(function (error)
                        {
                            var errorDiv = document.createElement('div');
                            errorDiv.id = 'error-#' + id;
                            errorDiv.textContent = error;
                            document.getElementById('signup_form').appendChild(errorDiv);
                        });
                    }
                    id++;
                }
            }
        });
});