const Table = require('./table');
const Player = require('./player');

const clientRooms = {};
const tables = {};
const playersInRoom = {};

module.exports = (io) => {
    io.on('connection', (client) => {
        console.log('Client Connected: ', client.id);

        client.on('joinGame', (data) => handleJoinGame(client, data));
        client.on('newGame', () => handleNewGame(client));
        client.on('requestCards', () => handleRequestCards(client));
        client.on('disconnect', () => handleDisconnect(client));

        function handleJoinGame(client, { roomName }) {
            const room = io.sockets.adapter.rooms.get(roomName);

            let numClients = 0;
            if (room) {
                numClients = room.size;
            }

            if (numClients === 0) {
                client.emit('unknownCode');
                return;
            } else if (numClients > 1) {
                client.emit('tooManyPlayers');
                return;
            }

            clientRooms[client.id] = roomName;
            client.join(roomName);

            if (!playersInRoom[roomName]) {
                playersInRoom[roomName] = [];
            }
            if (!playersInRoom[roomName].includes(client.id)) {
                playersInRoom[roomName].push(client.id);
            }

            const table = tables[roomName];
            if (!table) {
                console.error(`No table found for room: ${roomName}`);
                return;
            }

            const player = new Player(client.id);
            table.addPlayer(player);

            io.to(roomName).emit('updatePlayers', table.players.map(p => p.id));

            if (table.players.length === 2) {
                table.startRound();
            }
            client.emit('init', 2);

        }

        function handleNewGame(client) {
            let roomName = makeid(5);
            clientRooms[client.id] = roomName;
            client.join(roomName);

            const table = new Table(io, roomName);
            const player = new Player(client.id);
            table.addPlayer(player);

            tables[roomName] = table;

            if (!playersInRoom[roomName]) {
                playersInRoom[roomName] = [];
            }
            playersInRoom[roomName].push(client.id);

            client.emit('gameCode', roomName);
            client.emit('init', 1);
            io.to(roomName).emit('updatePlayers', table.players.map(p => p.id));
        }

        function handleRequestCards(client) {
            const roomName = clientRooms[client.id];
            if (!roomName) return;

            const table = tables[roomName];
            if (table) {
                table.startRound();
            }
        }

        function handleDisconnect(client) {
            const roomName = clientRooms[client.id];
            if (roomName && tables[roomName]) {
                const table = tables[roomName];
                table.players = table.players.filter(p => p.id !== client.id);

                io.to(roomName).emit('updatePlayers', table.players.map(p => p.id));

                if (table.players.length === 0) {
                    delete tables[roomName];
                    delete playersInRoom[roomName];
                } else {
                    playersInRoom[roomName] = playersInRoom[roomName].filter(id => id !== client.id);
                }
            }
            delete clientRooms[client.id];
        }
    });
};

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
