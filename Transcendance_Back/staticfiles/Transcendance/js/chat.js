const lorem = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas nemo eum, earum sunt, nobis similique quisquam eveniet pariatur commodi modi";

///////////////////////////////////////////////////////////////////////////
///////////////////////// CHAT OBJECT //////////////////////////////////
///////////////////////////////////////////////////////////////////////////
const chat = {

    // elements in the chat navigation bar
    arrow_tab: null,
    disc_tab: null,
    user_tab: null,

    // elements in the chat content
    disc_pane: null,
    user_pane: null,
    chatroom: null,

    current_pane: null,

    create_tabcontent: function ()
    {
        // DISC PANE------------------------------------------
        this.disc_pane = create_tab_pane();
        this.disc_pane.setAttribute('id', 'disc_pane');
        this.disc_pane.classList.add('show', 'active');
        const buf_pane1 = document.createElement('div');
        buf_pane1.classList.add('chat__list');

        // loopable
        const disc1 = create_btn_heart_list("Une discussion", lorem);
        const disc2= create_btn_heart_list("deuxio discussion", lorem);

        this.disc_pane.appendChild(buf_pane1);
        buf_pane1.append(disc1, disc2);

        // USERS PANE------------------------------------------

        this.user_pane = create_tab_pane();
        this.user_pane.setAttribute('id', 'user_pane');
        const buf_pane2 = document.createElement('div');
        buf_pane2.classList.add('chat__list');

        // loopable
        const user_one = create_user_in_pane("Un joueurrrrrrrrrrrrrrrrrrrrrrrr", "Son status");
        const user_two = create_user_in_pane("Un joueur", "Son status");

        this.user_pane.appendChild(buf_pane2);
        buf_pane2.append(user_one, user_two);

        // CHATROOM PANE-------------------------------------------

        this.chatroom = create_tab_pane();
        this.chatroom.setAttribute('id', 'chatroom-tab')
        this.chatroom.classList.add('chatroom');

        const inbox = document.createElement('div');
        inbox.classList.add('inbox');

        // loopable
        const msg_one = create_msg("Dragon", "18h45");
        const msg_text_one = create_msg_text();
        msg_text_one.appendChild(document.createTextNode(lorem));

        const textarea = document.createElement('div');
        textarea.classList.add('textarea');
        const textarea_container = document.createElement('div');
        textarea_container.classList.add('container');

        const typing_area = document.createElement('textarea');
        typing_area.setAttribute('name', 'typing-area');
        typing_area.setAttribute('placeholder', 'Ecrire un message...');

        const btn_send = create_btn(['btn-orange', 'btn-orange--sm'], "ENVOYER");

        this.chatroom.append(inbox, textarea);

        inbox.append(msg_one);
        msg_one.appendChild(msg_text_one);

        textarea.append(textarea_container, btn_send);
        textarea_container.append(typing_area);

        // ACTIONS PANE------------------------------------------
        // const action_pane = create_tab_pane();
        // action_pane.setAttribute('id', 'action_pane');
        // action_pane.classList.add('chat__list');

        // const btn_add_friend = create_btn_heart_list(" Ajouter comme ami ", "");
        // const btn_see_profile = create_btn_heart_list(" Voir son profil ", "");
        // const btn_block = create_btn_heart_list(" Bloquer ", "");

        // action_pane.append(btn_add_friend, btn_see_profile, btn_block);

        // tabcontent_el = { disc_pane, user_pane, chatroom, action_pane };
    },

    create_chatnav: function ()
    {
        this.disc_tab = create_navtab(" DISCUSSIONS ");
        this.disc_tab.setAttribute('aria-selected', 'true');
        this.disc_tab.classList.add('active');
        this.disc_tab.setAttribute('data-bs-target', '#disc_pane');
        this.disc_tab.setAttribute('aria-controls', 'disc_pane');

        this.user_tab = create_navtab(" UTILISATEURS ");
        this.user_tab.setAttribute('data-bs-target', '#user_pane');
        this.user_tab.setAttribute('aria-controls', 'user_pane');

        this.arrow_tab = create_btn_arrow(" WHO WHAT ")
    },

    create_chat: function ()
    {
        this.create_chatnav();
        this.create_tabcontent();
        this.disc_pane.onclick = chat.listener.onClickDiscPane.bind(this);
        this.arrow_tab.onclick = chat.listener.onClickArrowBtn.bind(this);
        this.user_pane.onclick = chat.listener.onClickUserPane.bind(this);
    },

    load_chatnav: function ()
    {
        if (this.disc_tab == null
            || this.user_tab == null
            || this.arrow_tab == null)
        {
            console.error("Could not load the chat's navigation bar. It must be created first.");
            return;
        }
        document.getElementById('nav-tab').append(this.disc_tab);
        document.getElementById('nav-tab').append(this.user_tab);
        document.getElementById('nav-tab').append(this.arrow_tab);
    },

    load_tabcontent: function ()
    {
        if (this.disc_pane == null
            || this.user_pane == null
            || this.chatroom == null)
        {
            console.error("Could not load the chat's content. It must be created first.");
            return;
        }
        document.getElementById("nav-tabContent").append(this.disc_pane);
        document.getElementById("nav-tabContent").append(this.chatroom);
        document.getElementById("nav-tabContent").append(this.user_pane);
    },

    load_chat: function ()
    {
        this.load_chatnav();
        this.load_tabcontent();
    },

    get_active_pane: function ()
    {
        return (document.querySelector('.tab-pane.active.show'));
    }
}