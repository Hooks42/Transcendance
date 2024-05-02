profile.listener =
{
    onClickCollapsible: function (event)
    {
        console.log("click");
        if (event.target.closest(".js-btn-collapsible"))
        {
            let target = event.target.closest(".js-btn-collapsible");
            if (!target)
                return;
            document.querySelectorAll('.js-btn-collapsible').forEach(e =>
            {
                if (!e.contains(target))
                    return;
            });
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
    }

};