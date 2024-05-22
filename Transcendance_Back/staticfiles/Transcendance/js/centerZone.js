
// existing_main.append(create_btn_setn("btn-set1"));
// existing_main.append(create_btn_setn("btn-set2"));
// existing_main.append(create_btn_setn("btn-set3"));

const centerZone =
{
    // this: document.getElementsByClassName('centerZone')[0],
    inner: document.getElementById("main-div"),

    listen: function ()
    {
        // if (this== null)
        // {
        //     this= existing_main;
        // }
        // this.onclick = centerZone.listener.onClick.bind(this);
        // event listeners
        // if (this.wrapper == null)
        // {
        //     this.wrapper = existing_main;
        // }
        this.inner.onclick = centerZone.listener.onClick.bind(this);
    }

};