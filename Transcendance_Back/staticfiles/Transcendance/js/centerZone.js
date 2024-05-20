
// existing_main.append(create_btn_setn("btn-set1"));
// existing_main.append(create_btn_setn("btn-set2"));
// existing_main.append(create_btn_setn("btn-set3"));

const centerZone =
{
    inner: document.getElementById("main-div"),
    players: [],

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
        centerZone.inner.innerHTML = "";
        (function ()
        {
            let requestAnimId;
            /* const framePerSecond = 60; */
            let initialisation = function ()
            {
                pong.init(centerZone.inner);
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
        centerZone.inner.innerHTML = "";

            let rock = create_btn(['a-btn', '-pfc'], "");
            rock.id = 'rock';
            // rock.textContent = 'rock';
            let svg_rock = create_svg_rock();
            rock.append(svg_rock);
            
            // let paper = document.createElement('button');
            let paper = create_btn(['a-btn', '-pfc'], "");
            paper.id = 'paper';
            // paper.textContent = 'paper';
            let svg_paper = create_svg_paper();
            paper.append(svg_paper);

            // let scissor = document.createElement('button');
            let scissor = create_btn(['a-btn', '-pfc'], "");
            scissor.id = 'scissor';
            // scissor.textContent = 'scissor';
            let svg_scissor = create_svg_scissor();
            scissor.append(svg_scissor);

            centerZone.inner.append(rock, paper, scissor);
    }

};