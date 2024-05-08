//User actions

class PokerPlayer {
	constructor(socketio, gameSocket) {
		this.socketio = socketio;
		this.gameSocket = gameSocket;
		this.currentTable = null;
		this.currentSeat = null;

		gameSocket.on('disconnect', this.leaveTable);
        gameSocket.on('leaveTable', this.leaveTable);

        gameSocket.on('createTable', this.createTable);
        gameSocket.on('joinTable', this.joinTable);
        gameSocket.on('sitDown', this.sitDown);
        gameSocket.on('foldTable', this.foldTable);
        gameSocket.on('checkTable', this.checkTable);
        gameSocket.on('betTable', this.betTable);
        gameSocket.on('raiseTable', this.raiseTable);
        gameSocket.on('callTable', this.callTable);

	}
}
//Define functions 