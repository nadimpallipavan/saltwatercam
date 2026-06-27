import { useState, useEffect, useRef } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy, Compass, Star, Printer, X, Play, Video, Gift } from 'lucide-react';
import RewardsPage from './RewardsPage.jsx';

export default function KidsClubPage({
  shells = 120,
  setShells,
  onDonate,
  communityDonations = { Kingston: 3420, Saltwater: 5840 },
  userDonations = { Kingston: 0, Saltwater: 0 },
  currentUser,
  onOpenAuth,
  addShells,
  setActiveTab // Tab switcher passed from App.jsx to change to watch live page
}) {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('swc_kids_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem('swc_completed_missions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard' or 'rewards'
  const [spottedSpecies, setSpottedSpecies] = useState([]);
  
  // Game Modals
  const [activeModal, setActiveModal] = useState(null); // 'bubble', 'friend', 'quiz', 'color'

  // Sync spotted species
  useEffect(() => {
    const loadSpotted = () => {
      const saved = JSON.parse(localStorage.getItem('swc_spotted_species') || '[]');
      setSpottedSpecies(saved);
    };
    loadSpotted();
    window.addEventListener('focus', loadSpotted);
    return () => window.removeEventListener('focus', loadSpotted);
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    localStorage.setItem('swc_kids_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('swc_completed_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Complete a mission
  const completeMission = (missionId, xpAward) => {
    if (completedMissions.includes(missionId)) return;
    setCompletedMissions(prev => [...prev, missionId]);
    setXp(prev => Math.min(500, prev + xpAward));
  };

  // 1. Bubble Pop Game States
  const [bubbles, setBubbles] = useState([]);
  const [popCount, setPopCount] = useState(0);
  const bubbleContainerRef = useRef(null);

  useEffect(() => {
    if (activeModal !== 'bubble') {
      setBubbles([]);
      return;
    }
    // Spawn bubbles periodically
    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= 15) return prev;
        const newBubble = {
          id: Math.random().toString(36).substring(2, 9),
          x: Math.random() * 85 + 5, // percentage offset
          size: Math.random() * 40 + 40, // width in pixels
          speed: Math.random() * 4 + 3, // animation duration
          creature: ['🐠', '🐡', '🐟', '🐙', '🦀', '🦈', '🦐'][Math.floor(Math.random() * 7)]
        };
        return [...prev, newBubble];
      });
    }, 800);

    return () => clearInterval(interval);
  }, [activeModal]);

  const handleBubblePop = (id, creature) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setPopCount(prev => prev + 1);
    if (addShells) addShells(1);
    
    // Trigger floaty text inside modal
    completeMission('cleanup', 10); // partial progress XP
  };

  // 2. Today's Friend States
  const [friendIdx, setFriendIdx] = useState(0);
  const friendsList = [
    { name: 'Green Sea Turtle', emoji: '🐢', image: '/today_friend.png', desc: 'Green Sea Turtles are ancient explorers of the ocean! They have survived for over 100 million years. They can hold their breath underwater for up to 5 hours!', fun: 'Unlike land turtles, green sea turtles cannot retract their flippers and head into their shell!' },
    { name: 'Common Snook', emoji: '🐟', image: '/watch_live_bg_clean.png', desc: 'Common Snook love structure! You can find them hanging out in the shadows of dock pilings near Boynton Inlet waiting for food.', fun: 'They start life as males and transition to females as they grow larger!' },
    { name: 'Goliath Grouper', emoji: '🐡', image: '/logo-circle.png', desc: 'The Goliath Grouper is a gentle giant. They grow up to 8 feet long and can weigh up to 800 pounds!', fun: 'They make booming underwater sounds using their swim bladders to communicate!' }
  ];

  // 3. Mini Quiz States
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizOption = (idx) => {
    if (quizAnswered) return;
    setSelectedQuizOption(idx);
    setQuizAnswered(true);
    if (idx === siteContent.quiz[quizIdx].answer - 1) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    if (quizIdx + 1 < siteContent.quiz.length) {
      setQuizIdx(quizIdx + 1);
    } else {
      setQuizFinished(true);
      completeMission('trivia', 150);
    }
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // 4. Color a Fish Canvas State
  const [activeColor, setActiveColor] = useState('#e65c00'); // default orange
  const paletteColors = ['#e65c00', '#ffffff', '#000000', '#38bdf8', '#a855f7', '#fb7185', '#eab308', '#22c55e'];
  const [fishColors, setFishColors] = useState({
    body1: '#d1d5db',
    body2: '#d1d5db',
    body3: '#d1d5db',
    finTop: '#d1d5db',
    finBottom: '#d1d5db',
    finTail: '#d1d5db',
    face: '#9ca3af'
  });

  const colorPart = (part) => {
    setFishColors(prev => ({ ...prev, [part]: activeColor }));
    completeMission('physics', 10); // unlock small coloring quest reward
  };

  // Level thresholds (mockup: Junior Explorer / rank / progress bar)
  const getLevelInfo = () => {
    if (xp >= 500) return { name: 'Master Reef Protector', nextXP: 500, label: '500 / 500 XP' };
    if (xp >= 300) return { name: 'Junior Explorer', nextXP: 500, label: `${xp} / 500 XP` };
    return { name: 'Salty Cadet', nextXP: 300, label: `${xp} / 300 XP` };
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="pageContainer kidsPage" style={{ 
      maxWidth: '1220px', 
      margin: '0 auto', 
      padding: '24px 20px 40px 20px', 
      color: '#fff', 
      fontFamily: 'Outfit, sans-serif',
      backgroundImage: 'radial-gradient(circle at top, rgba(6, 48, 73, 0.45) 0%, rgba(3, 17, 30, 0.9) 100%)'
    }}>
      {activeSubTab === 'dashboard' ? (
        <>
          {/* Main Dashboard Hero Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            textAlign: 'left'
          }}>
            {/* Left Hero Texts */}
            <div style={{ flex: '1 1 450px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34, 211, 238, 0.12)',
                border: '1.5px solid rgba(34, 211, 238, 0.3)',
                padding: '5px 14px',
                borderRadius: '30px',
                fontSize: '0.78rem',
                fontWeight: '900',
                color: '#22d3ee',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#eab308' }}>★</span> Kids Club
              </div>

              <h1 style={{
                fontSize: '3.6rem',
                fontWeight: '900',
                lineHeight: '1.1',
                margin: '0 0 10px 0',
                background: 'linear-gradient(135deg, #fff 60%, #39ff88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                Hi Explorer!
              </h1>
              
              <p style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#b7cad6',
                margin: '0 0 24px 0',
                lineHeight: '1.4'
              }}>
                Dive in and discover amazing ocean friends today!
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const el = document.getElementById('explore-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '30px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  <Play size={16} fill="#fff" /> Start Exploring
                </button>
                <button 
                  onClick={() => {
                    if (setActiveTab) setActiveTab('watch');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '30px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Video size={16} /> Watch Live
                </button>
              </div>
            </div>

            {/* Mascot Side: Turtle swimming */}
            <div style={{ 
              flex: '1 1 350px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Swimming Mascot Image */}
              <img 
                src="/today_friend.png" 
                alt="Shelly the Turtle Guide" 
                style={{
                  width: '280px',
                  height: '280px',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  animation: 'floatTurtle 4s infinite ease-in-out',
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5)) border: 3px solid rgba(34,211,238,0.2)'
                }}
              />

              {/* Guide speech bubble */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '10px',
                background: 'rgba(6, 32, 49, 0.85)',
                border: '1.5px solid rgba(34, 211, 238, 0.4)',
                padding: '14px 20px',
                borderRadius: '20px',
                maxWidth: '220px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                animation: 'scaleIn 0.3s ease'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: '900', display: 'block', marginBottom: '2px' }}>
                  I'm Shelly! 🐢
                </span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff', lineHeight: '1.35' }}>
                  I'll be your guide. Let's have fun exploring the reef!
                </p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div 
            id="explore-grid" 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '20px',
              marginBottom: '50px'
            }}
          >
            {/* Card 1: Bubble Pop */}
            <div 
              onClick={() => setActiveModal('bubble')}
              className="dashboardCard"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.8) 0%, rgba(6, 48, 73, 0.6) 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                <img src="/bubble_pop.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bubble Pop" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '900', fontFamily: 'Outfit' }}>Bubble Pop</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                Pop bubbles and meet new ocean friends!
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>→</div>
              </div>
            </div>

            {/* Card 2: Today's Friend */}
            <div 
              onClick={() => setActiveModal('friend')}
              className="dashboardCard"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.8) 0%, rgba(6, 48, 73, 0.6) 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', color: '#fff', fontSize: '0.62rem', fontWeight: '900', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: '2' }}>
                NEW
              </div>
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                <img src="/today_friend.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Today's Friend" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '900', fontFamily: 'Outfit' }}>Today's Friend</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                Learn cool facts about today's featured friend.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>→</div>
              </div>
            </div>

            {/* Card 3: Mini Quiz */}
            <div 
              onClick={() => setActiveModal('quiz')}
              className="dashboardCard"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.8) 0%, rgba(6, 48, 73, 0.6) 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                <img src="/mini_quiz.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Mini Quiz" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '900', fontFamily: 'Outfit' }}>Mini Quiz</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                Answer a quick question and earn shells!
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>→</div>
              </div>
            </div>

            {/* Card 4: Color a Fish */}
            <div 
              onClick={() => setActiveModal('color')}
              className="dashboardCard"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.8) 0%, rgba(6, 48, 73, 0.6) 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                <img src="/color_fish.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Color a Fish" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '900', fontFamily: 'Outfit' }}>Color a Fish</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                Choose your colors and bring the fish to life!
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>→</div>
              </div>
            </div>

            {/* Card 5: Watch Live */}
            <div 
              onClick={() => {
                if (setActiveTab) setActiveTab('watch');
              }}
              className="dashboardCard"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.8) 0%, rgba(6, 48, 73, 0.6) 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                <img src="/watch_live_card.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Watch Live" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: '900', fontFamily: 'Outfit' }}>Watch Live</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                Go to the Live Dock Cam and see what's happening!
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>→</div>
              </div>
            </div>
          </div>

          {/* Bottom Explorer HUD status bar */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(6, 32, 49, 0.85) 0%, rgba(3, 17, 30, 0.95) 100%)',
            border: '2px solid rgba(34, 211, 238, 0.35)',
            borderRadius: '24px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px',
            flexWrap: 'wrap',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            textAlign: 'left'
          }}>
            {/* Shells Collected */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#15803d',
                border: '1.5px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                🐚
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', display: 'block', lineHeight: '1.1' }}>
                  {shells}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Shells Collected
                </span>
              </div>
            </div>

            {/* Stickers Unlocked */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#a16207',
                border: '1.5px solid #eab308',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                ⭐
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', display: 'block', lineHeight: '1.1' }}>
                  {spottedSpecies.length}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Stickers Unlocked
                </span>
              </div>
            </div>

            {/* Level and XP progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 250px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#6b21a8',
                border: '1.5px solid #a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                🏅
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>
                    {levelInfo.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: '800' }}>
                    {levelInfo.label}
                  </span>
                </div>
                {/* Progress bar line */}
                <div style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(xp / levelInfo.nextXP) * 100}%`,
                    background: 'linear-gradient(90deg, #22d3ee 0%, #39ff88 100%)',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* My Rewards button */}
            <button 
              onClick={() => setActiveSubTab('rewards')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '30px',
                fontSize: '0.82rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Gift size={15} /> My Rewards
            </button>
          </div>
        </>
      ) : (
        <RewardsPage
          isNested={true}
          shells={shells}
          setShells={setShells}
          onDonate={onDonate}
          communityDonations={communityDonations}
          userDonations={userDonations}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onBack={() => setActiveSubTab('dashboard')} // Go back callback
        />
      )}

      {/* ----------------- GAME MODALS / OVERLAYS ----------------- */}

      {/* Modal 1: Bubble Pop Game */}
      {activeModal === 'bubble' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 16, 26, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #063249 0%, #031b2e 100%)',
            border: '2.5px solid #22d3ee',
            borderRadius: '28px',
            width: '90%',
            maxWidth: '650px',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                width: '36px', height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🫧</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 6px 0', fontFamily: 'Outfit' }}>Bubble Pop Game</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#b7cad6' }}>
              Pop the floating bubbles to release the ocean friends and earn real shells!
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.08)',
              padding: '6px 16px',
              borderRadius: '20px',
              display: 'inline-flex',
              gap: '12px',
              fontSize: '0.85rem',
              fontWeight: '800',
              marginBottom: '20px'
            }}>
              <span style={{ color: '#22d3ee' }}>🐚 Shells: {shells}</span>
              <span style={{ color: '#39ff88' }}>🫧 Popped: {popCount}</span>
            </div>

            {/* Bubble Play Field */}
            <div 
              ref={bubbleContainerRef}
              style={{
                height: '300px',
                background: 'linear-gradient(180deg, rgba(6, 76, 114, 0.4) 0%, rgba(3, 27, 46, 0.7) 100%)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {bubbles.length === 0 && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.5, fontSize: '0.85rem' }}>
                  Waiting for bubbles to float up...
                </div>
              )}
              {bubbles.map(bubble => (
                <button
                  key={bubble.id}
                  onClick={() => handleBubblePop(bubble.id, bubble.creature)}
                  style={{
                    position: 'absolute',
                    left: `${bubble.x}%`,
                    bottom: '-60px',
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(34,211,238,0.2) 60%, rgba(34,211,238,0.5) 100%)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    animation: `floatUp ${bubble.speed}s linear forwards`,
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5)'
                  }}
                >
                  {bubble.creature}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Today's Friend Viewer */}
      {activeModal === 'friend' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 16, 26, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #063249 0%, #031b2e 100%)',
            border: '2.5px solid #22d3ee',
            borderRadius: '28px',
            width: '90%',
            maxWidth: '550px',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                width: '36px', height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>
              {friendsList[friendIdx].emoji}
            </span>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0 0 16px 0', fontFamily: 'Outfit' }}>
              {friendsList[friendIdx].name}
            </h2>

            <div style={{ height: '200px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.25)', marginBottom: '20px' }}>
              <img 
                src={friendsList[friendIdx].image} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} 
                alt="Friend Spotlight" 
              />
            </div>

            <p style={{ fontSize: '0.88rem', color: '#fff', lineHeight: '1.5', margin: '0 0 16px 0', textAlign: 'left' }}>
              {friendsList[friendIdx].desc}
            </p>

            <div style={{
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1.2px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '16px',
              padding: '12px 16px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <strong style={{ color: '#22d3ee', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                🌟 Did You Know?
              </strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.4' }}>
                {friendsList[friendIdx].fun}
              </p>
            </div>

            {/* Nav Arrows */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <button 
                onClick={() => setFriendIdx(prev => (prev === 0 ? friendsList.length - 1 : prev - 1))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '800'
                }}
              >
                ◀ Previous Friend
              </button>
              <button 
                onClick={() => setFriendIdx(prev => (prev === friendsList.length - 1 ? 0 : prev + 1))}
                style={{
                  background: '#064c72',
                  border: '1px solid #22d3ee',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '800'
                }}
              >
                Next Friend ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Reef Quiz Overlay */}
      {activeModal === 'quiz' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 16, 26, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #063249 0%, #031b2e 100%)',
            border: '2.5px solid #22d3ee',
            borderRadius: '28px',
            width: '90%',
            maxWidth: '550px',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                width: '36px', height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            {!quizFinished ? (
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Question {quizIdx + 1} of {siteContent.quiz.length}
                </span>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 0 20px 0', color: '#fff', display: 'flex', gap: '8px' }}>
                  <HelpCircle size={20} color="#22d3ee" style={{ flexShrink: 0 }} />
                  {siteContent.quiz[quizIdx].question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {siteContent.quiz[quizIdx].options.map((option, idx) => {
                    let btnStyle = {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff'
                    };

                    if (quizAnswered) {
                      if (idx === siteContent.quiz[quizIdx].answer - 1) {
                        btnStyle = {
                          background: 'rgba(34, 197, 94, 0.12)',
                          border: '2px solid #22c55e',
                          color: '#22c55e'
                        };
                      } else if (selectedQuizOption === idx) {
                        btnStyle = {
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '2px solid #ef4444',
                          color: '#ef4444'
                        };
                      } else {
                        btnStyle = {
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          color: '#64748b',
                          opacity: 0.5
                        };
                      }
                    } else if (selectedQuizOption === idx) {
                      btnStyle = {
                        background: 'rgba(34, 211, 238, 0.1)',
                        border: '2px solid #22d3ee',
                        color: '#22d3ee'
                      };
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizOption(idx)}
                        disabled={quizAnswered}
                        style={{
                          padding: '14px 18px',
                          borderRadius: '16px',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          cursor: quizAnswered ? 'default' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontFamily: 'Outfit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          ...btnStyle
                        }}
                      >
                        <span>{option}</span>
                        {quizAnswered && idx === siteContent.quiz[quizIdx].answer - 1 && <span>✓</span>}
                        {quizAnswered && selectedQuizOption === idx && idx !== siteContent.quiz[quizIdx].answer - 1 && <span>✗</span>}
                      </button>
                    );
                  })}
                </div>

                {quizAnswered && (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: '3px solid #22d3ee',
                    padding: '14px',
                    borderRadius: '0 12px 12px 0',
                    marginBottom: '20px'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.45' }}>
                      {siteContent.quiz[quizIdx].explanation}
                    </p>
                  </div>
                )}

                {quizAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={handleNextQuiz}
                      style={{
                        background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: '20px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {quizIdx + 1 === siteContent.quiz.length ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Trophy size={48} color="#eab308" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 6px 0' }}>Quiz Completed!</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#b7cad6' }}>
                  You scored <strong style={{ color: '#fff' }}>{quizScore} / {siteContent.quiz.length}</strong> and earned +150 XP!
                </p>
                <button 
                  onClick={resetQuiz}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 4: Color a Fish Game */}
      {activeModal === 'color' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 16, 26, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #063249 0%, #031b2e 100%)',
            border: '2.5px solid #22d3ee',
            borderRadius: '28px',
            width: '90%',
            maxWidth: '600px',
            padding: '24px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                width: '36px', height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 6px 0', fontFamily: 'Outfit' }}>Color a Fish</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#b7cad6' }}>
              Select a color below, then click on parts of the fish outline to color it in!
            </p>

            {/* Paint Palette */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {paletteColors.map(color => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: color,
                    border: activeColor === color ? '3px solid #22d3ee' : '1.5px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transform: activeColor === color ? 'scale(1.15)' : 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: activeColor === color ? '0 0 10px #22d3ee' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Stylized SVG Fish Illustration */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '20px'
            }}>
              <svg width="280" height="200" viewBox="0 0 280 200" style={{ cursor: 'pointer' }}>
                {/* Back Tail Fin */}
                <path 
                  d="M 200 100 L 250 50 L 240 100 L 250 150 Z" 
                  fill={fishColors.finTail} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('finTail')} 
                />
                
                {/* Top Fin */}
                <path 
                  d="M 80 54 C 110 20, 160 20, 170 65 L 140 70 Z" 
                  fill={fishColors.finTop} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('finTop')} 
                />

                {/* Bottom Fin */}
                <path 
                  d="M 90 144 C 110 178, 150 178, 160 135 L 130 130 Z" 
                  fill={fishColors.finBottom} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('finBottom')} 
                />

                {/* Body Segment 3 */}
                <path 
                  d="M 140 68 C 170 68, 200 80, 200 100 C 200 120, 170 132, 140 132 C 140 132, 160 100, 140 68 Z" 
                  fill={fishColors.body3} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('body3')} 
                />

                {/* Body Segment 2 */}
                <path 
                  d="M 100 60 C 120 60, 140 68, 140 68 C 160 100, 140 132, 140 132 C 140 132, 120 140, 100 140 C 100 140, 120 100, 100 60 Z" 
                  fill={fishColors.body2} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('body2')} 
                />

                {/* Body Segment 1 / Face */}
                <path 
                  d="M 50 100 C 50 70, 100 60, 100 60 C 120 100, 100 140, 100 140 C 100 140, 50 130, 50 100 Z" 
                  fill={fishColors.body1} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('body1')} 
                />

                {/* Face & Lips */}
                <path 
                  d="M 50 100 C 35 90, 35 110, 50 100 Z" 
                  fill={fishColors.face} 
                  stroke="#333" 
                  strokeWidth="3" 
                  onClick={() => colorPart('face')} 
                />

                {/* Eye */}
                <circle cx="75" cy="88" r="8" fill="#fff" stroke="#333" strokeWidth="2" />
                <circle cx="77" cy="86" r="4" fill="#000" />
              </svg>
            </div>

            <button
              onClick={() => setFishColors({
                body1: '#d1d5db',
                body2: '#d1d5db',
                body3: '#d1d5db',
                finTop: '#d1d5db',
                finBottom: '#d1d5db',
                finTail: '#d1d5db',
                face: '#9ca3af'
              })}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '800'
              }}
            >
              Reset Colors
            </button>
          </div>
        </div>
      )}

      {/* Animation tags */}
      <style>{`
        @keyframes floatTurtle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-380px); opacity: 0; }
        }
        .dashboardCard:hover {
          transform: translateY(-6px);
          border-color: rgba(34, 211, 238, 0.5) !important;
          box-shadow: 0 10px 25px rgba(34, 211, 238, 0.15);
        }
      `}</style>
    </div>
  );
}
