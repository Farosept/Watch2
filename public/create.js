function uuid () {
    var s4 = function() {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}
var ROOM = location.hash.substr(1);

if (!ROOM) {
    ROOM = uuid();
}
room_link.innerHTML = "<a href='#"+ROOM+"'>Link to the room</a>";

var ME = uuid();

socket.on("new", socketNewPeer);
socket.emit("room", JSON.stringify({id: ME, room: ROOM}));
