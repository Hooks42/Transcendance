function hide_all_modals()
{
        console.log("click hide modals");
        const ep_modal = document.getElementById('edit-profile-modal');
        const tournament_modal = document.getElementById('tournament-modal');
        const signin_ft_modal = document.getElementById('connexion-ft-modal');
        const signup_modal = document.getElementById('create-account-modal');
        const signin_modal = document.getElementById('connexion-modal');
        if (ep_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(ep_modal).hide();
        if (tournament_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(tournament_modal).hide();
        if (signin_ft_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(signin_ft_modal).hide();
        if (signin_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(signin_modal).hide();
        if (signup_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(signup_modal).hide();
}