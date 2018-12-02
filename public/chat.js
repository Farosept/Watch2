
//Сообщение в логе
socket.on('newMessage', function (msg) {
    document.getElementById("log").innerHTML += msg + '<br/>';
});