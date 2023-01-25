const express = require('express')
const app = express();

const http = require('http');
const index = http.Server(app);

// const socketIO = require('socket.io');
// const io = socketIO(index);
const io = require("socket.io")(index, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const port = process.env.PORT || 3000;

// io.sockets.on('connection', (socket) => {
//     // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
//     const ID = (socket.id).toString().substring(0, 5);
//     const time = (new Date).toLocaleTimeString();
//     // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
//     socket.json.send({'event': 'connected', 'name': ID, 'time': time});
//     // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
//     socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
//     // Навешиваем обработчик на входящее сообщение
//     socket.on('message', function (msg) {
//         const time = (new Date).toLocaleTimeString();
//         // Уведомляем клиента, что его сообщение успешно дошло до сервера
//         socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
//         // Отсылаем сообщение остальным участникам чата
//         socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
//     });
//     // При отключении клиента - уведомляем остальных
//     socket.on('disconnect', function() {
//         const time = (new Date).toLocaleTimeString();
//         io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
//     });
// });
io.on('connection', (socket) => {
    console.log('new connection made');
    // socket.emit('message', {
    //     messages
    // });
    // socket.on('event1', (data) => {
    //     console.log(data.msg);
    // });
    socket.on('message', (message) => {
        console.log(message);
        const msg = {
            userID: socket.id,
            username: socket.id,
            text: message,
        }
        io.emit('message', msg);
    });

    // socket.on('message', (msg) => {
    //     console.log('message: ',msg);
    //     messages.push(msg);
    //     socket.emit('message', {
    //         messages
    //     });
    // });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });

    // socket.emit('event2', {
    //     msg: 'Server to client, do you read me? Over.'
    // });

    // socket.on('event3', (data) => {
    //     console.log(data.msg);
    //     socket.emit('event4', {
    //         msg: 'Loud and clear :)'
    //     });
    // });
});
// io.on('send-message', (message) => {
//     console.log('user message', message);
//     io.emit(message);
// });

// io.on("connection", (socket) => {
//     // const users = [];
//     // for (let [id, socket] of io.of("/").sockets) {
//     //     users.push({
//     //         userID: id,
//     //         username: socket.username,
//     //     });
//     // }
//     // socket.emit("users", users);
//
//     socket.broadcast.emit("user connected", {
//         userID: socket.id,
//         username: socket.username,
//     });
//     // console.log('user connected', users);
//     // ...
// });

// io.on('connection', (socket) => {
//     console.log('user connected');
// });
//
// io.on('new-message', (message) => {
//     console.log('user message', message);
//     io.emit(message);
// });

index.listen(port, () => {
    console.log(`started on port: ${port}`);
});