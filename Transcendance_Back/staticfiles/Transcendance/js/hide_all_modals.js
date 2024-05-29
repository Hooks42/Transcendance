function hide_all_modals()
{
        console.log("click hide modals");
        const ep_modal = document.getElementById('edit-profile-modal');
        const pong_modal = document.getElementById('pong-modal');
        if (ep_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(edit_profile).hide();
        if (pong_modal != undefined)
                bootstrap.Modal.getOrCreateInstance(tournament).hide();
}