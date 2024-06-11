var intervalId;

centerZone.listener =
{
    onClick: function (event) {
        let target;
        if (event.target.closest(".js-btn-collapsible"))
        {
            target = event.target.closest(".js-btn-collapsible");
            if (!target)
                return;
            event.preventDefault();
            target.classList.toggle("active");

            if (target.nextElementSibling.style.display === "block")
            {
                target.nextElementSibling.style.display = "none";
                target.children[0].style.display = "block";
                target.children[1].style.display = "none";
            }
            else
            {
                target.nextElementSibling.style.display = "block";
                target.children[0].style.display = "none";
                target.children[1].style.display = "block";
            }
        }
        else if (event.target.closest("#game_pfc"))
        {
            target = event.target.closest("#game_pfc");
            if (!target)
                return;
            if (document.getElementById("game_pfc") === null)
                return;
            console.log("click on pfc");
            history.pushState({page: 'matchmaking'}, '', '/matchmaking/');
            centerZone.inner.innerHTML = "";
            pfc.launch_queue();
        }
        else if (event.target.closest("#game_pong")) {
            target = event.target.closest("#game_pong");
            if (!target)
                return;
            if (document.getElementById("game_pong") === null)
                return;
            console.log("click on pong");
            centerZone.inner.innerHTML = "";
            (async function () {
					// let requestAnimId;
					/* const framePerSecond = 60; */
                    fetch('/pong-mode-choice/')
                        .then(response => response.json())
                        .then(data => {
                            history.pushState({page: 'pong'}, '', '/pong/');
                            const pong_mode_choice_html = data.pong_mode_choice_html;
                            centerZone.inner.innerHTML = pong_mode_choice_html;
                            handle_pong_btns();
                        });
					// let initialisation = function()
					// {
                    //             if (intervalId) {
                    //                 pong.scorePlayer1 = 0;
                    //                 pong.scorePlayer2 = 0;
                    //                 clearInterval(intervalId);
                    //             }
					// 			pong.init(centerZone.inner);
					// 			intervalId = setInterval(run_game, 1000 / 60); // 60 FPS
					// };
					// un cycle d'affichage = un passage dans main()
					// const run_game = function() {
					// 			/* setInterval(pong.animate(), 1000 / framePerSecond); */
					// 			pong.currentState();
					// 		}

					// appel de la fonction initialisation au chargement de la page
					//initialisation(); 

				})();
        }
    }

}; 

window.addEventListener("resize", function() {
    pong.adaptWindow(centerZone.inner);
});
