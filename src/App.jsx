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
import AuthModal from './components/AuthModal.jsx';
import useAmbientAudio from './hooks/useAmbientAudio.js';

export default function App() {
  const [page, setPage] = useState('home');
  const { isPlaying, toggleAudio } = useAmbientAudio();

  // Authentication and gamification states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('swc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [shells, setShells] = useState(() => {
    const saved = localStorage.getItem('swc_shells');
    return saved ? parseInt(saved, 10) : 120; // default 120 shells
  });

  // Simulated live donation pools (Kingston and Saltwatercam)
  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('swc_community_donations');
    return saved ? JSON.parse(saved) : { Kingston: 3420, Saltwater: 5840 };
  });

  const [userDonations, setUserDonations] = useState(() => {
    const saved = localStorage.getItem('swc_user_donations');
    return saved ? JSON.parse(saved) : { Kingston: 0, Saltwater: 0 };
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('swc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('swc_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('swc_shells', shells.toString());
  }, [shells]);

  useEffect(() => {
    localStorage.setItem('swc_community_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('swc_user_donations', JSON.stringify(userDonations));
  }, [userDonations]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const addShells = (amount) => {
    setShells(prev => prev + amount);
  };

  const handleDonate = (charity, amount) => {
    if (shells < amount) return false;
    setShells(prev => prev - amount);
    setDonations(prev => ({
      ...prev,
      [charity]: prev[charity] + amount
    }));
    setUserDonations(prev => ({
      ...prev,
      [charity]: prev[charity] + amount
    }));
    return true;
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Give welcome shells when profile is registered/logged in
    setShells(prev => prev + 50);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home setPage={setPage} />;
      case 'watch':
        return <WatchLive addShells={addShells} currentUser={currentUser} />;
      case 'kids-club':
        return <KidsClubPage addShells={addShells} shells={shells} />;
      case 'marine-guide':
        return <MarineGuide />;
      case 'community':
        return <CommunityPage />;
      case 'ai-features':
        return <AIFeaturesPage />;
      case 'rewards':
        return (
          <RewardsPage 
            shells={shells} 
            setShells={setShells}
            onDonate={handleDonate}
            communityDonations={donations}
            userDonations={userDonations}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        );
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
        currentUser={currentUser}
        shells={shells}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className="mainContent">
        {renderPage()}
      </main>
      <Footer setPage={setPage} />

      {/* Glassmorphic Login/Register Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

