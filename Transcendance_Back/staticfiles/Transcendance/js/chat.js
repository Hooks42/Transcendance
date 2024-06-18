const existing_chatContent = document.getElementById('nav-tabContent');
const existing_chatNav = document.getElementById('nav-tab');
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
var priority = 100000;
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
    chatroom: [],

    current_pane: null,

    create_disc_panel: function ()
    {
        chat.disc_pane = create_tab_pane();
        chat.disc_pane.setAttribute('id', 'disc_pane');
        chat.disc_pane.classList.add('show', 'active');
        const buf_pane1 = document.createElement('div');
        buf_pane1.classList.add('o-chat__ul');
        buf_pane1.setAttribute('id', 'chat-ul');

        const general_disc = create_disc_li("Général", lorem);
        general_disc.setAttribute('id', 'General-disc');

        chat.disc_pane.appendChild(buf_pane1);
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
                        chat.add_disc_panel(friend.username);
                    }
                }
            });
    },

    add_disc_panel: function (disc_name)
    {
        const disc = create_disc_li(disc_name, lorem);
        chat.disc_pane.children[0].appendChild(disc);
    },

    create_user_panel: function ()
    {
        chat.user_pane = create_tab_pane();
        chat.user_pane.setAttribute('id', 'user_pane');
        const buf_pane2 = document.createElement('div');
        buf_pane2.classList.add('o-chat__ul');
        chat.user_pane.appendChild(buf_pane2);

        // menu deroulant (collapsible) pour liste des amis
		const coll_friend = create_collapsible('AMIS', "FRIEND");

		// menu deroulant pour liste des bloques
		const coll_blocked = create_collapsible('PERSONNES BLOQUEES', "BLOCKED");
		buf_pane2.append(coll_friend, coll_blocked);

        fetch('/get-friends-list/')
            .then(response => response.json())
            .then(data => {
                let friends = data.friends;
                if (friends.length > 0)
                {
                    for (let i = 0; i < friends.length; i++)
                    {
                        var friend = friends[i];
                        console.log("👊 friend vaut " + friend.username);
                        console.log("👊 friend_status vaut " + friend.status);
                        chat.add_user_panel(friend.username, friend.status, friend.profile_picture, "FRIEND");
                    }
                }
            });
        
        fetch('/get-block-list/')
            .then(response => response.json())
            .then(data => {
                let blocked = data.block_list;
                if (blocked.length > 0)
                {
                    for (let i = 0; i < blocked.length; i++)
                    {
                        var blocked_user = blocked[i];
                        chat.add_user_panel(blocked_user.username, blocked_user.status, blocked_user.profile_picture, "BLOCKED");
                    }
                }
            });
    },

    add_user_panel: function (user_name, user_status, profile_picture, which_list)
    {
        const user = create_user_in_pane(user_name, user_status, profile_picture, which_list);
        // chat.user_pane.children[0].appendChild(user);

		const li = document.createElement('li');
		li.classList.add('m-collapsible__item', '-chat', 'js-collapsible__item');
		li.append(user);

		// append the coll item on the coll btn
        let parent = null;
        if (which_list === "FRIEND")
            parent = document.getElementById("friend_list_toogle-btn");
        else if (which_list === "BLOCKED")
		    parent = document.getElementById("blocked_list_toogle-btn");
		parent.append(li);
    },

    load_conversation: function ()
    {
        chat.create_chatroom('General');
        fetch('/get-friends-list/')
            .then(response => response.json())
            .then(data => {
                let friends = data.friends;
                if (friends.length > 0)
                    for (let i = 0; i < friends.length; i++)
                        chat.create_chatroom(get_room_name(currentUser, friends[i].username));
            });
    },

    create_chatroom: function (chat_name)
    {
        // chatroom_exists = document.getElementById(chat_name + "-conv");
        // if (chatroom_exists)
        //     return;
        let tabpane = create_tab_pane();
        tabpane.classList.add('chatroom');
        tabpane.setAttribute('id', chat_name + "-conv");
        chat.chatroom.push(tabpane);

        const inbox = document.createElement('div');
        inbox.setAttribute('id', chat_name + '_inbox');
        inbox.classList.add('o-inbox');

        const textarea = document.createElement('div');
        textarea.setAttribute('id', 'text-area');
        textarea.classList.add('o-textbox');
        const textarea_container = document.createElement('div');
        textarea_container.classList.add('container');
        console.log("👊 chat_name vaut " + chat_name);

        fetch("/get-conv-history?conversation=" + chat_name)
            .then(response => response.json())
            .then(data => {
                let messages = data.messages;
                if (messages.length > 0)
                {
                    for (let i = 0; i < messages.length; i++)
                    {
                        var message = messages[i];
                        chat.add_chat(message.username, message.timestamp, message.content, message.profile_picture, inbox);
                    }
                }
            });

        const typing_area = document.createElement('textarea');
        typing_area.classList.add("m-textareaTag");
        typing_area.setAttribute('name', 'typing-area');
        typing_area.setAttribute('placeholder', 'Ecrire un message...');

        chat.chatroom[chat.chatroom.length - 1].appendChild(inbox);
        chat.chatroom[chat.chatroom.length - 1].appendChild(textarea);
            
        const btn_send = create_btn(['a-btn', '-orange', '-sm'], "ENVOYER");
        btn_send.setAttribute('id', chat_name + "-send_btn");
        btn_send.dataset.username = chat_name;
        btn_send.addEventListener('click' , function ()
        {
            btn_send.preventDefault();
            socket.sendMessage(typing_area.value, btn_send.dataset.username);
            typing_area.value = '';

        });

        typing_area.addEventListener('keypress', function (e)
        {
            if (e.key === 'Enter' && e.shiftKey)
            {
                e.preventDefault();  // Empêche le comportement par défaut
                const start = typing_area.selectionStart;
                const end = typing_area.selectionEnd;
                typing_area.value = typing_area.value.substring(0, start) + "\n" + typing_area.value.substring(end);
                typing_area.selectionStart = typing_area.selectionEnd = start + 1;
            }
            else if (e.key === 'Enter')
            {
                e.preventDefault();
                socket.sendMessage(typing_area.value, btn_send.dataset.username);
                typing_area.value = '';
            }
        });


        textarea.append(textarea_container, btn_send);
        textarea_container.append(typing_area);
        existing_chatContent.appendChild(chat.chatroom[chat.chatroom.length - 1]);
            // scroll automatically to the bottom of the inbox
        // inbox.scrollTo(0, inbox.scrollHeight);
        inbox.scrollTop = inbox.scrollHeight;
    },

    add_chat: function(username, timestamp, content, profile_picture, inbox, is_bot = false)
    {
        const msg = create_msg(username, timestamp, profile_picture, is_bot);
        const msg_text = create_msg_text();
        msg_text.appendChild(document.createTextNode(content));
        msg.classList.add('msg_div-' + username);
        if (block_list.includes(username))
            msg.classList.add('hide');
        msg.appendChild(msg_text);
        inbox.appendChild(msg);
        // scroll automatically to the bottom of the inbox
        inbox.scrollTop = inbox.scrollHeight;
    },


    create_content: function ()
    {
        chat.create_disc_panel();
        chat.create_user_panel();
        chat.load_conversation();
    },

    create_nav: function ()
    {
        chat.disc_tab = create_navtab(" DISCUSSIONS ");
        chat.disc_tab.setAttribute('id', 'discuss-btn');
        chat.disc_tab.setAttribute('aria-selected', 'true');
        chat.disc_tab.classList.add('active');
        chat.disc_tab.setAttribute('data-bs-target', '#disc_pane');
        chat.disc_tab.setAttribute('aria-controls', 'disc_pane');

        chat.user_tab = create_navtab(" UTILISATEURS ");
        chat.user_tab.setAttribute('id', 'user-btn');
        chat.user_tab.setAttribute('data-bs-target', '#user_pane');
        chat.user_tab.setAttribute('aria-controls', 'user_pane');

        chat.arrow_tab = create_btn_arrow(" WHO WHAT ")
    },

    create: function ()
    {
        chat.create_nav();
        chat.create_content();
        chat.arrow_tab.onclick = chat.listener.onClickArrowBtn.bind(this);
        chat.user_pane.onclick = chat.listener.onClickCollapsible.bind(this);
    },

    load_nav: function ()
    {
        if (chat.disc_tab == null
            || chat.user_tab == null
            || chat.arrow_tab == null)
        {
            console.error("Could not load the chat's navigation bar. It must be created first.");
            return;
        }
        existing_chatNav.append(chat.disc_tab);
        existing_chatNav.append(chat.user_tab);
        existing_chatNav.append(chat.arrow_tab);
    },

    load_content: function ()
    {
        if (chat.disc_pane == null
            || chat.user_pane == null
            || chat.chatroom == null)
        {
            console.error("Could not load the chat's content. It must be created first.");
            return;
        }
        existing_chatContent.append(chat.disc_pane);
        // console.log("La taille de chatroom est de " + chat.chatroom.length + " elements.");
        // for (let i = 0; i < chat.chatroom.length; i++)
        // {
        //     console.log("je passe ici " + (i + 1) + " fois");
        //     console.log("👊 chatroom vaut " + chat.chatroom[i]);
        //     existing_chatContent.append(chat.chatroom[i]);
        // }

        existing_chatContent.append(chat.user_pane);
    },

    load: function ()
    {
        chat.load_nav();
        chat.load_content();
    },

    get_active_pane: function ()
    {
        return (document.querySelector('.tab-pane.active.show'));
    },

    // launch_socket: function ()
    // {
    //     chat.chat_socket = new WebSocket('wss://localhost/ws/chat/');

    //     chat.chat_socket.onopen = function (e)
    //     {
    //         console.log('Socket opened');
    //         chat.create();
    //         chat.load();
    //         navbar.create();
    //         navbar.load();
    //     };

    //     chat.chat_socket.onclose = function (e)
    //     {
    //         console.error('Socket closed');
    //     }

    //     chat.chat_socket.onmessage = (event) => 
    //     {
    //         let data = JSON.parse(event.data);
    //         console.log("message recieved ---> " + data.message);
    //         console.log("profile_picture ---> " + data.profile_picture);
    //         chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture);
    //     };
    // }
}