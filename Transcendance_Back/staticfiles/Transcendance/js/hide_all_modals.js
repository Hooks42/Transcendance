function hide_all_modals()
{
        console.log("click hide modals");
        const ep_modal = document.getElementById('edit-profile-modal');
        const tournament_modal = document.getElementById('tournament-modal');
        if (ep_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(ep_modal).hide();
        if (tournament_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(tournament_modal).hide();
}