var express = require("express");
var http = require("http");
// const bodyParser = require('body-parser');
const fs = require("fs");
var app = express();
app.use(express.json());
var server = http.createServer(app);
var io = require("socket.io")(server, {
    cors: {
        origin: ["http://127.0.0.1:5173/"],
    },
});

var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "hvr-save-data-hvrsave.d.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_IcjmrPjcsbuhP4OZY8E",
    database: "defaultdb",
    port: 10002
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

function dateFormat(date) {
    return `${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(date).getDate()} ${new Date(date).getHours()}:${new Date(date).getMinutes()}:${new Date(date).getSeconds()}`
}

const a = dateFormat(new Date())

console.log(a, new Date());

var users = []
var rooms = []

function generateToken(length) {
    //edit the token allowed characters
    var a =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

app.get("/", function (req, res) {
    res.send("Uno express test server");
});

app.post("/saveHeartRateData", function (req, res) {
    var data = req.body;
    console.log(data);
    var sql = `INSERT INTO hrv_data (
        id, raw, peaks, pulse, times, date, filtered, name, age, gender, weight, height, health_condition
    ) VALUES (
        '${data.id}', '${data.raw}', '${data.peaks}', '${data.pulse}', '${data.times}', '${data.date}', '${data.filtered}', '${data.name}', '${data.age}', '${data.gender}', '${data.weight}', '${data.height}', '${data.health_condition}'
    )`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send("Done! 1 record inserted.");
    });
});

io.on("connection", (socket) => {

    var socketIP = socket.conn.remoteAddress;

    console.log(socket.id + " connected from " + socketIP);

    socket.on("login", () => { });

    socket.on("logout", (token) => {
        console.log(token)
        // var index = users.findIndex( obj => obj.token === token);
        var i = 0
        for (i = 0; i < users.length; i++) {
            console.log(users[i]);
            if (users[i].token === token)
                console.log("found" + i);
        }
        // console.log(users[i].name + " has logged out");
        users.splice(i, 1)
        io.to(socket.id).emit('logout')
        // console.log(users);
    });

    socket.on("name", (name) => {
        var newToken = generateToken(32);
        users.push({
            socket: socket.id,
            name: name,
            token: newToken,
        });
        console.log(users);
        io.to(socket.id).emit("token", { token: newToken });
    });

    socket.on("ping", () => {
        io.emit("pong");
    });

    socket.on("disconnect", () => {
        console.log(socket.id + " has disconnected");
        users.splice(
            users.findIndex((obj) => obj.socket === socket.id), 1
        )
    });

    socket.on("chat", (msg) => {
        for (let i = 0; i < users.length; i++) {
            io.to(users[i]).emit("new msg", { msg: msg, id: socket.id });
        }
    });

    socket.on("join room", (roomID) => {
        var index = rooms.findIndex(r => r.id === roomID);
        // if(index === -1) 
    });
});

server.listen({ port: 3001 }, function () {
    // console.log('listening on *:3001');
    console.log("Server running on http://localhost:3001");
});