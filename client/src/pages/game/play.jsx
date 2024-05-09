import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Play({ socket }) {
	const location = useLocation();
	const [players, setPlayers] = useState([]);
	const [currentCards, setCurrentCards] = useState([]);

	useEffect(() => {
		socket.emit('requestPlayers');
		socket.on('updatePlayers', handleUpdatePlayers);
		socket.on('cardsDealt', handleCardsDealt);

		return () => {
			socket.off('updatePlayers', handleUpdatePlayers);
			socket.off('cardsDealt', handleCardsDealt);
		};
	}, [socket]);

	function handleUpdatePlayers(updatedPlayers) {
		setPlayers(updatedPlayers);
		if (updatedPlayers.length === 2) {
			console.log('Starting game');
			socket.emit('requestCards', location.state.name, updatedPlayers);
		}
	}
    function handleCardsDealt({ cards }) {
        console.log('Cards dealt', cards);
        setCurrentCards(cards);
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="text-2xl font-bold mb-4">Play</div>
                <div className="mb-2">Room Name: {location.state.name}</div>
                <div className="mb-2">Players:</div>
                <ul className="mb-4">
                    {players.map((playerId, index) => (
                        <li key={index} className="mb-1">{playerId}</li>
                    ))}
                </ul>
                <div className="mb-2">Cards:</div>
                <ul>
                    {Object.entries(currentCards).map(([playerId, cards], index) => (
                        <li key={index} className="mb-4">
                            <strong>{playerId}:</strong>
                            <ul className="ml-4">
                                {cards.map((card, cardIndex) => (
                                    <li key={cardIndex} className="mb-1">{card}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
    
}

export default Play;
