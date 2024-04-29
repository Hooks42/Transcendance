const lorem = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas nemo eum, earum sunt, nobis similique quisquam eveniet pariatur commodi modi";
// const chat = document.getElementById("the-chat");

function create_nav_tab(text)
{
    const button = create_btn(['btn-nav'], text);
    button.setAttribute('data-bs-toggle', 'tab');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', 'false');
    return (button);
}

function create_btn_arrow(text)
{
    const button = create_btn(['btn-arrow', 'hide'], "");

    const svg = create_svg(['bi', 'bi-arrow-left-short']);
    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5');
    svg.appendChild(path);
    const arrow_span = document.createElement('span');
    arrow_span.classList.add('btn-arrow__title');
    arrow_span.appendChild(document.createTextNode(text));
    button.append(svg, arrow_span);
    return (button);
}

// NAV-----------------------------------------------------
function create_tabnav()
{
    console.log("create_tabnav");
    const disc_tab = create_nav_tab(" DISCUSSIONS ");
    disc_tab.setAttribute('aria-selected', 'true');
    disc_tab.classList.add('active');
    disc_tab.setAttribute('data-bs-target', '#disc_pane');
    disc_tab.setAttribute('aria-controls', 'disc_pane');

    const user_tab = create_nav_tab(" UTILISATEURS ");
    user_tab.setAttribute('data-bs-target', '#user_pane');
    user_tab.setAttribute('aria-controls', 'user_pane');

    const arrow_tab = create_btn_arrow(" WHO WHAT ")
    return {disc_tab, user_tab, arrow_tab};
}
function load_tabnav()
{
    const nav_tab = document.getElementById('nav-tab');

    const { disc_tab, user_tab, arrow_tab } = create_tabnav();

    nav_tab.append(disc_tab, user_tab, arrow_tab);
}
// TAB CONTENT-----------------------------------------------------
function create_tab_pane()
{
    const div = document.createElement('div');
    div.classList.add('tab-pane');
    div.setAttribute('role', 'tabpanel');
    div.setAttribute('tabindex', 0);

    return (div);
}

function create_btn_heart_list(title_text, info_text)
{
    const button = create_btn(['btn-heart-list'], "");
    const title = document.createElement('span');
    title.classList.add('list__title');
    title.appendChild(document.createTextNode(title_text));

    const info = document.createElement('span');
    info.classList.add('list__info');
    info.appendChild(document.createTextNode(info_text));
    button.append(create_svg_heart(), title, info);
    return (button);
}

function create_msg(name_text, time_text)
{
    const msg = document.createElement('div');
    msg.classList.add('message');
    const senderDiv = document.createElement('div');
    senderDiv.classList.add('sender');

    const btn_img = document.createElement('button');
    btn_img.setAttribute('type', 'button');
    btn_img.classList.add('btn-img');

    const img = document.createElement('img');
    img.classList.add('sender__img');
    img.setAttribute('src', './assets/user.jpg');

    const sender_name = document.createElement('p');
    sender_name.classList.add('sender__name');
    sender_name.textContent = name_text;

    const timestamp = document.createElement('p');
    timestamp.classList.add('message__timestamp');
    timestamp.textContent = time_text;

    // Arborescence
    msg.appendChild(senderDiv);
    senderDiv.append(btn_img, sender_name, timestamp);
    btn_img.appendChild(img);
    return (msg);
}

function create_msg_text()
{
    const p = document.createElement('p');
    p.classList.add('message__text');
    return (p);
}


// DISCUSSIONS PANE ------------------------------------------
function create_tabcontent()
{
    const disc_pane = create_tab_pane();
    disc_pane.classList.add('chat__list', 'show', 'active');
    disc_pane.setAttribute('id', 'disc_pane');

    // loopable
    const disc_general = create_btn_heart_list("General", lorem);

    // USERS PANE------------------------------------------

    const user_pane = create_tab_pane();
    user_pane.classList.add('chat__list');
    user_pane.setAttribute('id', 'user_pane');

    disc_pane.append(disc_general);

    // loopable
    const user_one = create_btn_heart_list("Un joueur", "Son statut");

    user_pane.append(user_one);

    // CHATROOM PANE-------------------------------------------

    const chatroom = create_tab_pane();
    chatroom.classList.add('chatroom');
    chatroom.setAttribute('id', 'chatroom-tab')

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

    chatroom.append(inbox, textarea);

    inbox.append(msg_one);
    msg_one.appendChild(msg_text_one);

    textarea.append(textarea_container, btn_send);
    textarea_container.append(typing_area);

    // ACTIONS PANE------------------------------------------
    const action_pane = create_tab_pane();
    action_pane.classList.add('chat__list');
    action_pane.setAttribute('id', 'action_pane');

    const btn_add_friend = create_btn_heart_list(" Ajouter comme ami ", "");
    const btn_see_profile = create_btn_heart_list(" Voir son profil ", "");
    const btn_block = create_btn_heart_list(" Bloquer ", "");

    action_pane.append(btn_add_friend, btn_see_profile, btn_block);

    return {disc_pane, user_pane, chatroom, action_pane};
    // Arborescence
}
function load_tabcontent()
{
    const tab_content = document.getElementById("nav-tabContent");
    const { disc_pane, user_pane, chatroom, action_pane } = create_tabcontent();
    tab_content.append(disc_pane, user_pane, chatroom, action_pane);
}