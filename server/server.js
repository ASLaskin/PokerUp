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

    client.on('requestPlayers', () => {
        console.log('Requesting players');
        const roomName = clientRooms[client.id];
        if (roomName && playersInRoom[roomName]) {
            client.emit('updatePlayers', playersInRoom[roomName]);
        }
    });

    client.on("requestCards", ( players) => {
        handleDealCards(client, players);
        
    });

    //I want to move these to different files so this one isnt crazy long
    function handleDealCards(socket, players) {
        console.log('Dealing cards');
        const deck = [
            'As', 'Ks', 'Qs', 'Js', '10s', '9s', '8s', '7s', '6s', '5s', '4s', '3s', '2s',
            'Ad', 'Kd', 'Qd', 'Jd', '10d', '9d', '8d', '7d', '6d', '5d', '4d', '3d', '2d',
            'Ac', 'Kc', 'Qc', 'Jc', '10c', '9c', '8c', '7c', '6c', '5c', '4c', '3c', '2c',
            'Ah', 'Kh', 'Qh', 'Jh', '10h', '9h', '8h', '7h', '6h', '5h', '4h', '3h', '2h'
        ];
        
        const shuffledDeck = shuffle(deck);
    
        const dealtCards = {};
    
        players.forEach(player => {
            dealtCards[player] = [];
    
            for (let i = 0; i < 2; i++) {
                const card = shuffledDeck.pop(); 
                dealtCards[player].push(card);
            }
            console.log('Dealt cards for', player, ':', dealtCards[player]);
        });
    
        socket.emit('cardsDealt', { cards: dealtCards });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
        
    client.on('disconnect', () => {
        console.log('A client disconnected');
        const roomName = clientRooms[client.id];
        if (roomName && playersInRoom[roomName]) {
            playersInRoom[roomName] = playersInRoom[roomName].filter(id => id !== client.id);

           
            io.to(roomName).emit('updatePlayers', playersInRoom[roomName]);
        }
        delete clientRooms[client.id];
    });

});

// Start the HTTP server
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
