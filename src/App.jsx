import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import WatchLive from './pages/WatchLive.jsx';
import KidsClubPage from './pages/KidsClubPage.jsx';
import MarineGuide from './pages/MarineGuide.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import AIFeaturesPage from './pages/AIFeaturesPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
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
      case 'kids-club':
        return <KidsClubPage />;
      case 'marine-guide':
        return <MarineGuide />;
      case 'community':
        return <CommunityPage />;
      case 'ai-features':
        return <AIFeaturesPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div className={`app page-${page}`}>
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

