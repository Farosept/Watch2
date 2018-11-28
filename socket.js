var socket_io = require("socket.io"),
    { Users } = require('./models/user');

module.exports = (server) => {
    var io = socket_io(server);
    var users = new Users();

    io.on("connection", (socket) => {
        socket.on("join", (params, callback) => {
            const clients = io.sockets.adapter.rooms[params.room];
            const numClients = (typeof clients !== 'undefined') ? Object.keys(clients.sockets).length : 0;
            users.removeUser(socket.id);
            if(numClients == 0){
                console.log("create")
                users.addUser(socket.id, params.room, params.name, params.source, true);
            }else{
                console.log(users.getHostInRoom(params.room).source)
                users.addUser(socket.id, params.room, params.name, null, false);
                socket.emit('source', users.getHostInRoom(params.room).source);
            }
            socket.join(params.room);
            
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            socket.emit('newMessage', '<<Вы подключены к комнате: '+params.room+' >>');
            socket.broadcast.to(params.room).emit('newMessage',`<<Присоединился новый пользователь>> - ${params.name}`);
            callback();
        });
        socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);
            if (user && isRealString(message.text)) {
                /* Броадкаст сообщения всем в определенной комнате */
                io.to(user.room).emit('newMessage', user.name + ":" + message.text);
            }
            callback();
        });
        socket.on('control', (msg) => {
            if (msg['event'] == "timeUpdate") {
                socket.broadcast.emit("control", msg);
                return;
            }
            io.sockets.emit("control", msg);
        });
    });

}