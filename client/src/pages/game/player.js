//User actions

class PokerPlayer {
	constructor(gameSocket, playerId) {
		this.gameSocket = gameSocket;
        this.playerId = playerId;
        this.stack = 1000;
        this.hand = [];

        console.log('Player joined: ', playerId);

        //This is just boiler plate I saw somewhere
        //Keeping it just as a remind of user actions
		gameSocket.on('disconnect', this.leaveTable);
        gameSocket.on('leaveTable', this.leaveTable);

        gameSocket.on('foldTable', this.foldTable);
        gameSocket.on('checkTable', this.checkTable);
        gameSocket.on('betTable', this.betTable);
        gameSocket.on('raiseTable', this.raiseTable);
        gameSocket.on('callTable', this.callTable);

	}
    modifyStack(amount){
        //Need to emit to the client
        this.stack += amount;
    }
    modifyHand(card){
        //Need to emit to the client
        this.hand.push(card);
    }
}
//Define functions 
export default PokerPlayer;
