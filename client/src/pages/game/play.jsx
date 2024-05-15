import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Play({ socket }) {
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [currentCards, setCurrentCards] = useState({});
    const roomName = location.state.room;

    useEffect(() => {
        socket.on('updatePlayers', handleUpdatePlayers);
        socket.on('cardsDealt', handleCardsDealt);

        return () => {
            socket.off('updatePlayers', handleUpdatePlayers);
            socket.off('cardsDealt', handleCardsDealt);
        };
    }, [socket, roomName]);

    function handleUpdatePlayers(updatedPlayers) {
        setPlayers(updatedPlayers);
    }

    function handleCardsDealt(dealtCards) {
        setCurrentCards(dealtCards);
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-2">Room Code: {roomName}</div>
                <div className="mb-2">
                    Players:{' '}
                    <ul>
                        {players.map((player, index) => (
                            <li key={index} className="mb-1">
                                {player} <strong>(Player {index + 1})</strong>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-2">Cards:</div>
                <ul>
                    {Object.entries(currentCards).map(([playerId, cards], index) => (
                        <li key={index} className="mb-4">
                            <strong>Player {index + 1}:</strong>
                            <ul className="ml-4">
                                {cards.map((card, cardIndex) => (
                                    <li key={cardIndex} className="mb-1">
                                        {card}
                                    </li>
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
