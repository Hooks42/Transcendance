const svgns = "http://www.w3.org/2000/svg";

const navbar = {

    navbar: null,

    btn_home: document.getElementsByClassName("navbar-brand")[0],

    btn_notif: null,

    btn_logout: null,
    btn_my_account: null,

    create: function ()
    {
        this.navbar = document.createElement('ul');
        this.navbar.classList.add('navbar-nav');
        this.navbar.setAttribute('id', 'navbar-icons');

        // li for our anchors
        const nav_item1 = document.createElement('li');
        nav_item1.classList.add('nav-item', 'dropdown');
        nav_item1.setAttribute('id', 'navbar-notif-menu');
        const nav_item2 = document.createElement('li');
        nav_item2.classList.add('nav-item', 'dropdown');

        // bell anchor
        const bell_a = create_nav_link("navbar_notif_menu");
        bell_a.appendChild(create_svg_bell());
        let bell_menu = create_dropdown_menu();
        bell_menu.classList.add("-lg");
        bell_menu.setAttribute('id', 'notif-menu');
        load_notif();

        // person anchor
        const person_a = create_nav_link("navbar_account_menu");
        person_a.appendChild(create_svg_person());

        const person_menu = create_dropdown_menu();
        const person_menu_li1 = document.createElement('li');
        const person_menu_li2 = document.createElement('li');

        person_menu_li1.appendChild(create_btn_heart_sm(" Mon compte "));
        person_menu_li1.children[0].setAttribute("id", "btn_my_account");
        person_menu_li1.children[0].setAttribute("href", "#profile");
        this.btn_my_account = person_menu_li1.children[0];
        person_menu_li2.appendChild(create_btn_heart_sm(" Se déconnecter "));
        person_menu_li2.children[0].setAttribute("id", "btn_logout");
        this.btn_logout = person_menu_li2.children[0];

        // Construction de l'arborescence des éléments
        this.navbar.append(nav_item1, nav_item2);

        nav_item1.append(bell_a, bell_menu);
        nav_item2.append(person_a, person_menu);

        person_menu.append(person_menu_li1, person_menu_li2);

        // Bind listeners to navbar elements
        this.btn_home.onclick = navbar.listener.onClickBtnHome.bind(this);
        this.btn_logout.onclick = navbar.listener.onClickBtnLogout.bind(this);
        this.btn_my_account.onclick = navbar.listener.onClickBtnMyAccount.bind(this);

    },

    load: function ()
    {
        if (this.navbar == null)
        {
            console.error("Cound not load the chat's navigation bar. It must be created first.")
            return;
        }
        document.querySelector('#navbar-long > div').appendChild(this.navbar);
    }
};