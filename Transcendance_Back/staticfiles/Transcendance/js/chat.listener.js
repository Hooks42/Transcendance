chat.listener = {
    onClickDiscPane: function (event)
    {
        let target = event.target.closest(".m-chat__li");
        if (!target)
            return;
        if (!chat.disc_pane.contains(target))
            return;
        event.preventDefault();

        chat.disc_tab.classList.toggle("hide");
        chat.user_tab.classList.toggle("hide");

        chat.current_pane = chat.get_active_pane();
        chat.current_pane.classList.toggle("active");
        chat.current_pane.classList.toggle("show");

        chat.arrow_tab.children[1].textContent = target.children[1].textContent;
        chat.arrow_tab.classList.toggle("hide");

        chat.chatroom.style.display = "flex";
        console.log("click on chat li");
    },

    onClickArrowBtn: function (event)
    {
        let target = event.target.closest(".-arrow");
        if (!target)
            return;
        if (!chat.arrow_tab.contains(target))
            return;
        event.preventDefault();

        chat.arrow_tab.classList.toggle("hide");

        for (let i = 0; i < chat.chatroom.length; i++)
            chat.chatroom[i].style.display = "none";

        chat.disc_tab.classList.toggle("hide");
        chat.user_tab.classList.toggle("hide");

        chat.current_pane.classList.toggle("active");
        chat.current_pane.classList.toggle("show");
    },

    onClickCollapsible: function (event)
    {
        if (event.target.closest(".js-btn-collapsible"))
        {
            let target = event.target.closest(".js-btn-collapsible");
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
    }
}

// document.querySelector('#the-chat').addEventListener('click', function (event)
// {
//     if (event.target.closest(".btn-heart-list"))
//     {
//         // let triggerEl = event.target.closest(".btn-heart-list");
//         event.preventDefault();

//         chat.disc_tab.classList.toggle("hide");
//         chat.user_tab.classList.toggle("hide");

//         chat.current_pane = get_active_pane();
//         chat.current_pane.classList.toggle("active");
//         chat.current_pane.classList.toggle("show");

//         // chat.arrow_tab = document.querySelector("button.btn-arrow");
//         chat.arrow_tab.classList.toggle("hide");

//         // document.getElementById("chatroom-tab");
//         chat.chatroom.style.display = "flex";
//     }
// });
