function create_wrapper_profile()
{
    const wp = document.createElement('div');
    wp.classList.add('wrapper_profile');
    const profile_edit = create_profile_edit();

    wp.append(profile_edit);

    return (wp);
}

function create_profile_edit()
{
    const pe = document.createElement('div');
    pe.classList.add('profile__edit');

    const btn_img = create_btn_img("profile__pic", "./assets/user.jpg");

    const input_username = document.createElement('input');
    input_username.setAttribute('type', 'text');
    input_username.setAttribute('value', 'MyUsername');
    input_username.setAttribute('placeholder', "Nom d'utilisateur");
    input_username.classList.add('profile__input');

    const input_email = document.createElement('input');
    input_email.setAttribute('type', 'text');
    input_email.setAttribute('value', 'adresse@email.com');
    input_email.setAttribute('placeholder', "Adresse email");
    input_email.classList.add('profile__input');

    const input_pw = document.createElement('input');
    input_pw.setAttribute('type', 'password');
    input_pw.setAttribute('value', '***');
    input_pw.setAttribute('placeholder', "Mot de passe");
    input_pw.classList.add('profile__input');

    const input_cpw = document.createElement('input');
    input_cpw.setAttribute('type', 'password');
    input_cpw.setAttribute('value', '***');
    input_cpw.setAttribute('placeholder', "Mot de passe");
    input_cpw.classList.add('profile__input');

    const btn_save = create_btn(['btn-orange'], "Sauvegarder");

    pe.append(btn_img, input_username, input_email, input_pw, input_cpw, btn_save);
    return (pe);
}

function create_collapsible(name_coll, function_which_btn)
{
    const coll = document.createElement('div');
    coll.classList.add('js-collapsible');

    // button that open or close the collapsible
    const btn_coll = create_btn(['a-btn', '-collapsible', 'js-btn-collapsible'], name_coll);

    const svg_plus = create_svg(['bi', 'bi-plus']);
    const path_plus = document.createElementNS(svgns, "path");
    path_plus.setAttribute("d", "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4");
    svg_plus.appendChild(path_plus);

    const svg_dash = create_svg(['bi', 'bi-dash']);
    const path_dash = document.createElementNS(svgns, "path");
    path_dash.setAttribute('d', "M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8");
    svg_dash.appendChild(path_dash);

    btn_coll.append(svg_plus, svg_dash);

    // collapsible content
    const ul = document.createElement('ul');
    ul.classList.add('o-collapsible__content');

    coll.append(btn_coll, ul);
    return (coll);
}

function create_collapsed_item(nameText, function_which_btn)
{
    const li = document.createElement('li');
    li.classList.add('m-collapsible__item', 'js-collapsible__item');

    const name = document.createElement('div');
    name.classList.add('js-friend__name');
    name.appendChild(document.createTextNode(nameText));

    li.appendChild(name);
    if (function_which_btn != 0)
    {
        const wrapper_btn = function_which_btn();
        li.appendChild(wrapper_btn);
    }
    return (li);
}

function create_blocked_btns()
{
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapperBtn');

    const btn_unblock = create_btn_heart_sm("Débloquer");
    const btn_info = create_btn_heart_sm("voir les infos");

    wrapper.append(btn_unblock, btn_info);

    return (wrapper);
}

function create_friend_btns()
{
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapperBtn');

    const btn_retirer = create_btn_heart_sm("Retirer");
    const btn_bloquer = create_btn_heart_sm("Bloquer");
    const btn_disc = create_btn_heart_sm("Discuster en privée");
    const btn_info = create_btn_heart_sm("voir les infos");

    wrapper.append(btn_retirer, btn_bloquer, btn_disc, btn_info);

    return (wrapper);
}

function create_svg_sword()
{
    const svg = create_svg(['icon_sword', 'top']);
    svg.setAttribute('viewBox', '0 0 22 22');

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', "M8 3V4H9V5H10V6H11V7H12V8H13V9H14V10H15V11H16V12H17V11H19V13H18V14H17V15H18V16H19V17H20V19H19V20H17V19H16V18H15V17H14V18H13V19H11V17H12V16H11V15H10V14H9V13H8V12H7V11H6V10H5V9H4V8H3V7H2V2H7V3H8M7 5H6V4H4V5H5V6H6V7H7V8H8V9H9V10H10V11H11V12H12V13H14V12H13V11H12V10H11V9H10V8H9V7H8V6H7V5Z");
    svg.appendChild(path);

    return (svg);
}

// <svg fill="#000000" width="800px" height="800px" viewBox="-32 0 512 512" xmlns="http://www.w3.org/2000/svg">
//<path d="M362.146 191.976c-13.71-21.649-38.761-34.016-65.006-30.341V74c0-40.804-32.811-74-73.141-74-40.33 0-73.14 33.196-73.14 74L160 168l-18.679-78.85C126.578 50.843 83.85 32.11 46.209 47.208 8.735 62.238-9.571 104.963 5.008 142.85l55.757 144.927c-30.557 24.956-43.994 57.809-24.733 92.218l54.853 97.999C102.625 498.97 124.73 512 148.575 512h205.702c30.744 0 57.558-21.44 64.555-51.797l27.427-118.999a67.801 67.801 0 0 0 1.729-15.203L448 256c0-44.956-43.263-77.343-85.854-64.024zM399.987 326c0 1.488-.169 2.977-.502 4.423l-27.427 119.001c-1.978 8.582-9.29 14.576-17.782 14.576H148.575c-6.486 0-12.542-3.621-15.805-9.449l-54.854-98c-4.557-8.141-2.619-18.668 4.508-24.488l26.647-21.764a16 16 0 0 0 4.812-18.139l-64.09-166.549C37.226 92.956 84.37 74.837 96.51 106.389l59.784 155.357A16 16 0 0 0 171.227 272h11.632c8.837 0 16-7.163 16-16V74c0-34.375 50.281-34.43 50.281 0v182c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16v-28c0-25.122 36.567-25.159 36.567 0v28c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16 0-25.12 36.567-25.16 36.567 0v70z"/>
function create_svg_scissor()
{
    const svg = create_svg(['icon_scissor']);
    svg.setAttribute('viewBox', "-32 0 512 512");

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('d', "M362.146 191.976c-13.71-21.649-38.761-34.016-65.006-30.341V74c0-40.804-32.811-74-73.141-74-40.33 0-73.14 33.196-73.14 74L160 168l-18.679-78.85C126.578 50.843 83.85 32.11 46.209 47.208 8.735 62.238-9.571 104.963 5.008 142.85l55.757 144.927c-30.557 24.956-43.994 57.809-24.733 92.218l54.853 97.999C102.625 498.97 124.73 512 148.575 512h205.702c30.744 0 57.558-21.44 64.555-51.797l27.427-118.999a67.801 67.801 0 0 0 1.729-15.203L448 256c0-44.956-43.263-77.343-85.854-64.024zM399.987 326c0 1.488-.169 2.977-.502 4.423l-27.427 119.001c-1.978 8.582-9.29 14.576-17.782 14.576H148.575c-6.486 0-12.542-3.621-15.805-9.449l-54.854-98c-4.557-8.141-2.619-18.668 4.508-24.488l26.647-21.764a16 16 0 0 0 4.812-18.139l-64.09-166.549C37.226 92.956 84.37 74.837 96.51 106.389l59.784 155.357A16 16 0 0 0 171.227 272h11.632c8.837 0 16-7.163 16-16V74c0-34.375 50.281-34.43 50.281 0v182c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16v-28c0-25.122 36.567-25.159 36.567 0v28c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16 0-25.12 36.567-25.16 36.567 0v70z");
    svg.append(path);

    return (svg);
}

//<svg fill="#000000" width="800px" height="800px" viewBox="-32 0 512 512" xmlns="http://www.w3.org/2000/svg">
//<path d="M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z"/>
function create_svg_paper()
{
    const svg = create_svg(['icon_paper']);
    svg.setAttribute('viewBox', "-32 0 512 512");

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('d', "M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z");
    svg.append(path);

    return (svg);
}
//<svg fill="#000000" width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
//<path d="M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z"
function create_svg_rock()
{
    const svg = create_svg(['icon_rock']);
    svg.setAttribute('viewBox', "0 0 512 512");

    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('d', "M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z");

    svg.append(path);

    return (svg);
}

function create_btn_orange_w_heart_sword(game_name)
{
    const btn = create_btn(['btn-orange'], "");
    const svg_heart = create_svg_heart();
    svg_heart.classList.add('bottom');

    const svg_sword = create_svg_sword();

    const span = document.createElement('span');
    span.classList.add('btn-orange__text');
    span.appendChild(document.createTextNode(game_name));

    btn.append(svg_heart, svg_sword, span);
    return (btn);
}

function create_accept_friend_btn(whichBtn, who)
{
    const btn_accept = create_btn([whichBtn], "");
    btn_accept.setAttribute("title", "Accepter l'ami");
    const svg_accept = create_svg(['bi', 'bi-accept']);
    const path_accept = document.createElementNS(svgns, 'path');
    path_accept.setAttribute('fill-rule', 'evenodd');
    path_accept.setAttribute('d', "M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z");
    svg_accept.appendChild(path_accept);
    btn_accept.appendChild(svg_accept);
    return btn_accept;
}

function create_delete_friend_btn(whichBtn, who)
{
    const btn_delete_friend = create_btn([whichBtn], "");
    btn_delete_friend.setAttribute("title", "Supprimer l'ami");
    const svg_delete_friend = create_svg(['bi', 'bi-delete-friend']);
    const path_delete_friend = document.createElementNS(svgns, 'path');
    path_delete_friend.setAttribute('fill-rule', 'evenodd');
    path_delete_friend.setAttribute('d', "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708");
    btn_delete_friend.addEventListener('click', function (event)
    {
        send_msg.delete_friend_request(who, currentUser);
    });
    svg_delete_friend.appendChild(path_delete_friend);
    btn_delete_friend.appendChild(svg_delete_friend);
    return btn_delete_friend;
}

function create_block_friend_btn(whichBtn, who)
{
    const btn_block_friend = create_btn([whichBtn], "");
    btn_block_friend.setAttribute("title", "Bloquer l'utilisateur");
    const svg_block_friend = create_svg(['bi', 'bi-block-friend']);
    const path_block_friend = document.createElementNS(svgns, 'path');
    path_block_friend.setAttribute('fill-rule', 'evenodd');
    path_block_friend.setAttribute('d', "M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0");
    btn_block_friend.addEventListener('click', function (event)
    {
        send_msg.block_friend_request(who, currentUser);
    });
    svg_block_friend.appendChild(path_block_friend);
    btn_block_friend.appendChild(svg_block_friend);
    return btn_block_friend;
}

function create_add_friend_btn(whichBtn, who)
{
    const btn_add_friend = create_btn([whichBtn], "");
    btn_add_friend.setAttribute("title", "Ajouter en ami");
    const svg_add_friend = create_svg(['bi', 'bi-add-friend']);
    const path_person1 = document.createElementNS(svgns, 'path');
    const path_person2 = document.createElementNS(svgns, 'path');
    path_person1.setAttribute('fill-rule', 'evenodd');
    path_person2.setAttribute('fill-rule', 'evenodd');
    path_person2.setAttribute('d', "M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6")
    path_person1.setAttribute('d', "M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5");
    btn_add_friend.addEventListener('click', function (event)
    {
        send_msg.add_friend_request(currentUser, who);
    });
    svg_add_friend.append(path_person2, path_person1);
    btn_add_friend.appendChild(svg_add_friend);

    return btn_add_friend;
}

function create_btn_set(username, whichBtn)
{
    const btns = document.createElement('div');
    btns.classList.add('wrapperBtn');

    //const btn_check = create_accept_friend_btn(whichBtn);
    const btn_x = create_delete_friend_btn(whichBtn, username);
    const btn_ban = create_block_friend_btn(whichBtn, username);
    //const btn_person_plus_fill = create_add_friend_btn(whichBtn);

    btns.append(btn_x, btn_ban);
    return btns;
}

function create_btn_setn(btn_class)
{
    const btns = document.createElement('div');
    btns.classList.add('wrapper');

    const btn_check = create_btn([btn_class], "");
    const svg_check = create_svg(['bi', 'bi-check']);
    const path_check = document.createElementNS(svgns, 'path');
    path_check.setAttribute('fill-rule', 'evenodd');
    path_check.setAttribute('d', "M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z");
    svg_check.appendChild(path_check);
    btn_check.appendChild(svg_check);

    const btn_x = create_btn([btn_class], "");
    const svg_x = create_svg(['bi', 'bi-x']);
    const path_x = document.createElementNS(svgns, 'path');
    path_x.setAttribute('fill-rule', 'evenodd');
    path_x.setAttribute('d', "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708");
    svg_x.appendChild(path_x);
    btn_x.appendChild(svg_x);

    const btn_ban = create_btn([btn_class], "");
    const svg_ban = create_svg(['bi', 'bi-ban']);
    const path_ban = document.createElementNS(svgns, 'path');
    path_ban.setAttribute('fill-rule', 'evenodd');
    path_ban.setAttribute('d', "M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0");
    svg_ban.appendChild(path_ban);
    btn_ban.appendChild(svg_ban);

    const btn_person_plus_fill = create_btn([btn_class], "");
    const svg_person_plus_fill = create_svg(['bi', 'bi-person-plus-fill']);
    const path_person1 = document.createElementNS(svgns, 'path');
    const path_person2 = document.createElementNS(svgns, 'path');
    path_person1.setAttribute('fill-rule', 'evenodd');
    path_person2.setAttribute('fill-rule', 'evenodd');
    path_person2.setAttribute('d', "M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6")
    path_person1.setAttribute('d', "M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5");
    svg_person_plus_fill.append(path_person2, path_person1);
    btn_person_plus_fill.appendChild(svg_person_plus_fill);

    btns.append(btn_check, btn_x, btn_ban, btn_person_plus_fill);
    return (btns);
}


function create_navtab(text)
{
    const button = create_btn(['a-btn', '-nav'], text);
    button.setAttribute('data-bs-toggle', 'tab');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', 'false');
    return (button);
}

function create_btn_arrow(text)
{
    const button = create_btn(['a-btn', '-arrow', 'hide'], "");
    button.setAttribute("id", "arrow-btn");

    const svg = create_svg(['bi', 'bi-arrow-left-short']);
    const path = document.createElementNS(svgns, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5');
    svg.appendChild(path);
    const arrow_span = document.createElement('span');
    arrow_span.classList.add('a-btn__title');
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
    div.setAttribute('id', 'tabpanel');

    return (div);
}

function create_disc_li(title_text, info_text)
{
    const button = create_btn(['m-chat__li', '-heart'], "");
    button.setAttribute('id', 'disc_list-' + title_text);
    const title = document.createElement('span');
    title.classList.add('a-li__title');
    title.appendChild(document.createTextNode(title_text));

    const info = document.createElement('span');
    info.classList.add('a-li__info');
    info.appendChild(document.createTextNode(info_text));
    button.append(create_svg_heart(), title, info);
    return (button);
}

function create_btn_img(img_class, img_path)
{

    const btn_img = document.createElement('button');
    btn_img.setAttribute('type', 'button');
    btn_img.classList.add('a-btn');
    btn_img.classList.add('-img');

    const img = document.createElement('img');
    img.classList.add(img_class);
    img.setAttribute('src', img_path);

    btn_img.appendChild(img);
    return (btn_img);
}
function create_msg(name_text, time_text, profile_picture)
{
    const msg = document.createElement('div');
    msg.classList.add('m-message');
    const senderDiv = document.createElement('div');
    senderDiv.classList.add('a-message__header');

    const btn_img = document.createElement('button');
    btn_img.setAttribute('type', 'button');
    btn_img.classList.add('a-btn');

    const img = document.createElement('img');
    img.classList.add('a-user__img');
    img.setAttribute('src', profile_picture);

    const sender_name = document.createElement('p');
    sender_name.classList.add('a-user__name', "msg-" + name_text);
    sender_name.textContent = name_text;
    if (name_text != currentUser)
    {
        if (!friend_list.includes(name_text))
        {
            const button_add_friend = create_add_friend_btn("btn-set4", sender_name.textContent);
            button_add_friend.style.marginLeft = "40px";
            sender_name.appendChild(button_add_friend);
        }
        if (!block_list.includes(name_text))
        {
            const button_block_friend = create_block_friend_btn("btn-set4", sender_name.textContent);
            sender_name.appendChild(button_block_friend);
        }
    }




    const timestamp = document.createElement('p');
    timestamp.classList.add('a-user__info');
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
    p.classList.add('a-message__content');
    return (p);
}

function create_user_in_pane(username, userstatus, profile_picture)
{
    const button = create_btn(['m-chat__li'], "");
    button.setAttribute('id', 'friend_list-' + username);


    const btn_img = create_btn_img(['a-user__img'], "https://localhost" + profile_picture);

    const title = document.createElement('span');
    title.classList.add('a-user__name');
    title.appendChild(document.createTextNode(username));

    const info = document.createElement('span');
    info.classList.add('a-user__info');
    info.setAttribute('id', 'friend_list_status-' + userstatus);
    info.appendChild(document.createTextNode(userstatus));

    const btns = create_btn_set(username, "btn-set4");
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

function create_notif(username, action, game = null)
{
    let bell_menu = document.getElementById('notif-menu');
    if (bell_menu.children[0].textContent === "Aucune notification")
        bell_menu.removeChild(bell_menu.children[0])

    const bell_menu_li = document.createElement('li');

    const notif = document.createElement('div');
    notif.classList.add('m-notif');
    let notif_id = null;


    const circle = create_svg_circle();

    const span_username = document.createElement('span');
    span_username.classList.add('a-notif__username');
    span_username.classList.add('js_username');
    span_username.setAttribute("id", "username_notif-" + username);
    span_username.textContent = username;
    notif_id = 'notif-' + username;

    const span_action = document.createElement('span');
    span_action.setAttribute('id', 'action_notif');
    if (action === "add_friend")
    {
        span_action.textContent = ' vous demande en ami !';
        notif_id += '-add_friend';
    }
    else if (action === "challenge")
    {
        span_action.textContent = ' vous défie au ';
        notif_id += '-challenge';
    }

    const span_game = document.createElement('span');
    span_game.classList.add('a-notif__game');
    span_game.classList.add('js_game');
    if (game === "pong")
    {
        span_game.textContent = 'pong';
        id += '-pong';
    }
    else if (game === "pfc")
    {
        span_game.textContent = 'pierre feuille ciseaux';
        id += '-pfc';
    }
    bell_menu_li.setAttribute('id', notif_id);

    const wrapper = document.createElement('div');
    wrapper.classList.add('m-wrapperNotif');

    const btn_refuser = create_btn_heart_sm(" Refuser ");
    const btn_accepter = create_btn_heart_sm(" Accepter ");

    btn_accepter.addEventListener('click', function (event)
    {
        console.log("Accepter la demande d'ami de " + username);
        send_msg.accept_friend_request(username, currentUser);
    });
    btn_refuser.addEventListener('click', function (event)
    {
        console.log("Refuser la demande d'ami de " + username);
        send_msg.reject_friend_request(username, currentUser);
    });

    const btn_three_dots = document.createElement('button');
    btn_three_dots.classList.add('btn-three-dots');
    btn_three_dots.appendChild(create_svg_three_dots());

    // Construction de l'arborescence des éléments
    wrapper.append(btn_refuser, btn_accepter, btn_three_dots);

    notif.appendChild(circle);
    notif.appendChild(span_username);
    notif.appendChild(span_action);
    notif.appendChild(span_game);
    notif.appendChild(wrapper);
    bell_menu_li.appendChild(notif);
    bell_menu.appendChild(bell_menu_li);
}

function load_notif()
{
    fetch('/get-friends-request')
        .then(response => response.json())
        .then(data =>
        {
            let friend_request = data.friends_request;
            if (friend_request.length > 0)
            {
                for (let i = 0; i < friend_request.length; i++)
                {
                    let friend = friend_request[i];
                    create_notif(friend, "add_friend");
                }
            }
            else
                show_no_notif();
        });
}

function show_no_notif()
{
    let bell_menu = document.getElementById('notif-menu');
    const bell_menu_li = document.createElement('li');
    bell_menu_li.textContent = "Aucune notification";
    bell_menu.appendChild(bell_menu_li);
}

function create_btn_heart_sm(text)
{
    const button = create_btn(['a-btn', '-heart', "-sm"], text);
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

function navigateCenterZone(page)
{
    let container = document.getElementsByClassName("centerZone")[0].children[0];

    console.log("navigate to " + page);
    // fetch("./page/" + page + ".html")
    //     .then(response => response.text())
    //     .then(html => {
    //         container.innerHTML = html;
    //     })
    //     .catch(error =>
    //     {
    //         console.error("Error fetching page: ", error);
    //     })
    fetch('/' + page)
        .then(response => response.text())
        .then(html =>
        {
            container.innerHTML = html;
        })
        .catch(error =>
        {
            console.error("Error fetching page: ", error);
        })
}

function clear_button_if_friend(username)
{
    let msgs = document.getElementsByClassName("msg-" + username);
    for (let i = 0; i < msgs.length; i++)
    {
        for (let j = 0; j < msgs[i].children.length; j++)
        {
            if (msgs[i].children[j].getAttribute("title") === "Ajouter en ami")
                msgs[i].children[j].remove();
        }
    }
}

function shuffle_array(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// create all the duos for a round roundNb
function create_tournament_round( )
{
    const round = document.createElement('ul');
    round.classList.add('round', 'js-round');

    const player1 = document.createElement('li');
    player1.classList.add('game', 'js-player');
    player1.innerHTML = "xxxxx";

    const vs= document.createElement('li');
    vs.classList.add('game');
    vs.innerHTML = "VS";

    const player2 = document.createElement('li');
    player2.classList.add('game', 'js-player');
    player2.innerHTML = "xxxxx";

    round.append(player1, vs, player2);
    return (round);
}

function create_ranking()
{

    const text= document.createElement('li');
    text.innerHTML = "1";

    rank.append(player1, text);
    return (rank);
}