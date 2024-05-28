
//  import { pong} from './pong/index.js'; // Or the extension could be just `.js`
//  import { currentUser } from './signin_with_42.js';
// existing_main.append(create_btn_setn("btn-set1"));
// existing_main.append(create_btn_setn("btn-set2"));
// existing_main.append(create_btn_setn("btn-set3"));

const centerZone =
{
    inner: document.getElementById("main-div"),
    players: [], // list of 1 to 4 player usernames

    listen: function ()
    {
        this.inner.onclick = centerZone.listener.onClick.bind(this);
        // this.inner.onsubmit = centerZone.listener.onSubmit.bind(this);
    },

    suffle: function ()
    {
        if (this.players.length <= 0)
            return;
        shuffle_array(this.players);
        // display tournament bracket (who's gonna play against who and when)
    },
    display_pong: function ()
    {
        (function ()
        {
            let requestAnimId;
            /* const framePerSecond = 60; */
            let initialisation = function ()
            {
                pong.init(centerZone.inner, centerZone.players);
                requestAnimId = window.requestAnimationFrame(run_game); // premier appel de main au rafraîchissement de la page
            };
            // un cycle d'affichage = un passage dans main()
            const run_game = function ()
            {
                /* setInterval(pong.animate(), 1000 / framePerSecond); */
                pong.currentState();
                requestAnimId = window.requestAnimationFrame(run_game); // rappel de main au prochain rafraîchissement de la page
            }

            // appel de la fonction initialisation au chargement de la page
            initialisation();
        })();
    },
    display_pfc: function ()
    {
    }

};