import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Play({ socket }) {
    const location = useLocation();
    const [count, setCount] = useState(0);

    useEffect(() => {
        socket.on('updateCounter', ({ roomName, count }) => {
            if (roomName === location.state.name) {
                setCount(count);
            }
        });
        return () => {
            socket.off('updateCounter');
        };
    }, [socket, location.state.name]);

    const handleButtonClick = () => {
        socket.emit('pressButton', location.state.name);
    };

    return (
        <>
            <div>Play</div>
            <div>Room Name: {location.state.name}</div>
            <div>Counter: {count}</div>
            <button onClick={handleButtonClick}>Press Button</button>
        </>
    );
}

export default Play;
