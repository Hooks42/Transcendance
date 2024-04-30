function create_navtab(text)
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
    const button = create_btn(['btn_list', 'btn-heart-list'], "");
    const title = document.createElement('span');
    title.classList.add('list__title');
    title.appendChild(document.createTextNode(title_text));

    const info = document.createElement('span');
    info.classList.add('list__info');
    info.appendChild(document.createTextNode(info_text));
    button.append(create_svg_heart(), title, info);
    return (button);
}

function create_btn_img(img_class, img_path)
{

    const btn_img = document.createElement('button');
    btn_img.setAttribute('type', 'button');
    btn_img.classList.add('btn-img');

    const img = document.createElement('img');
    img.classList.add(img_class);
    img.setAttribute('src', img_path);

    btn_img.appendChild(img);
    return (btn_img);
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

function create_user_in_pane(username, userstatus)
{
    const button = create_btn(['btn_list', 'btn_user_list'], "");


    const btn_img = create_btn_img(['sender__img'], "./assets/user.jpg");

    const title = document.createElement('span');
    title.classList.add('user__name');
    title.appendChild(document.createTextNode(username));

    const info = document.createElement('span');
    info.classList.add('user__status');
    info.appendChild(document.createTextNode(userstatus));

    const btns = create_btn_set1();
    button.append(btn_img, title, info, btns);
    return (button);
}

function create_svg(classes)
{
    const svg = document.createElementNS(svgns, 'svg');
    classes.forEach(element =>
    {
        svg.classList.add(element);
    });
    svg.setAttribute('xmlns', svgns);
    svg.setAttribute('viewBox', '0 0 16 16');
    return (svg);
}

function create_btn(classes, text)
{

    const button = document.createElement('button');
    classes.forEach(element =>
    {
        button.classList.add(element);
    });
    button.setAttribute('type', 'button');
    button.appendChild(document.createTextNode(text));
    return (button);
}

function create_dropdown_menu()
{
    const dropdown_menu = document.createElement('ul');
    dropdown_menu.classList.add('dropdown-menu', 'dropdown-menu-end');
    dropdown_menu.setAttribute('aria-labelledby', 'navbarDropdownMenuLink');
    return (dropdown_menu);
}

function create_nav_link(id)
{
    const nav_link = document.createElement('a');
    nav_link.classList.add('nav-link', 'dropdown-toggle', 'caret-off');
    nav_link.setAttribute('href', '#');
    nav_link.setAttribute('role', 'button');
    nav_link.setAttribute('id', id);
    nav_link.setAttribute('data-bs-toggle', 'dropdown');
    nav_link.setAttribute('aria-expanded', 'false');
    return (nav_link);
}

function create_svg_three_dots()
{
    const three_dots_svg = create_svg(['bi', 'bi-three-dots-vertical']);

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0');
    three_dots_svg.appendChild(path);
    return (three_dots_svg);
}

function create_svg_heart()
{
    const heart_svg = create_svg(['bi', 'bi-heart-fill']);

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314');
    heart_svg.appendChild(path);
    return (heart_svg);
}

function create_svg_person()
{
    const person_svg = create_svg(['bi', 'bi-person-fill']);

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('d', 'M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6');
    person_svg.appendChild(path);
    return (person_svg);
}

function create_svg_bell()
{
    const bell_svg = create_svg(['bi', 'bi-bell-fill']);

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('d', "M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901");
    bell_svg.appendChild(path);
    return (bell_svg);
}

function create_notif()
{
    const notif = document.createElement('div');
    notif.classList.add('notif');

    create_svg_circle(notif);
    const span_usersame = document.createElement('span');
    span_usersame.classList.add('get_username');
    span_usersame.textContent = 'uuuuuuuuuuuuuuuuuuuuuuuusername';

    const span_game = document.createElement('span');
    span_game.classList.add('get_game');
    span_game.textContent = 'jeu';

    const wrapper__btn_notif = document.createElement('div');
    wrapper__btn_notif.classList.add('wrapper__btn-notif');

    const btn_refuser = create_btn_heart_sm(" Refuser ");
    const btn_accepter = create_btn_heart_sm(" Accepter ");

    const btn_three_dots = document.createElement('button');
    btn_three_dots.classList.add('btn-three-dots');
    btn_three_dots.appendChild(create_svg_three_dots());

    // Construction de l'arborescence des éléments
    wrapper__btn_notif.append(btn_refuser, btn_accepter, btn_three_dots);

    notif.appendChild(create_svg_circle());
    notif.appendChild(span_usersame);
    notif.appendChild(document.createTextNode(' vous défie au '));
    notif.appendChild(span_game);
    notif.appendChild(wrapper__btn_notif);

    return (notif);
}

function create_btn_heart_sm(text)
{
    const button = create_btn(['btn-heart', 'btn-heart-sm'], text);
    button.prepend(create_svg_heart());
    return (button);
}

function create_svg_circle()
{
    const circle_svg = document.createElementNS(svgns, 'svg');
    circle_svg.classList.add('bi', 'bi-circle-fill');
    circle_svg.setAttribute('xmlns', svgns);
    circle_svg.setAttribute('viewBox', '0 0 16 16');
    const circle = document.createElementNS(svgns, 'circle');
    circle.setAttribute('cx', '8');
    circle.setAttribute('cy', '8');
    circle.setAttribute('r', '8');
    circle_svg.appendChild(circle);
    return (circle_svg);
}