import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as Pages from './pages';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages.Home socket={socket} />} />
        <Route path="/play" element={<Pages.Play socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
