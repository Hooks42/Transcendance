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
        else if (event.target.closest("#game_pong")) {
            target = event.target.closest("#game_pong");
            if (!target)
                return;
            if (document.getElementById("game_pong") === null)
                return;
            console.log("click on pong");
            centerZone.inner.innerHTML = "";
            (function () {
					let requestAnimId;
					/* const framePerSecond = 60; */
					let initialisation = function()
					{
								pong.init(centerZone.inner);
								requestAnimId = window.requestAnimationFrame(run_game); // premier appel de main au rafraîchissement de la page
					};
					// un cycle d'affichage = un passage dans main()
					const run_game = function() {
								/* setInterval(pong.animate(), 1000 / framePerSecond); */
								pong.currentState();
								requestAnimId = window.requestAnimationFrame(run_game); // rappel de main au prochain rafraîchissement de la page
							}

					// appel de la fonction initialisation au chargement de la page
					initialisation(); 

				})();
        }
    }

};