
if (is_profile_loaded == 1)
{
    let collapsibles = document.getElementsByClassName("btn-collapsible");
    let i = 0;

    while (i < collapsibles.length)
    {
        collapsibles[i].addEventListener("click", function ()
        {
            console.log("click");
            this.classList.toggle("active");
            let svgs = this.getElementsByClassName('bi');
            // let content = document.getElementsByClassName(".profile__content");
            let content = this.nextElementSibling;
            console.log("h" + content);
            if (content.style.display === "block")
            {
                content.style.display = "none";
                svgs[0].style.display = "block"; // svgs[0] === + icon
                svgs[1].style.display = "none";
            } else
            {
                content.style.display = "block";
                svgs[0].style.display = "none";
                svgs[1].style.display = "block";
            }
        });
        i++;
    }
}