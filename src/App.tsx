import { HashRouter, Route, Routes } from 'react-router-dom';
import { ParticipantsProvider } from './store/ParticipantsContext';
import { ThemeProvider } from './store/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <ParticipantsProvider>
        <HashRouter>
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/participante/:id" element={<Profile />} />
          </Routes>
        </HashRouter>
      </ParticipantsProvider>
    </ThemeProvider>
  );
}

export default App;
