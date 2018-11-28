const express = require("express"),
        app = express(),
        http = require("http"),
        server = http.createServer(app).listen(3000),
        io = require("./socket")(server);

app.get("/",(req,res)=>{
    res.render("index",{

    })
});
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use("/public",express.static( __dirname + '/public' ));
