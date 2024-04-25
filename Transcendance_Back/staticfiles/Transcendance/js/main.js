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

function create_profile_collapsible(name_coll, function_which_btn)
{
    const coll = document.createElement('div');
    coll.classList.add('collapsible');

    // button that open or close the collapsible
    const btn_coll = create_btn(['btn-collapsible'], name_coll);

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
    ul.classList.add('profile__content');

    const li1 = create_collapsed_item("lejoueurdugrenier", function_which_btn);
    const li2 = create_collapsed_item("annabelle", function_which_btn);
    ul.append(li1, li2);

    coll.append(btn_coll, ul);
    return (coll);
}

function create_collapsed_item(nameText, function_which_btn)
{
    const li = document.createElement('li');
    li.classList.add('collapsed_item');

    const name = document.createElement('div');
    name.classList.add('friend_name');
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
    wrapper.classList.add('wrapper_btn');

    const btn_unblock = create_btn_heart_sm("Débloquer");
    const btn_info = create_btn_heart_sm("voir les infos");

    wrapper.append(btn_unblock, btn_info);

    return (wrapper);
}

function create_friend_btns()
{
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper_btn');

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

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
let is_profile_loaded = 0;
let is_btn_games_loaded = 0;
let wrapper_profile_el = 0;
let btn_games_el = 0;
const existing_main = document.getElementById('main');

function create_profile_once()
{
    let has_been_called = false;

    return function ()
    {
        if (!has_been_called)
        {
            has_been_called = true;
            // Votre code ici
            wrapper_profile_el = create_wrapper_profile();

            const wrapper_coll = document.createElement('div');
            wrapper_coll.classList.add('wrapper_collapsibles');

            const coll_friend = create_profile_collapsible("AMIS (nb)", create_friend_btns);
            const coll_blocked = create_profile_collapsible("PERSONNES BLOQUEES (nb)", create_blocked_btns);
            const coll_history = create_profile_collapsible("HISTORIQUE", 0);
            wrapper_coll.append(coll_friend, coll_blocked, coll_history);

            wrapper_profile_el.append(wrapper_coll);
        } else
        {
            console.log("La fonction create_profile_once() ne peut être appelée qu'une seule fois.");
        }
    };
}

const create_profile = create_profile_once();

function create_btn_games_once()
{
    let has_been_called = false;

    return function ()
    {
        if (!has_been_called) 
        {
            has_been_called = true;
            btn_games_el = document.createElement('div');
            btn_games_el.classList.add('wrapper_btn-game');

            const btn_pong = create_btn_orange_w_heart_sword("PONG");

            const btn_pfc = create_btn_orange_w_heart_sword("PFC");

            btn_games_el.append(btn_pong, btn_pfc);
        }
        else
            console.log("La fonction create_btn_games_once() ne peut être appelée qu'une seule fois.");

    }

}
const create_btn_games = create_btn_games_once();

function load_btn_games()
{
    if (btn_games_el != 0)
    {
        existing_main.append(btn_games_el);
        is_btn_games_loaded = 1;
    }
    else
    {
        console.log("could not load the game buttons because the HTML elements have not been created");
    }

}

function load_profile()
{
    if (wrapper_profile_el != 0)
    {
        existing_main.append(wrapper_profile_el);
        is_profile_loaded = 1;
    }
    else
    {
        console.log("could not load the user profile because the HTML elements have not been created");
    }
}