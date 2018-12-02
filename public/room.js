
//Подключение
socket.on('connect', function () {
    var urlParams = new URLSearchParams(window.location.search);
    let r = Math.random().toString(36).substring(7);
    let name = r;
    let room = urlParams.get('id');
    let params = { name: name, room: room };
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            console.log('ok');
        }
    });
});