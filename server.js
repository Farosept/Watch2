const express = require("express"),
        app = express(),
        http = require("http"),
        server = http.createServer(app).listen(3000),
        ejs = require('ejs'),
        bodyParser = require('body-parser'),
        io = require("socket.io")(http);
var bodypar = bodyParser.urlencoded({extended: false});
io.listen(server);
app.post("/room",bodypar,(req,res)=>{
    console.log(req.body)
   

    res.render("room",{
        source:req.body["source"]
    })
});
app.get("/",(req,res)=>{
    res.render("index",{

    })
});
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use("/public",express.static( __dirname + '/public' ));// хранение css/js/files

io.sockets.on("connection",(socket)=>{
    var sinc = [];
    var ID = (socket.id).toString().substr(0,5);
    var time = (new Date).toLocaleTimeString();
    var room = "room1";

    socket.json.send({'event':'connected','name':ID,'time': time});

    socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
////////////////////////////////
    socket.on('message',(msg)=>{
        var time = (new Date).toLocaleTimeString();
        socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
        socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
    });
////////////////////////////////
    socket.on('control',(msg)=>{
        if(msg['event']=="timeUpdate"){
            socket.broadcast.emit("control",msg);
            return;
        }
        io.sockets.emit("control",msg);
    });
////////////////////////////////
});

