const express = require('express')
const app = express();

const http = require('http');
const index = http.Server(app);

const io = require("socket.io")(index, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        const msg = {
            userID: socket.id,
            username: socket.handshake.query.username,
            text: message,
            date: (new Date).toLocaleTimeString()
        }
        io.emit('message', msg);
    });

    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.handshake.query.username,
            token: socket.handshake.query.token
        });
    }
    io.emit("users", users);


    socket.on('disconnect', () => {
        users = users.filter( item => item.userID !== socket.id);
        io.emit("users", users);
    });

});

index.listen(port, () => {
    console.log(`started on port: ${port}`);
});