if (is_navbar_loaded)
{
    let btn_home = document.getElementsByClassName("navbar-brand");
    btn_home[0].addEventListener("click", function (event)
    {
        event.preventDefault();

        let page = this.getAttribute("href").substring(1);
        console.log("click on " + page);
        navigate_main(page);
    })

    document.getElementById("btn_logout").addEventListener("click", function (event)
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
    })
}