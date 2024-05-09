import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ socket }) {
	const navigate = useNavigate();
	const [roomName, setRoomName] = useState('');

	useEffect(() => {
		socket.on('gameCode', handleGameCode);
		socket.on('tooManyPlayers', () => {
			alert('Room is full');
		});
		socket.on('unknownCode', () => {
			alert('Game code not found');
		});

		return () => {
			socket.off('tooManyPlayers');
			socket.off('unknownCode');
		};
	}, [socket]);

	function handleGameCode(gameCode) {
		setRoomName(gameCode);
		navigate('/play', { state: { id: 1, name: gameCode } });
	}

	function newGame() {
		socket.emit('newGame');
	}

	function joinGame() {
		const inputValue = document.getElementById('gameCodeInput').value;
		console.log(inputValue);
		socket.emit('joinGame', inputValue);
		socket.on('init', (number) => {
			navigate('/play', { state: { id: number, name: inputValue } });
		});
	}

	return (
		<div className="bg-gray-100 flex justify-center items-center h-screen">
			<h1>{roomName}</h1>
			<div className="bg-white p-8 rounded-lg shadow-md">
				<div className="flex justify-center">
					<h1 className="text-3xl mb-6">PokerUp</h1>
				</div>
				<div className="flex justify-center">
					<div className="mr-4">
						<div className="flex justify-center">
							<h2 className="text-xl mb-4">Join Game</h2>
						</div>
						<div className="flex mb-4">
							<input
								id="gameCodeInput"
								type="text"
								className="border rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-40"
								placeholder="Game ID"
							/>
							<button
								onClick={joinGame}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
							>
								Join
							</button>
						</div>
					</div>
					<div className="ml-4">
						<h2 className="text-xl mb-4">Create New Game</h2>
						<div className="flex justify-center">
							<button
								onClick={newGame}
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
