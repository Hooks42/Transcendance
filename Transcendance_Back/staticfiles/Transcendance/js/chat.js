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

    create_disc_panel: function ()
    {
        this.disc_pane = create_tab_pane();
        this.disc_pane.setAttribute('id', 'disc_pane');
        this.disc_pane.classList.add('show', 'active');
        const buf_pane1 = document.createElement('div');
        buf_pane1.classList.add('o-chat__ul');
        buf_pane1.setAttribute('id', 'chat-ul');

        const general_disc = create_disc_li("Général", lorem);
        general_disc.setAttribute('id', 'General-disc');

        this.disc_pane.appendChild(buf_pane1);
        buf_pane1.appendChild(general_disc);

        fetch('/get-friends-list/')
            .then(response => response.json())
            .then(data => {
                let friends = data.friends;
                if (friends.length > 0)
                {
                    for (let i = 0; i < friends.length; i++)
                    {
                        var friend = friends[i];
                        this.add_disc_panel(friend.username);
                    }
                }
            });
    },

    add_disc_panel: function (disc_name)
    {
        const disc = create_disc_li(disc_name, lorem);
        this.disc_pane.children[0].appendChild(disc);
    },

    create_user_panel: function ()
    {
        this.user_pane = create_tab_pane();
        this.user_pane.setAttribute('id', 'user_pane');
        const buf_pane2 = document.createElement('div');
        buf_pane2.classList.add('o-chat__ul');
        this.user_pane.appendChild(buf_pane2);

        fetch('/get-friends-list/')
            .then(response => response.json())
            .then(data => {
                let friends = data.friends;
                if (friends.length > 0)
                {
                    for (let i = 0; i < friends.length; i++)
                    {
                        var friend = friends[i];
                        this.add_user_panel(friend.username, friend.status, friend.profile_picture);
                    }
                }
            });
    },

    add_user_panel: function (user_name, user_status, profile_picture)
    {
        const user = create_user_in_pane(user_name, user_status ? "En ligne" : "Hors ligne", profile_picture);
        this.user_pane.children[0].appendChild(user);
    },

    create_chatroom: function ()
    {
        this.chatroom = create_tab_pane();
        this.chatroom.classList.add('chatroom');

        const inbox = document.createElement('div');
        inbox.setAttribute('id', 'inbox');
        inbox.classList.add('o-inbox');

        const textarea = document.createElement('div');
        textarea.setAttribute('id', 'text-area');
        textarea.classList.add('o-textbox');
        const textarea_container = document.createElement('div');
        textarea_container.classList.add('container');

        fetch('/get-general-conv-history')
            .then(response => response.json())
            .then(data => {
                let messages = data.messages;
                if (messages.length > 0)
                {
                    for (let i = 0; i < messages.length; i++)
                    {
                        let message = messages[i];
                        this.add_chat(message.username, message.timestamp, message.content, message.profile_picture);
                    }
                }
            });

        const typing_area = document.createElement('textarea');
        typing_area.classList.add("m-textareaTag");
        typing_area.setAttribute('name', 'typing-area');
        typing_area.setAttribute('placeholder', 'Ecrire un message...');

        this.chatroom.append(inbox, textarea);

        if (socket.chat_socket != null)
        {
            const self = this;
            const btn_send = create_btn(['a-btn', '-orange', '-sm'], "ENVOYER");
            btn_send.addEventListener('click' , function ()
            {
                socket.sendMessage(typing_area.value, self.chat_socket);
                typing_area.value = '';

            });

            typing_area.addEventListener('keypress', function (e)
            {
                if (e.key === 'Enter')
                {
                    socket.sendMessage(typing_area.value, self.chat_socket);
                    typing_area.value = '';
                }
            });
            textarea.append(textarea_container, btn_send);
            textarea_container.append(typing_area);
        }
    },

    add_chat: function(username, timestamp, content, profile_picture)
    {
        const msg = create_msg(username, timestamp, profile_picture);
        const msg_text = create_msg_text();
        msg_text.appendChild(document.createTextNode(content));
        msg.appendChild(msg_text);
        this.chatroom.children[0].appendChild(msg);
    },


    create_content: function ()
    {
        this.create_disc_panel();
        this.create_user_panel();
        this.create_chatroom();
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
    },

    // launch_socket: function ()
    // {
    //     this.chat_socket = new WebSocket('wss://localhost/ws/chat/');

    //     this.chat_socket.onopen = function (e)
    //     {
    //         console.log('Socket opened');
    //         chat.create();
    //         chat.load();
    //         navbar.create();
    //         navbar.load();
    //     };

    //     this.chat_socket.onclose = function (e)
    //     {
    //         console.error('Socket closed');
    //     }

    //     this.chat_socket.onmessage = (event) => 
    //     {
    //         let data = JSON.parse(event.data);
    //         console.log("message recieved ---> " + data.message);
    //         console.log("profile_picture ---> " + data.profile_picture);
    //         chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture);
    //     };
    // }
}