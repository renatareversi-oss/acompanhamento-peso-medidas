import { HashRouter, Route, Routes } from 'react-router-dom';
import { ParticipantsProvider } from './store/ParticipantsContext';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';

function App() {
  return (
    <ParticipantsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/participante/:id" element={<Profile />} />
        </Routes>
      </HashRouter>
    </ParticipantsProvider>
  );
}

export default App;
