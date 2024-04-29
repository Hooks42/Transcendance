const svgns = "http://www.w3.org/2000/svg";

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

function create_btn_heart_sm(text, id)
{
    const button = create_btn(['btn-heart', 'btn-heart-sm'], text);
    button.id = id;
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

function create_navbar()
{
    const navbar = document.querySelector('#navbar-long > div');


    // Création de la liste ul navbar_nav
    const navbar_nav = document.createElement('ul');
    navbar_nav.classList.add('navbar-nav');

    // Premier élément li de navbar_nav
    const nav_item1 = document.createElement('li');
    nav_item1.classList.add('nav-item', 'dropdown');
    const nav_item2 = document.createElement('li');
    nav_item2.classList.add('nav-item', 'dropdown');

    // bell anchor
    const bell_a = create_nav_link("navbar_notif_menu");
    bell_a.appendChild(create_svg_bell());

    const bell_menu = create_dropdown_menu();
    bell_menu.classList.add("dropdown-menu--lg");
    const bell_menu_li1 = document.createElement('li');
    bell_menu_li1.appendChild(create_notif());
    const bell_menu_li2 = bell_menu_li1.cloneNode(true);

    // person anchor
    const person_a = create_nav_link("navbar_account_menu");
    person_a.appendChild(create_svg_person());

    const person_menu = create_dropdown_menu();
    const person_menu_li1 = document.createElement('li');
    const person_menu_li2 = document.createElement('li');

    let account_btn = create_btn_heart_sm(" Mon compte ", 'account-btn');
    let logout_btn = create_btn_heart_sm(" Se déconnecter ", 'logout-btn');
    listen_logout(logout_btn);

    person_menu_li1.appendChild(account_btn);
    person_menu_li2.appendChild(logout_btn);

    // Construction de l'arborescence des éléments

    navbar_nav.appendChild(nav_item1);
    navbar_nav.appendChild(nav_item2);

    nav_item1.appendChild(bell_a);
    nav_item1.appendChild(bell_menu);

    nav_item2.appendChild(person_a);
    nav_item2.appendChild(person_menu);

    bell_menu.appendChild(bell_menu_li1);
    bell_menu.appendChild(bell_menu_li2);

    person_menu.appendChild(person_menu_li1);
    person_menu.appendChild(person_menu_li2);

    return (navbar_nav);
}

function load_navbar()
{
    const navbar = document.querySelector('#navbar-long > div');
    const navbar_nav = create_navbar();
    navbar.appendChild(navbar_nav);
}