const socket = {

	launch_socket: function ()
    {
        this.chat_socket = new WebSocket('wss://localhost/ws/chat/');

        this.chat_socket.onopen = function (e)
        {
            console.log('Socket opened');
            chat.create();
            chat.load();
            navbar.create();
            navbar.load();
        };

        this.chat_socket.onclose = function (e)
        {
            console.error('Socket closed');
        }

        this.chat_socket.onmessage = (event) => 
        {
            let data = JSON.parse(event.data);
            console.log("message recieved ---> " + data.message);
            console.log("profile_picture ---> " + data.profile_picture);
            chat.add_chat(data.username, data.timestamp, data.message, data.profile_picture);
        };
    }
}