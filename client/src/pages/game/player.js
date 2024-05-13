//User actions

class PokerPlayer {
	constructor(gameSocket, playerId) {
		this.gameSocket = gameSocket;
        this.playerId = playerId;
        this.stack = 1000;
        this.hand = [];


        //This is just boiler plate I saw somewhere
        //Keeping it just as a remind of user actions
		gameSocket.on('disconnect', this.leaveTable);
        gameSocket.on('leaveTable', this.leaveTable);

        gameSocket.on('foldTable', this.foldTable);
        gameSocket.on('checkTable', this.checkTable);
        gameSocket.on('betTable', this.betTable);
        gameSocket.on('raiseTable', this.raiseTable);
        gameSocket.on('callTable', this.callTable);
        gameSocket.on('allInTable', this.allInTable);

        gameSocket.on('cardsDealt', this.requestCards.bind(this));


    

	}
    requestCards(cards){
        console.log(this.playerId)
        this.hand = cards;
        console.log("Player:",this.playerId,"recieved:", this.hand);
    }


}
//Define functions 
export default PokerPlayer;
