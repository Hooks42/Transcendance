
class Tournament 
{
    // HTML elements
    modal = null;
    bs_modal = null;
    tournamentEl = null;
    rankingEl = null;

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


    constructor(container)
    {
        // create HTML elements
        // BS modal skeleton
        this.modal = document.createElement("div");
        this.modal.classList.add("modal", "fade");
        this.modal.setAttribute("aria-hidden", "true");
        this.modal.setAttribute("tabindex", -1);
        this.modal.setAttribute("aria-labelledby", "tournament-modal");
        this.modal.setAttribute("id", "tournament-modal");

        const dialog = document.createElement("div");
        dialog.classList.add("modal-dialog", "modal-lg");

        const content = document.createElement("div");
        content.classList.add("modal-content");

        // header
        const header = document.createElement("div");
        header.classList.add("modal-header");

        const title = document.createElement("h5");
        title.classList.add("modal-title");
        title.innerHTML = "Tournoi";

        const btn_close = create_btn(["btn-close", "btn-close-white"], "");
        btn_close.setAttribute("data-bs-dismiss", "modal");
        btn_close.setAttribute("aria-label", "close");

        // body == tournament or ranking or both
        this.tournamentEl = document.createElement('div');
        this.tournamentEl.classList.add('tournament');

        this.rankingEl = document.createElement('ol');
        this.rankingEl.classList.add('rankingEl');
        this.rankingEl.innerHTML = "Classement";

        // footer == tournament final ranking
        const footer = document.createElement("div");
        footer.classList.add("modal-footer");
        const button = create_btn(['a-btn', '-heart'], "Annuler ce tournoi");
        button.prepend(create_svg_heart());
        footer.append(button);


        // Arborescence
        this.modal.append(dialog);
        dialog.append(content);
        content.append(header, this.tournamentEl, this.rankingEl, footer);
        header.append(title, btn_close);
        footer.append(button);

        container.append(this.modal);
        this.bs_modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('tournament-modal'));
    }

    show()
    {
        this.bs_modal.show();
    }

    hide()
    {
        this.bs_modal.hide();
    }

    toggle()
    {
        this.bs_modal.toggle();
    }

    init(players)
    {
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

};
