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

export default function App() {
  const [page, setPage] = useState('home');
  const { isPlaying, toggleAudio } = useAmbientAudio();

  // Authentication and gamification states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  // Dynamic SEO Metadata updates based on active tab
  useEffect(() => {
    const seoData = {
      home: {
        title: 'SaltWaterCam | Live Underwater Camera Boynton Beach Inlet',
        desc: 'Watch a live 24/7 underwater camera near Lantana, Florida. Experience the Boynton Beach Inlet marine life, fish schooling, and ocean conditions live.'
      },
      watch: {
        title: 'Watch Live Underwater Feed | SaltWaterCam',
        desc: 'Tune into our live 24/7 underwater camera feed at Lantana dock. See Snook, Tarpon, and Green Sea Turtles in high definition day and night.'
      },
      'kids-club': {
        title: 'Kids Ocean Adventure & Missions | SaltWaterCam',
        desc: 'Fun educational ocean games, interactive quizzes, and marine conservation missions for kids. Earn shell rewards and learn about Florida wildlife.'
      },
      'marine-guide': {
        title: 'Florida Marine Life Guide & Directory | SaltWaterCam',
        desc: 'Identify local Florida fish and marine species including Snook, Tarpon, Goliath Grouper, and Green Sea Turtles. Learn fun facts and conservation status.'
      },
      community: {
        title: 'Community Sightings Board | SaltWaterCam',
        desc: 'Share your live camera fish sightings and connect with other ocean lovers. View daily sightings reports from the Boynton Beach Inlet area.'
      },
      'ai-features': {
        title: 'AI Computer Vision & LLM Telemetry | SaltWaterCam',
        desc: 'Explore live metrics from our edge YOLOv8 computer vision model and read natural language ecological summaries generated by our AI Biologist.'
      },
      rewards: {
        title: 'Ocean Rewards Catalog | SaltWaterCam',
        desc: 'Redeem your earned ocean shells for wallpapers, digital badges, and discounts at local Boynton Beach surf and gear shops.'
      },
      about: {
        title: 'About SaltWaterCam | Our Mission',
        desc: 'Learn about the history of the Lantana dock underwater camera, our green attraction light, and our partnerships in marine science education.'
      },
      contact: {
        title: 'Contact SaltWaterCam | Support',
        desc: 'Get in touch with the SaltWaterCam team for partnerships, feedback, or general questions about our live Boynton Beach camera feed.'
      }
    };

    const currentSeo = seoData[page] || seoData.home;
    document.title = currentSeo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentSeo.desc);
    }
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
      />
    </div>
  );
}

