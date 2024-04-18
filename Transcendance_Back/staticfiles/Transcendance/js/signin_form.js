document.getElementById('signin_form').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch ('https://localhost/hello/', {
        method: 'POST',
        body: new FormData(document.getElementById('signin_form')),
        headers: {
            'Accept': 'application/json',
        }
    })
    
    .then(response => response.json())

    .then(data => {
        console.log(data);

        if (data.signin_status == 'success')
        {
            var signin_div = document.getElementById('signin_div');
            signin_div.remove();
        }

        if (data.signin_status == 'fail') {
            var errors = data.errors;
            for (var key in errors) {
                if (errors.hasOwnProperty(key)) {
                    errors[key].forEach(function(error) {
                        var errorDiv = document.createElement('div');
                        errorDiv.textContent = error;
                        document.getElementById('signin_form').appendChild(errorDiv);
                    });
                }
            }
        }
    });
});