import { useState, useEffect, useRef } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

const keyframes = {
  f1: [ // Bannerfish (swims left to right)
    { t: 0, x: 15, y: 35, visible: true },
    { t: 4, x: 45, y: 48, visible: true },
    { t: 8, x: 75, y: 38, visible: true },
    { t: 11, x: 92, y: 25, visible: true },
    { t: 13, x: 95, y: 20, visible: false }
  ],
  f2: [ // Yellow Tang (swims right to left)
    { t: 0, x: 90, y: 70, visible: false },
    { t: 2, x: 85, y: 65, visible: true },
    { t: 6, x: 50, y: 55, visible: true },
    { t: 10, x: 20, y: 45, visible: true },
    { t: 13, x: 5, y: 40, visible: false }
  ]
};

const getInterpolatedPosition = (targetId, time) => {
  const frames = keyframes[targetId];
  if (!frames) return { x: 0, y: 0, visible: false };

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].t < time) {
    i++;
  }

  const f0 = frames[i];
  const f1 = frames[i + 1] || f0;

  if (f0.t === f1.t) return { x: f0.x, y: f0.y, visible: f0.visible };

  const ratio = (time - f0.t) / (f1.t - f0.t);
  const x = f0.x + (f1.x - f0.x) * ratio;
  const y = f0.y + (f1.y - f0.y) * ratio;
  const visible = ratio < 0.5 ? f0.visible : f1.visible;

  return { x, y, visible };
};

export default function LiveStream({ addShells, shells, currentUser }) {
  const [feedType, setFeedType] = useState('youtube'); // 'youtube' or 'recorded'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [fishCounter, setFishCounter] = useState(0);

  // AI Quiz/Overlay states
  const [clickCoords, setClickCoords] = useState(null); // { x, y }
  const [challengeScanning, setChallengeScanning] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null); // { species: Object, options: String[] }
  const [selectedLogSpecies, setSelectedLogSpecies] = useState(null); // Object
  const [showSeawaterAlert, setShowSeawaterAlert] = useState(false);

  // Local species database for quiz challenges
  const speciesList = [
    {
      name: "Common Snook",
      emoji: "🐟",
      shells: 15,
      fact: "Snooks have a distinct black line along their body that helps them sense movements in the water to hunt in the dark!"
    },
    {
      name: "Yellow Tang",
      emoji: "🐠",
      shells: 15,
      fact: "Yellow Tangs graze on algae growing on turtle shells and coral reefs, helping keep the entire habitat clean!"
    },
    {
      name: "Green Sea Turtle",
      emoji: "🐢",
      shells: 15,
      fact: "Green Sea Turtles can hold their breath for up to 5 hours! They graze on seagrasses on the shallow reef floor."
    },
    {
      name: "Goliath Grouper",
      emoji: "🐡",
      shells: 15,
      fact: "Goliath Groupers can grow larger than a refrigerator and weigh up to 800 lbs! They make deep booming sounds to defend their caves."
    },
    {
      name: "Atlantic Tarpon",
      emoji: "🐟",
      shells: 15,
      fact: "Often called the Silver King, Tarpons have large reflective scales and can gulp air at the surface to survive in low-oxygen waters."
    }
  ];

  // Level progression helper and states
  const getLevelInfo = (shellCount) => {
    if (shellCount < 20) return { level: 1, target: 20, prevTarget: 0, title: "Tadpole Scout" };
    if (shellCount < 50) return { level: 2, target: 50, prevTarget: 20, title: "Reef Explorer" };
    if (shellCount < 100) return { level: 3, target: 100, prevTarget: 50, title: "Marine Protector" };
    if (shellCount < 200) return { level: 4, target: 200, prevTarget: 100, title: "Ocean Guardian" };
    return { level: 5, target: null, prevTarget: 200, title: "Grand Master Protector" };
  };

  const [currentLevel, setCurrentLevel] = useState(() => getLevelInfo(shells).level);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(null);

  // Gamification floating items states
  const [floatyTexts, setFloatyTexts] = useState([]);
  const [showMissionAlert, setShowMissionAlert] = useState(false);

  // Monitor level progression
  useEffect(() => {
    const info = getLevelInfo(shells);
    if (info.level > currentLevel) {
      setCurrentLevel(info.level);
      setShowLevelUpAlert(info);
    } else if (info.level < currentLevel) {
      setCurrentLevel(info.level);
    }
  }, [shells, currentLevel]);

  // Sync play/pause and mute states to native video element APIs
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(err => console.log("Autoplay blocked:", err));
    } else {
      video.pause();
    }
  }, [isPlaying, feedType]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted, feedType]);

  // Click on stream (captures coordinates to verify fish sightings using LERP keyframes)
  const handleSeawaterTap = (e) => {
    if (!isPlaying || !containerRef.current || !videoRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    const time = videoRef.current.currentTime;
    
    // Calculate distance to targets
    const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const threshold = 12.0; // Click within 12% is a hit
    
    const posF1 = getInterpolatedPosition('f1', time);
    const posF2 = getInterpolatedPosition('f2', time);
    
    let hitDetected = false;
    let hitTargetName = "";
    let hitX = clickX;
    let hitY = clickY;

    if (posF1.visible && distance(clickX, clickY, posF1.x, posF1.y) <= threshold) {
      hitDetected = true;
      hitTargetName = "Common Snook";
      hitX = posF1.x;
      hitY = posF1.y;
    } else if (posF2.visible && distance(clickX, clickY, posF2.x, posF2.y) <= threshold) {
      hitDetected = true;
      hitTargetName = "Yellow Tang";
      hitX = posF2.x;
      hitY = posF2.y;
    }

    if (hitDetected) {
      if (addShells) {
        addShells(1);
      }
      const nextFishCount = fishCounter + 1;
      setFishCounter(nextFishCount);
      triggerFloaty(hitX, hitY, `${hitTargetName} Spotted! +1 Shell`);

      // Complete Kids Club Scan Sighting Mission: Scan 3 fish
      if (nextFishCount >= 3) {
        const completed = JSON.parse(localStorage.getItem('swc_completed_missions') || '[]');
        if (!completed.includes('cleanup')) {
          completed.push('cleanup');
          localStorage.setItem('swc_completed_missions', JSON.stringify(completed));
          
          let currentXp = parseInt(localStorage.getItem('swc_kids_xp') || '0', 10);
          localStorage.setItem('swc_kids_xp', Math.min(500, currentXp + 100).toString());

          setShowMissionAlert(true);
          setTimeout(() => setShowMissionAlert(false), 5000);
        }
      }
    } else {
      triggerFloaty(clickX, clickY, `Seawater! +0 Shells`);
    }
  };

  // YouTube feed tap handling (AI Sighting Identification Challenge)
  const handleYoutubeFeedTap = (e) => {
    if (!isPlaying || !containerRef.current) return;
    if (challengeScanning || activeChallenge || selectedLogSpecies || showSeawaterAlert) {
      // Clear current overlays if clicked again
      setClickCoords(null);
      setChallengeScanning(false);
      setActiveChallenge(null);
      setSelectedLogSpecies(null);
      setShowSeawaterAlert(false);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickCoords({ x: clickX, y: clickY });
    setChallengeScanning(true);

    // Simulate AI scanning frame buffer (latency)
    setTimeout(() => {
      setChallengeScanning(false);

      // 70% chance of triggering identification challenge, 30% chance of seawater
      if (Math.random() < 0.7) {
        const correctSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
        
        // Pick 2 distractors
        const otherSpecies = speciesList.filter(s => s.name !== correctSpecies.name);
        const wrong1 = otherSpecies[Math.floor(Math.random() * otherSpecies.length)];
        const otherSpecies2 = otherSpecies.filter(s => s.name !== wrong1.name);
        const wrong2 = otherSpecies2[Math.floor(Math.random() * otherSpecies2.length)];

        // Shuffle options
        const options = [correctSpecies.name, wrong1.name, wrong2.name].sort(() => Math.random() - 0.5);

        setActiveChallenge({
          species: correctSpecies,
          options: options
        });
      } else {
        setShowSeawaterAlert(true);
      }
    }, 900);
  };

  const handleTap = (e) => {
    if (feedType === 'youtube') {
      handleYoutubeFeedTap(e);
    } else {
      handleSeawaterTap(e);
    }
  };

  const handleChallengeChoice = (choice) => {
    if (!activeChallenge) return;

    if (choice === activeChallenge.species.name) {
      // Success! Sighting Verified
      const result = activeChallenge.species;
      setActiveChallenge(null);
      setSelectedLogSpecies(result);
      const nextFishCount = fishCounter + 1;
      setFishCounter(nextFishCount);

      if (addShells) {
        addShells(15); // Verified challenge gives +15 shells
      }

      if (clickCoords) {
        triggerFloaty(clickCoords.x, clickCoords.y, `🎯 VERIFIED! +15 🐚`);
      }

      // Complete Kids Club Scan Sighting Mission: Scan 3 fish
      if (nextFishCount >= 3) {
        const completed = JSON.parse(localStorage.getItem('swc_completed_missions') || '[]');
        if (!completed.includes('cleanup')) {
          completed.push('cleanup');
          localStorage.setItem('swc_completed_missions', JSON.stringify(completed));
          
          let currentXp = parseInt(localStorage.getItem('swc_kids_xp') || '0', 10);
          localStorage.setItem('swc_kids_xp', Math.min(500, currentXp + 100).toString());

          setShowMissionAlert(true);
          setTimeout(() => setShowMissionAlert(false), 5000);
        }
      }
    } else {
      // Wrong choice
      setActiveChallenge(null);
      setShowSeawaterAlert(true); // Treat as seawater/no match detected
    }
  };

  // Helper to trigger floating shells text
  const triggerFloaty = (x, y, text) => {
    const newFloaty = {
      id: Math.random().toString(36).substring(2, 9),
      text: text,
      x: x,
      y: y,
      color: "#39ff88"
    };
    setFloatyTexts(prev => [...prev, newFloaty]);
    setTimeout(() => {
      setFloatyTexts(prev => prev.filter(x => x.id !== newFloaty.id));
    }, 1200);
  };

  return (
    <section className="liveStage">
      <div className="liveFrame">
        <div className={`underwaterScene ${isPlaying ? 'playing' : 'paused'}`}>
          {/* HUD Scanning Line */}
          {isPlaying && <div className="scanningLine" />}
          
          {/* HUD Telemetry Indicator */}
          {isPlaying && (
            <div className="hudIndicator">
              <span className="hudSignalDot" />
              <span>Telemetry: 12.4m DEPTH | TEMP: 76.5°F | LIGHT: 82%</span>
            </div>
          )}

          {/* Dynamic Feed Rendering */}
          {feedType === 'youtube' ? (
            <iframe 
              id="yt-live-stream"
              src="https://www.youtube.com/embed/qi0mY6zVQnY?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&loop=1&playlist=qi0mY6zVQnY"
              title="Live Underwater Stream" 
              className="streamBgImage"
              style={{ 
                border: 'none', 
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1
              }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video 
              ref={videoRef}
              src="https://upload.wikimedia.org/wikipedia/commons/2/24/Tropical_Fish_Banner_Fish_on_Coral_Reef.webm"
              className="streamBgImage"
              autoPlay
              loop
              muted
              playsInline
              style={{ 
                border: 'none', 
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1
              }}
            />
          )}

          {/* Glowing Green Beam */}
          <div className="greenBeam" />

          {/* Animated floating bubbles */}
          {isPlaying && (
            <>
              <div className="bubble b1" />
              <div className="bubble b2" />
              <div className="bubble b3" />
              <div className="bubble b4" />
              <div className="bubble b5" />
            </>
          )}

          {/* Transparent click catcher overlay for direct taps */}
          {isPlaying && (
            <div 
              ref={containerRef}
              onClick={handleTap}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 8,
                cursor: 'pointer'
              }}
              title={feedType === 'youtube' ? "Tap on the stream to scan & verify fish sightings!" : "Tap directly on swimming fish to log them!"}
            />
          )}

          {/* Scanning indicator */}
          {challengeScanning && clickCoords && (
            <div style={{
              position: 'absolute',
              left: `${clickCoords.x}%`,
              top: `${clickCoords.y}%`,
              width: '60px',
              height: '60px',
              transform: 'translate(-50%, -50%)',
              border: '3px dashed #39ff88',
              borderRadius: '50%',
              zIndex: 90,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 2s linear infinite'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                background: '#39ff88',
                borderRadius: '50%',
                boxShadow: '0 0 10px #39ff88',
                animation: 'blinkGlow 1.5s infinite alternate'
              }} />
            </div>
          )}

          {/* Sighting Challenge Quiz Overlay */}
          {activeChallenge && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 12, 21, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 95,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.98) 0%, rgba(3, 17, 28, 0.99) 100%)',
                border: '2px solid rgba(34, 211, 238, 0.5)',
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.25)',
                borderRadius: '24px',
                padding: '28px 24px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'slideDownAlert 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    🔍 AI SIGHTING CHALLENGE
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: '800' }}>
                    Verify Your Sighting!
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6' }}>
                    What marine species did you just spot in the live stream?
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  {activeChallenge.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleChallengeChoice(option)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'Outfit, sans-serif',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(34, 211, 238, 0.15)';
                        e.currentTarget.style.borderColor = '#22d3ee';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveChallenge(null);
                    setClickCoords(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '4px',
                    textDecoration: 'underline'
                  }}
                >
                  Cancel Scan
                </button>
              </div>
            </div>
          )}

          {/* Sighting Logged Success Overlay */}
          {selectedLogSpecies && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 12, 21, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 95,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.98) 0%, rgba(3, 17, 28, 0.99) 100%)',
                border: '2px solid #39ff88',
                boxShadow: '0 0 30px rgba(57, 255, 136, 0.25)',
                borderRadius: '24px',
                padding: '28px 24px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                animation: 'slideDownAlert 0.3s ease-out'
              }}>
                <div style={{ fontSize: '3rem', margin: '0' }}>{selectedLogSpecies.emoji}</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#39ff88', fontWeight: '900', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    SIGHTING LOGGED & VERIFIED!
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: '900' }}>
                    {selectedLogSpecies.name}
                  </h4>
                </div>

                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  {selectedLogSpecies.fact}
                </p>

                <div style={{
                  background: 'rgba(57, 255, 136, 0.1)',
                  border: '1.5px solid rgba(57, 255, 136, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#39ff88'
                }}>
                  🐚 +15 Shells Wallet
                </div>

                <button
                  onClick={() => {
                    setSelectedLogSpecies(null);
                    setClickCoords(null);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '8px',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  Awesome! Keep Spotting 🔍
                </button>
              </div>
            </div>
          )}

          {/* Seawater Only Alert */}
          {showSeawaterAlert && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 12, 21, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 95,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.95) 0%, rgba(3, 17, 28, 0.98) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '24px 28px',
                maxWidth: '380px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideDownAlert 0.3s ease-out'
              }}>
                <div style={{ fontSize: '3rem', margin: '0' }}>💧</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#b7cad6', fontWeight: '900', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AI Scan Result
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: '800' }}>
                    Seawater / No Match
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  No fish identified or verification failed. Keep watching the live stream and click when a fish swims by!
                </p>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', color: '#b7cad6' }}>
                  🐚 +0 Shells
                </div>
                <button
                  onClick={() => {
                    setShowSeawaterAlert(false);
                    setClickCoords(null);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '4px',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  Scan Again 🔍
                </button>
              </div>
            </div>
          )}

          {/* Floaty Click Indicator Text popups */}
          {isPlaying && (
            <div className="floatyLayer" style={{
              position: 'absolute',
              inset: 0,
              zIndex: 90,
              pointerEvents: 'none'
            }}>
              {floatyTexts.map(f => (
                <div
                  key={f.id}
                  style={{
                    position: 'absolute',
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    transform: 'translate(-50%, -50%)',
                    color: f.color,
                    fontSize: '1rem',
                    fontWeight: '900',
                    fontFamily: 'Outfit, sans-serif',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 8px currentColor',
                    pointerEvents: 'none',
                    animation: 'floatUpFade 1s forwards cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                  }}
                >
                  {f.text}
                </div>
              ))}
            </div>
          )}

          {/* Kids Mission Completed Alert Notification overlay */}
          {showMissionAlert && (
            <div style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.9) 0%, rgba(3, 17, 28, 0.95) 100%)',
              border: '2px solid #39ff88',
              boxShadow: '0 0 25px rgba(57, 255, 136, 0.35)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#fff',
              zIndex: 99,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideDownAlert 0.4s ease-out',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', color: '#39ff88', fontSize: '0.88rem' }}>MISSION COMPLETED!</strong>
                <span style={{ fontSize: '0.78rem', color: '#b7cad6' }}>Identify Marine Species (+100 XP awarded)</span>
              </div>
            </div>
          )}

          {/* Top Info Overlay */}
          <div className="streamTopOverlay">
            <div className="streamInfoLeft">
              <div className="liveFeedTitle">
                <span className="liveFeedDot" style={{ backgroundColor: feedType === 'youtube' ? '#39ff88' : '#22d3ee', boxShadow: feedType === 'youtube' ? '0 0 10px #39ff88' : '0 0 10px #22d3ee' }} />
                <span>{feedType === 'youtube' ? 'LIVE FEED (YOUTUBE)' : 'AI EXPLORER LOOP'}</span>
              </div>
              <div className="streamCamName">
                {feedType === 'youtube' ? 'Cam 1 - Lantana Dock Live Stream' : 'Reef Simulation - AI Spotting Active'}
              </div>
            </div>
            
            {/* Interactive sighting notification banner */}
            <div className="gameHeaderBadge" style={{
              background: 'rgba(34, 211, 238, 0.12)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: '800',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.12)',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#39ff88', animation: 'blinkGlow 1.5s infinite' }} />
              <span>Fish Tapped: <strong style={{ color: '#39ff88', fontSize: '0.95rem' }}>{fishCounter}</strong></span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
              <span>{feedType === 'youtube' ? 'Watch live feed: Click anywhere to scan & verify fish sightings!' : 'Explorer Loop: Tap directly on real swimming fish to earn shells!'}</span>
            </div>

            {/* Top Right Buttons: Share, Camera/Photo, Fullscreen */}
            <div className="streamControlButtonsRight">
              <button className="iconCircleBtn" onClick={() => alert('Link copied!')} aria-label="Share">
                <Share2 size={16} />
              </button>
              <button className="iconCircleBtn" onClick={() => alert('Snapshot saved to downloads!')} aria-label="Take Snapshot">
                <Camera size={16} />
              </button>
              <button className="iconCircleBtn" onClick={() => alert('Fullscreen activated!')} aria-label="Fullscreen">
                <Maximize size={16} />
              </button>
            </div>
          </div>

          {/* Play Overlay if paused */}
          {!isPlaying && (
            <div className="pausedOverlay">
              <button className="playOverlayBtn" onClick={() => setIsPlaying(true)} aria-label="Play stream">
                <Play size={32} fill="currentColor" />
              </button>
              <p>Stream Paused</p>
            </div>
          )}

          {/* Level Up Celebration Card */}
          {showLevelUpAlert && (
            <div 
              onClick={() => setShowLevelUpAlert(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(2, 12, 21, 0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.98) 0%, rgba(3, 17, 28, 0.99) 100%)',
                border: '3px solid #39ff88',
                borderRadius: '24px',
                padding: '36px 32px',
                maxWidth: '420px',
                width: '95%',
                textAlign: 'center',
                boxShadow: '0 0 50px rgba(57, 255, 136, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                animation: 'slideDownAlert 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <div style={{ fontSize: '4.5rem', margin: '0', animation: 'bounceUp 1s infinite alternate' }}>🏆</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#39ff88', fontWeight: '900', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Congratulations!
                  </span>
                  <h3 style={{ margin: 0, fontSize: '2.1rem', color: '#fff', fontWeight: '900', lineHeight: '1.2' }}>
                    LEVEL UP!
                  </h3>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  You reached <strong style={{ color: '#39ff88' }}>Level {showLevelUpAlert.level}</strong>!
                </p>
                <div style={{
                  background: 'rgba(57, 255, 136, 0.1)',
                  border: '1.5px solid rgba(57, 255, 136, 0.3)',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  color: '#39ff88',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  ⭐ Rank: {showLevelUpAlert.title}
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                  Tap anywhere to continue playing
                </p>
              </div>
            </div>
          )}

          {/* Level Progress HUD Bar */}
          {isPlaying && (
            <div style={{
              position: 'absolute',
              top: '75px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(3, 27, 46, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(34, 211, 238, 0.35)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#fff',
              zIndex: 90,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontFamily: 'Outfit, sans-serif',
              pointerEvents: 'none',
              minWidth: '290px',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Level {getLevelInfo(shells).level}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>
                  ({getLevelInfo(shells).title})
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', marginLeft: '12px' }}>
                <div style={{
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  flex: '1',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: getLevelInfo(shells).target 
                      ? `${((shells - getLevelInfo(shells).prevTarget) / (getLevelInfo(shells).target - getLevelInfo(shells).prevTarget)) * 100}%` 
                      : '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #064c72, #22d3ee)',
                    borderRadius: '3px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#39ff88', whiteSpace: 'nowrap' }}>
                  {getLevelInfo(shells).target ? `${shells}/${getLevelInfo(shells).target} 🐚` : `${shells} 🐚`}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Player Control Bar */}
          <div className="streamBottomControlBar">
            {/* Left Controls */}
            <button 
              className="playerBarBtn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <button 
              className="playerBarBtn"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className="playerBarLiveStatus">
              <span className="liveStatusDot" style={{ backgroundColor: feedType === 'youtube' ? '#39ff88' : '#22d3ee', boxShadow: feedType === 'youtube' ? '0 0 8px #39ff88' : '0 0 8px #22d3ee' }} />
              <span>LIVE</span>
            </div>

            {/* Center Seek/Progress Line */}
            <div className="playerProgressBarContainer">
              <div className="playerProgressBarFill" />
            </div>

            {/* Right Controls */}
            <span className="greenHdBadge">HD</span>
            
            {/* Feed Selector Button */}
            <div style={{ marginRight: '8px' }}>
              <select
                value={feedType}
                onChange={(e) => {
                  setFeedType(e.target.value);
                  // Clear overlays
                  setClickCoords(null);
                  setChallengeScanning(false);
                  setActiveChallenge(null);
                  setSelectedLogSpecies(null);
                  setShowSeawaterAlert(false);
                }}
                style={{
                  background: 'rgba(6, 32, 49, 0.85)',
                  border: '1.5px solid rgba(34, 211, 238, 0.45)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  outline: 'none',
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)'
                }}
              >
                <option value="youtube">📺 Live (YouTube)</option>
                <option value="recorded">🌊 Game Loop (AI Active)</option>
              </select>
            </div>

            <button className="autoDropdownBtn">
              Auto <span className="dropdownArrow">▼</span>
            </button>

            <button className="playerBarBtn" onClick={() => alert('Picture in Picture activated!')} aria-label="Picture in Picture">
              <Tv size={18} />
            </button>

            <div className="settingsDropdownContainer">
              <button 
                className="playerBarBtn" 
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
              {showSettings && (
                <div className="playerSettingsMenu">
                  <p>Quality Select</p>
                  <button className="active" onClick={() => setShowSettings(false)}>Auto (Recommended)</button>
                  <button onClick={() => setShowSettings(false)}>1080p HD</button>
                  <button onClick={() => setShowSettings(false)}>720p</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes swimOscillate {
          from { transform: translateY(-3px) rotate(1deg); }
          to { transform: translateY(3px) rotate(-1deg); }
        }
        @keyframes floatUpFade {
          0% { transform: translate(-50%, -50%) translateY(0); opacity: 1; scale: 1; }
          100% { transform: translate(-50%, -50%) translateY(-60px); opacity: 0; scale: 0.85; }
        }
        @keyframes blinkGlow {
          0% { opacity: 0.4; box-shadow: 0 0 2px #39ff88; }
          50% { opacity: 1; box-shadow: 0 0 8px #39ff88; }
          100% { opacity: 0.4; box-shadow: 0 0 2px #39ff88; }
        }
        @keyframes slideDownAlert {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes bounceUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
