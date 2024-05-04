const existing_chatContent = document.getElementById('nav-tabContent');
const existing_chatNav = document.getElementById('nav-tab');
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
/* ---------------------------------------------------------------------------
//
// CHAT OBJECT
//
--------------------------------------------------------------------------- */

const chat = {

    chat: document.getElementById("the-chat"),
    // elements in the chat navigation bar
    arrow_tab: null,
    disc_tab: null,
    user_tab: null,

    // elements in the chat content
    disc_pane: null,
    user_pane: null,
    chatroom: null,

    current_pane: null,

    create_content: function ()
    {
        //------------- DISC PANE------------------------------------------
        this.disc_pane = create_tab_pane();
        this.disc_pane.setAttribute('id', 'disc_pane');
        this.disc_pane.classList.add('show', 'active');
        const buf_pane1 = document.createElement('div');
        buf_pane1.classList.add('o-chat__ul');
        buf_pane1.setAttribute('id', 'chat-ul');

        //// loopable
        const disc1 = create_disc_li("Une discussion", lorem);
        const disc2 = create_disc_li("deuxio discussion", lorem);

        this.disc_pane.appendChild(buf_pane1);
        buf_pane1.append(disc1, disc2);

        //------------- USER PANE------------------------------------------

        this.user_pane = create_tab_pane();
        this.user_pane.setAttribute('id', 'user_pane');
        const buf_pane2 = document.createElement('div');
        buf_pane2.classList.add('o-chat__ul');

        //// loopable
        const user1 = create_user_in_pane("Un joueurrrrrrrrrrrrrrrrrrrrrrrr", "Son status");
        const user2 = create_user_in_pane("Un joueur", "Son status");

        this.user_pane.appendChild(buf_pane2);
        buf_pane2.append(user1, user2);

        //------------- CHATROOM PANE------------------------------------------

        this.chatroom = create_tab_pane();
        this.chatroom.classList.add('chatroom');

        const inbox = document.createElement('div');
        inbox.classList.add('o-inbox');

        //// loopable
        fetch('/get-general-conv-history')
            .then(response => response.json())
            .then(data => {
                let messages = data.messages;
                if (messages.length > 0)
                {
                    for (let i = 0; i < messages.length; i++)
                    {
                        var message = messages[i];
                        const msg_one = create_msg(message.username, message.timestamp, message.profile_picture);
                        const msg_text_one = create_msg_text();
                        msg_text_one.appendChild(document.createTextNode(message.content));
                        inbox.append(msg_one);
                        msg_one.appendChild(msg_text_one);
                    }
                }
            });

        const textarea = document.createElement('div');
        textarea.classList.add('o-textbox');
        const textarea_container = document.createElement('div');
        textarea_container.classList.add('container');

        const typing_area = document.createElement('textarea');
        typing_area.classList.add("m-textareaTag");
        typing_area.setAttribute('name', 'typing-area');
        typing_area.setAttribute('placeholder', 'Ecrire un message...');

        const btn_send = create_btn(['a-btn', '-orange', '-sm'], "ENVOYER");

        this.chatroom.append(inbox, textarea);

        // inbox.append(msg_one);
        // msg_one.appendChild(msg_text_one);

        textarea.append(textarea_container, btn_send);
        textarea_container.append(typing_area);

        // ACTIONS PANE------------------------------------------
        // const action_pane = create_tab_pane();
        // action_pane.setAttribute('id', 'action_pane');
        // action_pane.classList.add('o-chat__list');

        // const btn_add_friend = create_disc_li(" Ajouter comme ami ", "");
        // const btn_see_profile = create_disc_li(" Voir son profil ", "");
        // const btn_block = create_disc_li(" Bloquer ", "");

        // action_pane.append(btn_add_friend, btn_see_profile, btn_block);

        // content_el = { disc_pane, user_pane, chatroom, action_pane };
    },

    create_nav: function ()
    {
        this.disc_tab = create_navtab(" DISCUSSIONS ");
        this.disc_tab.setAttribute('id', 'discuss-btn');
        this.disc_tab.setAttribute('aria-selected', 'true');
        this.disc_tab.classList.add('active');
        this.disc_tab.setAttribute('data-bs-target', '#disc_pane');
        this.disc_tab.setAttribute('aria-controls', 'disc_pane');

        this.user_tab = create_navtab(" UTILISATEURS ");
        this.user_tab.setAttribute('id', 'user-btn');
        this.user_tab.setAttribute('data-bs-target', '#user_pane');
        this.user_tab.setAttribute('aria-controls', 'user_pane');

        this.arrow_tab = create_btn_arrow(" WHO WHAT ")
    },

    create: function ()
    {
        this.create_nav();
        this.create_content();
        this.disc_pane.onclick = chat.listener.onClickDiscPane.bind(this);
        this.arrow_tab.onclick = chat.listener.onClickArrowBtn.bind(this);
        this.user_pane.onclick = chat.listener.onClickUserPane.bind(this);
        this.chat.onclick = chat.listener.onClickChat.bind(this);
    },

    load_nav: function ()
    {
        if (this.disc_tab == null
            || this.user_tab == null
            || this.arrow_tab == null)
        {
            console.error("Could not load the chat's navigation bar. It must be created first.");
            return;
        }
        existing_chatNav.append(this.disc_tab);
        existing_chatNav.append(this.user_tab);
        existing_chatNav.append(this.arrow_tab);
    },

    load_content: function ()
    {
        if (this.disc_pane == null
            || this.user_pane == null
            || this.chatroom == null)
        {
            console.error("Could not load the chat's content. It must be created first.");
            return;
        }
        existing_chatContent.append(this.disc_pane);
        existing_chatContent.append(this.chatroom);
        existing_chatContent.append(this.user_pane);
    },

    load: function ()
    {
        this.load_nav();
        this.load_content();
    },

    get_active_pane: function ()
    {
        return (document.querySelector('.tab-pane.active.show'));
    }
}