
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
            console.log("tournament modal opened");
            // clear center zone
            centerZone.inner.innerHTML = "";
            centerZone.display_pong();
        }
        else if (event.target.closest("#game-pfc"))
        {
            target = event.target.closest("#game-pfc");
            if (document.getElementById("game-pfc") !== target)
                return;
            event.preventDefault();
            console.log("click");

        }
    }

};