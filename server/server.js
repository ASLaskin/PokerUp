require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketHandler = require('./socketHandlers');

const port = 5000;
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

socketHandler(io);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
