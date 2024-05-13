import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PokerPlayer from './player';
import Table from './table';

function Play({ socket }) {
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [playerNumber, setPlayerNumber] = useState(0);
    const [clientID, setClientID] = useState(0);

    const table = new Table(socket);

    useEffect(() => {
        setPlayerNumber(location.state.id);
    }, []);

    useEffect(() => {
        socket.on('updatePlayers', handleUpdatePlayers);
        return () => {
            socket.off('updatePlayers', handleUpdatePlayers);
        };
    }, [socket]);

    function handleUpdatePlayers(updatedPlayers) {
        console.log('Players:', updatedPlayers);
        if (playerNumber === 1) {
            console.log('Client ID:', updatedPlayers[0]);
            setClientID(updatedPlayers[0]);
        } else if (playerNumber === 2) {
            console.log('Client ID:', updatedPlayers[1]);
            setClientID(updatedPlayers[1]); 
        }
        setPlayers(updatedPlayers);
        if (updatedPlayers.length === 2) {
            console.log('Starting game');
            updatedPlayers.forEach(playerId => {
                console.log('Adding player:', playerId);
                const aPlayer = new PokerPlayer(socket, playerId);
                table.addPlayer(aPlayer);
            });

            table.newRound();
        }
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-2">Room Code: {location.state.name}</div>
                <ul>
                    {players.map((player, index) => {
                       
                        if (player.playerId === clientID) {
                            return (
                                <li key={index} className="mb-4">
                                    <strong>Your Cards:</strong> {player.hand}
                                </li>
                            );
                        }
                    })}
                </ul>
            </div>
        </>
    );
}

export default Play;
