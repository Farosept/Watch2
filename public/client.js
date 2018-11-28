var socket = io(),
    stop = false,
    iframe = $('iframe')[0].contentWindow;

$(function () {
    if (window.addEventListener) {
        window.addEventListener('message', mwPlayerMessageReceive);
    } else {
        window.attachEvent('onmessage', mwPlayerMessageReceive);
    }
});

function mwPlayerMessageReceive(event) {
    if (event.data) {
        if (event.data.event == "inited") {
            socket.emit("control", escape("init"));
        }
        if (event.data.event == "rewound") {
            iframe.postMessage({ method: 'pause' }, '*');
            if (stop == false) {
                socket.emit("control", { 'event': "timeUpdate", 'time': event.data.time });
            }
            stop = false;
        }
        if (event.data.event == "paused") {
            socket.emit("control", escape("pause"));
        }
        if (event.data.event == "resumed") {
            socket.emit("control", escape("play"));
        }
    }
}
//Подключение
socket.on('connect', function () {
        document.getElementById("send").addEventListener("click", () => {
        let name = document.getElementById("user");
        let room = document.getElementById("room");
        document.getElementById("video").src = document.getElementById("source").value;
        let params = { name: name.value, room: room.value, source: document.getElementById("source").value };
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
});
//Сообщение в логе
socket.on('newMessage', function (msg) {
    document.getElementById("log").innerHTML += msg + '<br/>';
});
socket.on('source', function (msg) {
    document.getElementById("video").src = msg;
});
//Управление плеером
socket.on('control', (msg) => {
    if (msg == "play") iframe.postMessage({ method: 'play' }, '*');
    if (msg == "pause") iframe.postMessage({ method: 'pause' }, '*');
    if (msg['event'] == "timeUpdate") {
        stop = true;
        iframe.postMessage({ method: 'seek', time: msg['time'] }, '*');
    }
    if (msg == "init") {
        iframe.postMessage({ method: 'play' }, '*');
    }
});


