var intervalId;

centerZone.listener =
{
    onClick: function (event) {
        let target;
        if (event.target.closest(".js-btn-collapsible")) {
            target = event.target.closest(".js-btn-collapsible");
            if (!target)
                return;
            document.querySelectorAll('.js-btn-collapsible').forEach(e => {
                if (!e.contains(target))
                    return;
            });
            event.preventDefault();

            event.target.classList.toggle("active");

            let svgs = event.target.getElementsByTagName("svg");
            let content = event.target.nextElementSibling;

            if (content.style.display === "block") {
                content.style.display = "none";
                svgs[0].style.display = "block"; // svgs[0] === + icon
                svgs[1].style.display = "none";
            }
            else {
                content.style.display = "block";
                svgs[0].style.display = "none";
                svgs[1].style.display = "block";
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
