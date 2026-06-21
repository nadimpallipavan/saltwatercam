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
import { authService } from './supabaseClient.js';
import { ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('home');
  const { isPlaying, toggleAudio } = useAmbientAudio();

  // Authentication and gamification states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // SMS notification simulator
  const [smsAlert, setSmsAlert] = useState(null);

  const triggerSmsAlert = (title, message, phone, type = 'success') => {
    setSmsAlert({ title, message, phone, type });
    // Reset timer
    setTimeout(() => {
      setSmsAlert(null);
    }, 6000);
  };

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

  // 1. Subscribe to Authentication state updates on mount
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        
        // Personalize shell count for logged-in user
        const userShellsKey = `swc_shells_${user.id}`;
        const savedShells = localStorage.getItem(userShellsKey);
        if (savedShells) {
          setShells(parseInt(savedShells, 10));
        } else {
          // Merge guest shells or award standard welcome baseline
          const guestShells = parseInt(localStorage.getItem('swc_shells') || '120', 10);
          setShells(guestShells);
          localStorage.setItem(userShellsKey, guestShells.toString());
        }

        // Personalize user donations
        const userDonsKey = `swc_user_donations_${user.id}`;
        const savedDons = localStorage.getItem(userDonsKey);
        if (savedDons) {
          setUserDonations(JSON.parse(savedDons));
        } else {
          const guestDons = JSON.parse(localStorage.getItem('swc_user_donations') || '{"Kingston":0,"Saltwater":0}');
          setUserDonations(guestDons);
          localStorage.setItem(userDonsKey, JSON.stringify(guestDons));
        }
      } else {
        setCurrentUser(null);
        // Reset to guest shells baseline
        const guestShells = parseInt(localStorage.getItem('swc_shells') || '120', 10);
        setShells(guestShells);
        const guestDons = JSON.parse(localStorage.getItem('swc_user_donations') || '{"Kingston":0,"Saltwater":0}');
        setUserDonations(guestDons);
      }
    });

    return () => unsubscribe();
  }, []);

  // Keep community donations in sync in localStorage
  useEffect(() => {
    localStorage.setItem('swc_community_donations', JSON.stringify(donations));
  }, [donations]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const addShells = (amount) => {
    setShells(prev => {
      const next = prev + amount;
      if (currentUser) {
        localStorage.setItem(`swc_shells_${currentUser.id}`, next.toString());
      }
      localStorage.setItem('swc_shells', next.toString());
      return next;
    });
  };

  const handleDonate = (charity, amount) => {
    if (shells < amount) return false;
    
    setShells(prev => {
      const next = prev - amount;
      if (currentUser) {
        localStorage.setItem(`swc_shells_${currentUser.id}`, next.toString());
      }
      localStorage.setItem('swc_shells', next.toString());
      return next;
    });

    setDonations(prev => {
      const next = {
        ...prev,
        [charity]: prev[charity] + amount
      };
      return next;
    });

    setUserDonations(prev => {
      const next = {
        ...prev,
        [charity]: prev[charity] + amount
      };
      if (currentUser) {
        localStorage.setItem(`swc_user_donations_${currentUser.id}`, JSON.stringify(next));
      }
      localStorage.setItem('swc_user_donations', JSON.stringify(next));
      return next;
    });

    return true;
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Give welcome shells when profile is registered/logged in
    setShells(prev => {
      const next = prev + 50;
      if (user) {
        localStorage.setItem(`swc_shells_${user.id}`, next.toString());
      }
      localStorage.setItem('swc_shells', next.toString());
      return next;
    });
  };

  const handleLogout = async () => {
    await authService.signOut();
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
        triggerSmsAlert={triggerSmsAlert}
      />

      {/* Slide-In SMS Notification Simulator */}
      {smsAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '380px',
          background: 'rgba(10, 25, 41, 0.95)',
          border: smsAlert.type === 'error' ? '1.5px solid #ef4444' : '1.5px solid #22d3ee',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: smsAlert.type === 'error' ? '0 10px 30px rgba(239, 68, 68, 0.3), 0 0 20px rgba(0, 0, 0, 0.8)' : '0 10px 30px rgba(34, 211, 238, 0.3), 0 0 20px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          animation: 'slideDownAlert 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Banner Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: smsAlert.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 211, 238, 0.15)',
            border: smsAlert.type === 'error' ? '1px solid #ef4444' : '1px solid #22d3ee',
            color: smsAlert.type === 'error' ? '#f87171' : '#22d3ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {smsAlert.type === 'error' ? <ShieldAlert size={20} /> : <Sparkles size={20} />}
          </div>
          
          {/* Banner Content */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#b7cad6', fontWeight: '800', fontFamily: 'monospace' }}>
                💬 SMS GATEWAY ({smsAlert.phone})
              </span>
              <span style={{ fontSize: '0.65rem', color: '#b7cad6' }}>now</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {smsAlert.title}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#b7cad6', marginTop: '2px', lineHeight: '1.3' }}>
              {smsAlert.message}
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={() => setSmsAlert(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b7cad6',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDownAlert {
          from { transform: translate(-50%, -100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

