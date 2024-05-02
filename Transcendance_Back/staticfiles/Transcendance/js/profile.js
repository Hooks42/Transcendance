
const existing_main = document.getElementsByClassName('centerZone')[0].children[0];

// existing_main.append(create_btn_setn("btn-set1"));
// existing_main.append(create_btn_setn("btn-set2"));
// existing_main.append(create_btn_setn("btn-set3"));

const profile =
{
    wrapper: null,

    // every clickable elements
    coll_friend: null,
    coll_blocked: null,
    coll_history: null,

    // create: function ()
    // {
    //     if (this.wrapper != null)
    //         return;
    //     this.wrapper = create_wrapper_profile();

    //     // const wrapper_coll = document.createElement('div');
    //     // wrapper_coll.classList.add('wrapper_collapsibles');

    //     this.coll_friend = create_profile_collapsible("AMIS (nb)", create_friend_btns);
    //     this.coll_blocked = create_profile_collapsible("PERSONNES BLOQUEES (nb)", create_blocked_btns);
    //     this.coll_history = create_profile_collapsible("HISTORIQUE", 0);

    //     // wrapper_coll.append(this.coll_friend, this.coll_blocked, this.coll_history);
    //     // this.wrapper.append(wrapper_coll);
    //     this.wrapper.append(this.coll_friend, this.coll_blocked, this.coll_history);

    // },

    // load: function ()
    // {
    //     if (this.wrapper == null)
    //     {
    //         console.error("could not load the user profile because the HTML elements have not been created");
    //         return;
    //     }
    //     existing_main.append(this.wrapper);
    // },
    listen: function ()
    {
        // event listeners
        if (this.wrapper == null)
        {
            this.wrapper = existing_main;
        }
        this.wrapper.onclick = profile.listener.onClickCollapsible.bind(this);
    }

};