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