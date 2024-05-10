import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PokerPlayer from './player';
import Table from './table';



function Play({ socket }) {
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    const table = new Table(socket);

    useEffect(() => {
        socket.emit('requestPlayers');
        socket.on('updatePlayers', handleUpdatePlayers);

        return () => {
            socket.off('updatePlayers', handleUpdatePlayers);
        };
    }, [socket]);

    function handleUpdatePlayers(updatedPlayers) {
        setPlayers(updatedPlayers);
        if (updatedPlayers.length === 2) {
            console.log('Starting game');
            updatedPlayers.forEach(playerId => {
                const aPlayer = new PokerPlayer(socket, playerId);
                table.addPlayer(aPlayer);
            });
             //this would be changed to somewhere else so we can keep calling it
            table.newRound();
        }
    }
    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-2">Room Code: {location.state.name}</div>
                <div className="mb-2">
                    Players:{' '}
                    <ul>
                        {players.map((playerId, index) => (
                            <li key={index} className="mb-1">
                                {playerId} <strong>(Player {index + 1})</strong>
                            </li>
                        ))}
                    </ul>
                </div>
                <ul className="mb-4"></ul>
                <div className="mb-2">Cards:</div>
                {/* <ul>
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
                </ul> */}
            </div>
        </>
    );
}

export default Play;
