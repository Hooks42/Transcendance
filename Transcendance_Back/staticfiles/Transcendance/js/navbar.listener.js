navbar.listener = {
    onClickBtnHome: function (event)
    {
        event.preventDefault();

        let page = navbar.btn_home.getAttribute("href").substring(1);
        console.log("click on " + page);
        navigateCenterZone(page);
    },

    // this trigger the modal for a successful connection
    // TODO: change its behavior to an actual log out
    onClickBtnLogout: function ()
    {
        fetch('/logout/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Accept': 'application/json'
            }
            
        })
        .then(data =>
        {
            if (data.logout_status === 'fail')
                console.log('logout failed');
            else
            {
                display_login_page();
            }
        });
    },

    onClickBtnProfile: function ()
    {
        let main_div = document.getElementById('main-div');
        if (main_div.children.length > 0)
            for (let i = 0; i < main_div.children.length; i++)
                main_div.children[i].remove();
        display_profile_page();
    }
}