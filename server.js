const express = require("express"),
        app = express(),
        http = require("http"),
        server = http.createServer(app).listen(3000,()=>{console.log("http://localhost:3000")}),
        io = require("./socket")(server);

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/room",(req, res)=>{
    res.render("room",{
        roomId: req.query.id
    });
});
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use("/public",express.static( __dirname + '/public' ));
