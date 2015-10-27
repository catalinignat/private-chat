var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _chat;

var Database = {
    msgs: [],
    ips: [],
    sockets: [],
    userNames: [],
    numOnlineUsers: 0
}

var Chat = function (socket) {
    var address = socket.handshake.address,
        onlineLength = Database.numOnlineUsers;
    Database.sockets[onlineLength] = socket;


    if (Database.ips && Database.ips.indexOf(address) === -1) {
        Database.ips[onlineLength] = address;
        io.emit("check user exist", "notExist");
    } else {
        io.emit("check user exist", "isExist");
    }

    //io.emit("chat message", Database);
    console.log(address);

    this.connectionStable = function () { //this call only one for push all data to client
        socket.on("user", function (obj) {
            console.log(obj);
            Database.userNames[onlineLength] = obj.nick;

            io.emit("user", [Database.userNames, Database.msgs]);
        });
    }

    this.initMessages = function () {
        socket.on("new message", function (msg) {
            Database.msgs[onlineLength] = msg;

            io.emit("new message", msg);

        });
    }

}
io.on('connection', function (socket) {

    app.get('/', function (req, res) {
        res.end('New connection from');
    });
    _chat = new Chat(socket);
    _chat.connectionStable();

    socket.on("disconnect", function () {

        console.log("user has been disconet");

        Database.numOnlineUsers -= 1;
    });
    Database.numOnlineUsers += 1;
    console.log("total connection = " + Database.numOnlineUsers);
});
var port = process.env.PORT || 3000;
var domain = process.env.IP || "localhost";
console.log("app started at " + domain + ":" + port);
http.listen(port, process.env.IP);