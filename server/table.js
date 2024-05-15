class Table {
    constructor(io, roomId) {
        this.io = io;
        this.roomId = roomId;
        this.players = [];
        this.deck = this.createDeck();
        this.currentRound = null;
    }

    createDeck() {
        const suits = ['s', 'h', 'd', 'c'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push(value + suit);
            }
        }
        return deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    startRound() {
        this.shuffleDeck();
        this.currentRound = {
            hands: {
                [this.players[0].id]: [this.deck.pop(), this.deck.pop()],
                [this.players[1].id]: [this.deck.pop(), this.deck.pop()]
            }
        };
        this.io.to(this.roomId).emit('cardsDealt', this.currentRound.hands);
    }
}

module.exports = Table;
