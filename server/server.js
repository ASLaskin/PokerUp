require('dotenv').config();
const { makeid } = require('./utils');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const port = 5000;
const app = express();
app.use(cors());
const server = http.createServer(app);


const MONGODB_PASS = process.env.MongoDBPass;
const mongoURI = `mongodb+srv://AndrewPokerUp:${MONGODB_PASS}@cluster0.axjopzt.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const clientRooms = {};
const playersInRoom = {}; 

io.on('connection', client => {
    console.log('Client Connected: ', client.id);
    client.on('joinGame', handleJoinGame);
    client.on('newGame', handleNewGame);

    function handleJoinGame(roomName) {
        console.log('Joining room', roomName);
        const room = io.sockets.adapter.rooms.get(roomName);
        console.log('Room', room);

        let numClients = 0;
        if (room) {
            numClients = room.size;
        }

        console.log("The rooms available", clientRooms);
        if (numClients === 0) {
            console.log('Room not found');
            client.emit('unknownCode');
            return;
        } else if (numClients > 1) {
            console.log('Room is full');
            client.emit('tooManyPlayers');
            return;
        }
        console.log('Room found');

        clientRooms[client.id] = roomName;
        client.join(roomName);
        client.number = 2;

        // Add player to playersInRoom dictionary
        if (!playersInRoom[roomName]) {
            playersInRoom[roomName] = [];
        }
        playersInRoom[roomName].push(client.id);

        // Emit updated players list to clients in the room
        io.to(roomName).emit('updatePlayers', playersInRoom[roomName]);

        console.log('Room joined starting game');
        client.emit('init', 2);
        console.log('Players in room', roomName, playersInRoom[roomName]);
    }

    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        console.log('Creating new game with room name', roomName);

        client.emit('gameCode', roomName);

        client.join(roomName);
        client.number = 1;

        if (!playersInRoom[roomName]) {
            playersInRoom[roomName] = [];
        }
        playersInRoom[roomName].push(client.id);

        io.to(roomName).emit('updatePlayers', playersInRoom[roomName]);

        client.emit('init', 1);
        console.log('Players in room', roomName, playersInRoom[roomName]);
    }

    client.on('disconnect', () => {
        console.log('A client disconnected');
        const roomName = clientRooms[client.id];
        if (roomName && playersInRoom[roomName]) {
            // Remove player from playersInRoom dictionary
            playersInRoom[roomName] = playersInRoom[roomName].filter(id => id !== client.id);

            // Emit updated players list to clients in the room
            io.to(roomName).emit('updatePlayers', playersInRoom[roomName]);
        }
        delete clientRooms[client.id];
    });
});

// Start the HTTP server
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
