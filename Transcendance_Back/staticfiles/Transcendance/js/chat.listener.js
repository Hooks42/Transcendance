const btn_nav = document.querySelectorAll('button.btn-nav');
// const arrow_tab = document.querySelector("button.btn-arrow");

const discussions = document.querySelectorAll('#disc_pane > button.btn-heart-list');
const users = document.querySelectorAll('#user_pane > button.btn-heart-list');

// const action_pane = document.querySelectorAll("#action_pane");
// const chatroom = document.getElementById("chatroom-tab");
// const chat_list = document.querySelectorAll("div.chat__list");
let current_pane = document.querySelector('.tab-pane.active.show');

function get_active_pane()
{
    return (document.querySelector('.tab-pane.active.show'));
}


// listener for navbar buttons
btn_nav.forEach(triggerEl =>
{
    const tabTrigger = new bootstrap.Tab(triggerEl);

    triggerEl.addEventListener('click', event =>
    {
        event.preventDefault();
        tabTrigger.show();
    })
})

arrow_tab.addEventListener("click", event =>
{
    event.preventDefault();
    arrow_tab.classList.toggle("hide");
    chatroom.style.display = "none";
    action_pane.style.display = "none";
    btn_nav.forEach(triggerE =>
    {
        triggerE.classList.toggle("hide");
    })

    // current_pane.classList.add("active", "show");
    current_pane.classList.toggle("active");
    current_pane.classList.toggle("show");
})

// listener for list items
discussions.forEach(element =>
{
    element.addEventListener('click', event =>
    {
        event.preventDefault();
        btn_nav.forEach(triggerE =>
        {
            triggerE.classList.toggle("hide");
        })
        current_pane = get_active_pane();
        current_pane.classList.toggle("active");
        current_pane.classList.toggle("show");
        arrow_tab.classList.toggle("hide");

        chatroom.style.display = "flex";
    })
})

users.forEach(element =>
{
    element.addEventListener('click', event =>
    {
        event.preventDefault();
        btn_nav.forEach(triggerE =>
        {
            triggerE.classList.toggle("hide");
        })
        current_pane = get_active_pane();
        // current_pane.classList.remove("active", "show");
        current_pane.classList.toggle("active");
        current_pane.classList.toggle("show");
        arrow_tab.classList.toggle("hide");

        action_pane.style.display = "flex";
    })
})
