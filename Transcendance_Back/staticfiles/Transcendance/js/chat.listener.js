chat.listener = {
    onClickDiscPane: function (event)
    {
        let target = event.target.closest(".btn-heart-list");
        if (!target)
            return;
        if (!chat.disc_pane.contains(target))
            return;
        event.preventDefault();

        chat.disc_tab.classList.toggle("hide");
        chat.user_tab.classList.toggle("hide");

        chat.current_pane = this.get_active_pane();
        chat.current_pane.classList.toggle("active");
        chat.current_pane.classList.toggle("show");

        chat.arrow_tab.children[1].textContent = target.children[1].textContent;
        chat.arrow_tab.classList.toggle("hide");

        chat.chatroom.style.display = "flex";
    },

    onClickArrowBtn: function (event)
    {
        let target = event.target.closest(".btn-arrow");
        if (!target)
            return;
        if (!chat.arrow_tab.contains(target))
            return;
        event.preventDefault();

        chat.arrow_tab.classList.toggle("hide");
        chat.chatroom.style.display = "none";

        chat.disc_tab.classList.toggle("hide");
        chat.user_tab.classList.toggle("hide");

        chat.current_pane.classList.toggle("active");
        chat.current_pane.classList.toggle("show");
    },

    onClickUserPane: function (event)
    {
        if (event.target.closest(".btn-img"))
        {
            let target = event.target.closest(".btn-img");
            if (!target)
                return;
            if (!chat.user_pane.contains(target))
                return;
            event.preventDefault();
            alert("IMG click, go to that user's profile page");
        }
        else if (event.target.closest(".btn-set1"))
        {

            let target = event.target.closest(".btn-set1");
            if (!target)
                return;
            if (!chat.user_pane.contains(target))
                return;
            event.preventDefault();
            alert("USER btn click, do action on that user");
        }
    }
};


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
