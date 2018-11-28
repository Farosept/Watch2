var socket_io = require("socket.io");

module.exports = (server)=>{
    var users = {};
    var io = socket_io(server);

    io.on("connection", (socket)=>{
        socket.on("room",(message)=>{
            var message_json = JSON.parse(message);
            //Добавляем сокет в список пользователей
            users[message_json.id] = socket;
            if(socket.room !== undefined){
                socket.leave(socket.room);
            }
            socket.room = message_json.room;
            socket.join(socket.room);
            socket.user_id = message_json.id;
            socket.broadcast.to(socket.room).emit("new", message_json.id);
        });

        socket.on("disconnect", function() {
            // При отсоединении клиента, оповещаем об этом остальных
            socket.broadcast.to(socket.room).emit("leave", socket.user_id);
            delete users[socket.user_id];
        });
        
    });
}