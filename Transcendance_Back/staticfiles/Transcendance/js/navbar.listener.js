navbar.listener = {
    onClickBtnHome: function (event)
    {
        event.preventDefault();

        let page = navbar.btn_home.getAttribute("href").substring(1);
        console.log("click on " + page);
        navigate_main(page);
    },

    // this trigger the modal for a successful connection
    // TODO: change its behavior to an actual log out
    onClickBtnLogout: function (event)
    {
        event.preventDefault();

        let modal = document.getElementById("successful_co_modal");

        // show modal on foreground
        modal.classList.toggle("show");
        modal.style.display = "block";
        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";

        // fade effect on background
        let div = document.createElement("div");
        div.classList.add("modal-backdrop", "fade", "show");
        document.body.append(div);

        // countdown until the modal autocloses
        if (modal.classList.contains("show"))
        {
            setTimeout(() => 
            {
                modal.classList.remove("show");
                modal.style.display = "none";
                div.remove();
            }
                , 1000)
        }
    }
}