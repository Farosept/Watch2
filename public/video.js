var iframe = $('iframe')[0].contentWindow,
    stop = false;
$(function () {
    if (window.addEventListener) {
        window.addEventListener('message', mwPlayerMessageReceive);
    } else {
        window.attachEvent('onmessage', mwPlayerMessageReceive);
    }
});

function mwPlayerMessageReceive(event) {
    console.log(event.data)
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
document.getElementById("button-addon-send").addEventListener("click",()=>{
    socket.emit('addVideo', { source: document.getElementById("source").value});
})

socket.on('source', function (msg) {
    document.getElementById("video").src = msg;
    $('.collapse').collapse()
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
