//Game logic who won, other stuff
//This determines winner 
//https://www.npmjs.com/package/@xpressit/winning-poker-hand-rank

//This could be useful imma further test 
//https://www.npmjs.com/package/@splithyperion56/poker-hand#usage

class Table{
    constructor(gameSocket){
        this.gameSocket = gameSocket;
        this.players = [];


    }
    addPlayer(player){
        console.log(player)
        this.players.push(player);
        console.log('Player added: ', player.playerId);
    }
    newRound(){
        console.log('New Round');
        this.gameSocket.emit('requestCards', this.players);
        console.log('Requested cards');
        this.gameSocket.on('dealCards', this.dealCards);

    }

}
export default Table;