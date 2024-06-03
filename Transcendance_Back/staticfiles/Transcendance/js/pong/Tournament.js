
class Tournament 
{
    // HTML elements
    modalPage1 = null;
    modalPage2 = null;
    bs_modalPage1 = null;
    bs_modalPage2 = null;

    currentModal = null;

    tournamentEl = null;
    rankingEl = null;

    footerEl2 = null;
    btnCreate = null;
    btnCancel = null;
    btnReset = null;
    btnClose = null;


    // HTML elements that are dynamically modified with JS
    js_players = null;
    js_rounds = null;
    js_ranks = null;

    // 1D arrays
    ranking = []; // list of players for the ranking
    losers = []; // list of players that lost a match
    players = []; // list of players for js_players

    currentRound = 0; // round 0 = p1 vs p2; r1 = p3 vs p4; r2 = winner r1 vs winner r2; r3 = loser r1 vs loser r2
    maxRound = 0;
    isOn = false;


    constructor(container)
    {
        // modal page 1
        // create HTML elements
        // BS modal skeleton
        this.modalPage1 = document.createElement("div");
        this.modalPage1.classList.add("modal", "fade");
        this.modalPage1.setAttribute("aria-hidden", "true");
        this.modalPage1.setAttribute("tabindex", -1);
        this.modalPage1.setAttribute("aria-labelledby", "tournament-modal");
        this.modalPage1.setAttribute("id", "tournament-modal-page1");

        const dialog1 = document.createElement("div");
        dialog1.classList.add("modal-dialog", "modal-lg");

        const contentEl1 = document.createElement("div");
        contentEl1.classList.add("modal-content");

        // this.header
        const headerEl1 = document.createElement("div");
        headerEl1.classList.add("modal-header");

        const titleEl1 = document.createElement("h5");
        titleEl1.classList.add("modal-title");
        titleEl1.innerHTML = "Creation d'un tournoi (1 a 4 joueurs)";

        const btn_close = create_btn(["btn-close", "btn-close-white"], "");
        btn_close.setAttribute("data-bs-dismiss", "modal");
        btn_close.setAttribute("aria-label", "close");

        // body == tournament or ranking or input elements
        const bodyEl1 = document.createElement("div");
        bodyEl1.classList.add("modal-body");
        this.createInputEl();
        bodyEl1.append(this.inputEl);


        // footer == tournament final ranking
        const footerEl1 = document.createElement("div");
        footerEl1.classList.add("modal-footer");


        // footer
        this.btnCreate = create_btn(['a-btn', '-heart'], "Creer un tournoi");
        this.btnCreate.prepend(create_svg_heart());
        this.btnCreate.setAttribute('id', "btn_create_tournament");

        this.btnClose = create_btn(['a-btn', '-heart'], "Annuler");
        this.btnClose.prepend(create_svg_heart());

        // Arborescence
        this.modalPage1.append(dialog1);
        dialog1.append(contentEl1);
        contentEl1.append(headerEl1, bodyEl1, footerEl1);
        headerEl1.append(titleEl1, btn_close);
        footerEl1.append(this.btnClose, this.btnCreate);

        // modal page 2
        // create HTML elements
        // BS modal skeleton
        this.modalPage2 = document.createElement("div");
        this.modalPage2.classList.add("modal", "fade");
        this.modalPage2.setAttribute("aria-hidden", "true");
        this.modalPage2.setAttribute("tabindex", -1);
        this.modalPage2.setAttribute("aria-labelledby", "tournament-modal");
        this.modalPage2.setAttribute("id", "tournament-modal-page2");

        const dialog2 = document.createElement("div");
        dialog2.classList.add("modal-dialog", "modal-lg");

        const contentEl2 = document.createElement("div");
        contentEl2.classList.add("modal-content");

        // this.header
        const headerEl2 = document.createElement("div");
        headerEl2.classList.add("modal-header");

        const titleEl2 = document.createElement("h5");
        titleEl2.classList.add("modal-title");
        titleEl2.innerHTML = "Tournoi";

        const btn_close2 = create_btn(["btn-close", "btn-close-white"], "");
        btn_close2.setAttribute("data-bs-dismiss", "modal");
        btn_close2.setAttribute("aria-label", "close");

        // body == tournament or ranking or input elements
        const bodyEl2 = document.createElement("div");
        bodyEl2.classList.add("modal-body");

        this.tournamentEl = document.createElement('div');
        this.tournamentEl.classList.add('tournament');

        this.rankingEl = document.createElement('ol');
        this.rankingEl.classList.add('rankingEl');
        this.rankingEl.innerHTML = "Classement";


        // footer == tournament final ranking
        this.footerEl2 = document.createElement("div");
        this.footerEl2.classList.add("modal-footer");

        this.btnReset = create_btn(['a-btn', '-heart'], "Reinitialiser");
        this.btnReset.setAttribute("id", "btn_reset");
        this.btnReset.prepend(create_svg_heart());

        // Arborescence
        this.modalPage2.append(dialog2);
        dialog2.append(contentEl2);
        contentEl2.append(headerEl2, bodyEl2, this.footerEl2);
        bodyEl2.append(this.tournamentEl, this.rankingEl);
        headerEl2.append(titleEl2, btn_close2);
        // footerEl2.append(this.btnReset);

        container.append(this.modalPage1, this.modalPage2);
        this.bs_modalPage1 = bootstrap.Modal.getOrCreateInstance(document.getElementById('tournament-modal-page1'));
        this.bs_modalPage2 = bootstrap.Modal.getOrCreateInstance(document.getElementById('tournament-modal-page2'));
        this.bindListener();
    }

    createInputEl()
    {
        // Créer la liste non ordonnée
        this.inputEl = document.createElement('ul');
        this.inputEl.classList.add('modal-ul');

        // Créer un tableau d'objets représentant les joueurs
        const players = [
            {label: 'Premier joueur', id: 'pong-player1', value: 'my_username', disabled: true},
            {label: 'Deuxieme joueur', id: 'pong-player2', value: '', disabled: false},
            {label: 'Troisieme joueur', id: 'pong-player3', value: '', disabled: false},
            {label: 'Quatrieme joueur', id: 'pong-player4', value: '', disabled: false}
        ];
        // Fonction pour créer chaque élément de la liste
        players.forEach(player =>
        {
            const li = document.createElement('li');

            const label = document.createElement('label');
            label.setAttribute('for', player.id);
            label.textContent = player.label + ' :';

            const input = document.createElement('input');
            input.classList.add('modal__input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', player.id);
            input.setAttribute('name', player.id);
            input.setAttribute('value', player.value);
            if (player.disabled)
            {
                input.setAttribute('disabled', '');
                input.classList.add('js-getCurrentUser');
                // replace default-username to my actual username
                input.setAttribute("value", currentUser);
            }

            li.appendChild(label);
            li.appendChild(input);
            li.appendChild(document.createElement('br'));

            this.inputEl.appendChild(li);

        });

    }


    show()
    {
        this.bs_modalPage1.show();
    }

    hide()
    {
        this.bs_modalPage1.hide();
        this.bs_modalPage2.hide();
    }

    toggle()
    {
        this.bs_modalPage1.toggle();
    }

    initTournament(players)
    {
        if (players.length < 3)
        {
            this.isOn = false;
            return;
        }
        this.isOn = true;
        this.maxRound = players.length;
        this.players = players;
        this.currentRound = 0;

        //   create rounds and append them
        for (let i = 0; i < this.maxRound; i++)
        {
            this.tournamentEl.append(create_tournament_round());
        }
        // modify the text in the modal to the user inputed usernames
        this.js_players = document.querySelectorAll(".js-player");
        for (let i = 0; i < this.maxRound; i++)
        {
            this.js_players[i].innerHTML = players[i];
        }
        // create ranking
        for (let i = 0; i < players.length; i++)
        {

            const player = document.createElement('li');
            player.classList.add('js-rank');
            player.innerHTML = "xxxxx";

            this.rankingEl.append(player);
        }
        this.js_rounds = document.querySelectorAll(".js-round");
        this.js_ranks = document.querySelectorAll(".js-rank");
    }

    reset()
    {
        this.isOn = false;
        this.players.splice(0, this.players.length);
        this.ranking.splice(0, this.ranking.length);
        this.losers.splice(0, this.losers.length);
        this.maxRound = 0;
        this.currentRound = 0;
        this.tournamentEl.innerHTML = "";
        this.rankingEl.innerHTML = "";
        let hlEl = document.querySelectorAll(".-highlight");
        for (let i = 0; i < hlEl.length; i++)
        {
            hlEl[i].classList.remove("-highlight");
        }
        let winnerEl = document.querySelectorAll(".winner");
        for (let i = 0; i < winnerEl.length; i++)
        {
            winnerEl[i].classList.remove("winner");
        }

        pong.reset();
    }

    appendBtnReset()
    {
        this.footerEl2.append(this.btnReset);
    }
    removeBtnReset()
    {
        this.footerEl2.innerHTML = "";
    }
    bindListener()
    {
        this.modalPage1.onclick = this.onClick.bind(this);
        this.modalPage2.onclick = this.onClick.bind(this);
    }

    onClick(event)
    {
        console.log("click on class");
        let target;
        if (event.target.closest("#btn_create_tournament"))
        {
            target = event.target.closest("#btn_create_tournament");
            if (!target)
                return;
            if (document.getElementById("btn_create_tournament") === null)
                return;
            event.preventDefault();

            // get input (players usernames)
            if (document.querySelector('input[name="pong-player1"]').value != "")
                this.players.push(document.querySelector('input[name="pong-player1"]').value);
            if (document.querySelector('input[name="pong-player2"]').value != "")
                this.players.push(document.querySelector('input[name="pong-player2"]').value);
            if (document.querySelector('input[name="pong-player3"]').value != "")
                this.players.push(document.querySelector('input[name="pong-player3"]').value);
            if (document.querySelector('input[name="pong-player4"]').value != "")
                this.players.push(document.querySelector('input[name="pong-player4"]').value);
            // console.log(this.player1 + " " + this.player2 + " " + this.player3 + " " + this.player4);

            console.log(this.players);
            if (this.players.length > 2)
            {
                this.isOn = true;
                shuffle_array(this.players);
                this.initTournament(this.players);
            }
            else
            {
                this.isOn = false;
            }

            // hide modal
            this.bs_modalPage1.hide();
            this.bs_modalPage2.show();

        }
        else if (event.target.closest(".btn-close"))
        {
            target = event.target.closest(".btn-close");
            if (!target)
                return;
            // if (document.getElements("btn-close") === null)
            //     return;
            event.preventDefault();

            if (document.getElementById("tournament-modal-page1").classList.contains("show"))
                this.isOn = false;
        }
        else if (event.target.closest("#btn_reset"))
        {
            target = event.target.closest("#btn_reset");
            if (!target)
                return;
            if (document.getElementById("btn_reset") === null)
                return;
            event.preventDefault();
            console.log("click on reset");
            this.reset();

            if (document.getElementById("tournament-modal-page2").classList.contains("show"))
            {
                console.log("hide page 2");
                this.bs_modalPage2.hide();
            }
            // this.bs_modalPage1.show();
            console.log("current round = " + this.currentRound);
        }
    }
};
