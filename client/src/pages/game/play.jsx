import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Play({ socket }) {
    const location = useLocation();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.emit('requestPlayers')
        socket.on('updatePlayers', handleUpdatePlayers);

        return () => {
            socket.off('updatePlayers', handleUpdatePlayers);
        };
    }, [socket]);

   
    function handleUpdatePlayers(updatedPlayers) {
        setPlayers(updatedPlayers);
    }

    return (
        <>
            <div>Play</div>
            <div>Room Name: {location.state.name}</div>
            <div>Players:</div>
            <ul>
                {players.map((playerId, index) => (
                    <li key={index}>{playerId}</li>
                ))}
            </ul>
        </>
    );
}

export default Play;
