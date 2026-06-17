import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import WatchLive from './pages/WatchLive.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import KidsClubPage from './pages/KidsClubPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import WaterParticlesCanvas from './components/WaterParticlesCanvas.jsx';
import useAmbientAudio from './hooks/useAmbientAudio.js';

export default function App() {
  const [page, setPage] = useState('home');
  const { isPlaying, toggleAudio } = useAmbientAudio();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home setPage={setPage} />;
      case 'watch':
        return <WatchLive />;
      case 'explore':
      case 'marine-life':
        return <ExplorePage />;
      case 'kids-club':
        return <KidsClubPage />;
      case 'education':
      case 'conservation':
        return <EducationPage setPage={setPage} />;
      case 'about':
        return <AboutPage />;
      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <WaterParticlesCanvas />
      <Header 
        page={page} 
        setPage={setPage} 
        isAudioPlaying={isPlaying} 
        onToggleAudio={toggleAudio} 
      />
      <main className="mainContent">
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}

