
// import {centerZone} from './centerZone.js'; // Or the extension could be just `.js`
// import {currentUser} from './signin_with_42.js';
// import {pong} from './pong/index.js';
centerZone.listener =

{
    onClick: function (event)
    {
        let target;
        if (event.target.closest(".js-btn-collapsible"))
        {
            target = event.target.closest(".js-btn-collapsible");
            if (!target)
                return;
            event.preventDefault();

            event.target.classList.toggle("active");

            let svgs = event.target.getElementsByTagName("svg");
            let content = event.target.nextElementSibling;

            if (content.style.display === "block")
            {
                content.style.display = "none";
                svgs[0].style.display = "block"; // svgs[0] === + icon
                svgs[1].style.display = "none";
            }
            else
            {
                content.style.display = "block";
                svgs[0].style.display = "none";
                svgs[1].style.display = "block";
            }
        }
        else if (event.target.closest("#game_pong"))
        {
            target = event.target.closest("#game_pong");
            if (!target)
                return;
            if (document.getElementById("game_pong") === null)
                return;
            console.log("click on pong");
        }
        else if (event.target.closest("#pong-modal-btn"))
        {
            target = event.target.closest("#pong-modal-btn");
            if (!target)
                return;
            if (document.getElementById("pong-modal-btn") === null)
                return;
            event.preventDefault();
            console.log("pong modal opened");
            // replace default-username to my actual username
            document.querySelector(".js-getCurrentUser").setAttribute("value", currentUser);
        }
        else if (event.target.closest("#validate-pong-modal"))
        {
            target = event.target.closest("#validate-pong-modal");
            if (document.getElementById("validate-pong-modal") !== target)
                return;
            event.preventDefault();
            let isFormValid = false;

            // get input (players usernames)
            if (document.querySelector('input[name="pong-player1"]').value != "")
            {
                centerZone.players.push(document.querySelector('input[name="pong-player1"]').value);
                isFormValid = true;
            }
            if (document.querySelector('input[name="pong-player2"]').value != "")
                centerZone.players.push(document.querySelector('input[name="pong-player2"]').value);
            if (document.querySelector('input[name="pong-player3"]').value != "")
                centerZone.players.push(document.querySelector('input[name="pong-player3"]').value);
            if (document.querySelector('input[name="pong-player4"]').value != "")
                centerZone.players.push(document.querySelector('input[name="pong-player4"]').value);
            // console.log(this.player1 + " " + this.player2 + " " + this.player3 + " " + this.player4);

            console.log("isFormValid=" + isFormValid);
            // hide nb of players modal
            bootstrap.Modal.getInstance(document.getElementById("pong-modal")).hide();
            // trigger modal matchmaking
            if (centerZone.players.length > 1)
                centerZone.suffle();

            // clear center zone
            centerZone.inner.innerHTML = "";
            // create a modal with js
            if (centerZone.players.length > 1)
            {
                pong.createTournament(centerZone.inner);
                // render pong game
                pong.initTournament(centerZone.players);
            }
            centerZone.display_pong();
        }
        else if (event.target.closest("#game-pfc"))
        {
            target = event.target.closest("#game-pfc");
            if (document.getElementById("game-pfc") !== target)
                return;
            event.preventDefault();
            console.log("click");
            navigateCenterZone("tournament");

        }
    }

};