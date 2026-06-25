import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

const questTargets = [
  { type: 'turtle', emoji: '🐢', name: 'Green Sea Turtle', clue: 'Find the slow-swimming animal with a shell!', fact: 'Sea turtles have lived in our oceans for over 110 million years, since the time of the dinosaurs!' },
  { type: 'shark', emoji: '🦈', name: 'Reef Shark', clue: 'Find the grey explorer fish with a fin!', fact: 'Reef sharks sleep by lying still on the sandy reef bottom while water flows over their gills!' },
  { type: 'yellow_tang', emoji: '🐠', name: 'Yellow Tang', clue: 'Find the bright yellow fish!', fact: 'Yellow Tangs are super helpful reef cleaners that eat algae to keep the coral healthy!' },
  { type: 'clown_fish', emoji: '🐠', name: 'Clown Fish', clue: 'Find the orange and white striped fish!', fact: 'Clown Fish live inside sea anemones which protect them from larger predator fish!' },
  { type: 'blue_tang', emoji: '🐟', name: 'Blue Tang', clue: 'Find the neon blue fish!', fact: 'Blue Tangs can change their color from bright blue to dark purple to hide at night!' },
  { type: 'octopus', emoji: '🐙', name: 'Octopus', clue: 'Find the eight-legged purple creature!', fact: 'Octopuses have three hearts and blue blood, and can squeeze through tiny cracks!' }
];

export default function LiveStream({ aiEnabled = false, addShells, shells, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeQuest, setActiveQuest] = useState(null);
  const [successQuest, setSuccessQuest] = useState(null);

  // Simulated AI targets tracking
  const [detections, setDetections] = useState([
    { id: 1, label: 'COMMON SNOOK', confidence: 98, x: '35%', y: '40%', w: 130, h: 65, visible: true },
    { id: 2, label: 'ATLANTIC TARPON', confidence: 97, x: '65%', y: '30%', w: 180, h: 75, visible: false },
    { id: 3, label: 'GOLIATH GROUPER', confidence: 96, x: '45%', y: '60%', w: 150, h: 90, visible: true },
    { id: 4, label: 'GREEN SEA TURTLE', confidence: 99, x: '72%', y: '50%', w: 110, h: 70, visible: false },
  ]);

  // Gamification floating items states
  const [gameItems, setGameItems] = useState([]);
  const [floatyTexts, setFloatyTexts] = useState([]);
  const [showMissionAlert, setShowMissionAlert] = useState(false);

  // Initialize first active quest
  useEffect(() => {
    if (!activeQuest && !successQuest) {
      const randomQuest = questTargets[Math.floor(Math.random() * questTargets.length)];
      setActiveQuest(randomQuest);
    }
  }, [activeQuest, successQuest]);

  useEffect(() => {
    if (!isPlaying || !aiEnabled) return;

    const interval = setInterval(() => {
      setDetections(prev => prev.map(d => {
        const randomAction = Math.random();
        let nextVisible = d.visible;
        let nextX = d.x;
        let nextY = d.y;
        let nextConf = d.confidence;

        // Randomly hide/show target
        if (randomAction > 0.65) {
          nextVisible = !d.visible;
        }

        if (nextVisible) {
          // Slide position slightly
          const xVal = parseInt(d.x) + (Math.random() > 0.5 ? 4 : -4);
          const yVal = parseInt(d.y) + (Math.random() > 0.5 ? 2 : -2);
          nextX = `${Math.max(15, Math.min(80, xVal))}%`;
          nextY = `${Math.max(20, Math.min(70, yVal))}%`;
          nextConf = Math.min(99, Math.max(94, d.confidence + (Math.random() > 0.5 ? 1 : -1)));
        }

        return { ...d, visible: nextVisible, x: nextX, y: nextY, confidence: nextConf };
      }));
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, aiEnabled]);

  // Handle YouTube iframe play/pause and mute/unmute via postMessage API
  useEffect(() => {
    const iframe = document.getElementById('yt-live-stream');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: isPlaying ? 'playVideo' : 'pauseVideo'
      }), '*');
    }
  }, [isPlaying]);

  useEffect(() => {
    const iframe = document.getElementById('yt-live-stream');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: isMuted ? 'mute' : 'unMute'
      }), '*');
    }
  }, [isMuted]);

  // 1. Game loop: Spawn floating items (fish/trash)
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setGameItems(prev => {
        if (prev.length >= 4) return prev; // cap at 4 items

        const templates = [
          { type: 'turtle', emoji: '🐢', label: 'Green Sea Turtle', points: 50, size: 56 },
          { type: 'shark', emoji: '🦈', label: 'Reef Shark', points: 50, size: 62 },
          { type: 'yellow_tang', emoji: '🐠', label: 'Yellow Tang', points: 50, size: 48 },
          { type: 'clown_fish', emoji: '🐠', label: 'Clown Fish', points: 50, size: 46 },
          { type: 'blue_tang', emoji: '🐟', label: 'Blue Tang', points: 50, size: 48 },
          { type: 'octopus', emoji: '🐙', label: 'Octopus', points: 50, size: 50 },
          { type: 'trash', emoji: '🧴', label: 'Plastic Bottle', points: 25, size: 45 },
          { type: 'trash', emoji: '🥤', label: 'Soda Can', points: 25, size: 42 },
          { type: 'hazard', emoji: '🛢️', label: 'Toxic Barrel', points: 25, size: 52 },
          { type: 'trash', emoji: '🕸️', label: 'Ghost Net', points: 25, size: 48 }
        ];

        // 35% chance to spawn the active quest target, otherwise pick random template
        let selected;
        const roll = Math.random();
        if (roll < 0.35 && activeQuest) {
          selected = templates.find(t => t.label === activeQuest.name);
        }
        
        if (!selected) {
          selected = templates[Math.floor(Math.random() * templates.length)];
        }

        // Avoid duplicate items currently on screen to keep variety
        if (prev.some(item => item.label === selected.label)) {
          return prev;
        }

        const newItem = {
          id: Math.random().toString(36).substring(2, 9),
          ...selected,
          x: 105, // start off-screen to the right
          y: 15 + Math.random() * 60, // random height
          speed: 0.16 + Math.random() * 0.18, // swim speed
          hovered: false,
        };

        return [...prev, newItem];
      });
    }, 3200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, activeQuest]);

  // 2. Game loop: Animate movement
  useEffect(() => {
    if (!isPlaying) return;

    const moveLoop = setInterval(() => {
      setGameItems(prev => 
        prev
          .map(item => ({ ...item, x: item.x - item.speed }))
          .filter(item => item.x > -15) // remove if moves off-screen left
      );
    }, 50);

    return () => clearInterval(moveLoop);
  }, [isPlaying]);

  // 3. Handle item click
  const handleItemClick = (item, e) => {
    e.stopPropagation();

    // Check if it's the active quest target
    const isQuestTarget = activeQuest && item.label === activeQuest.name;

    // Spawn popup floating text
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let pointsAwarded = item.points;
    if (isQuestTarget) {
      pointsAwarded = 50; // Quests give 50 shells
    } else if (item.type !== 'trash' && item.type !== 'hazard') {
      pointsAwarded = 10; // Standard fish clicks give 10 shells
    }

    const newFloaty = {
      id: Math.random().toString(36).substring(2, 9),
      text: isQuestTarget 
        ? `🎯 MISSION COMPLETED! +50 🐚` 
        : (item.type === 'trash' || item.type === 'hazard') 
          ? `+${pointsAwarded} Cleaned! 🌊` 
          : `+10 🐚 (Found ${item.label})`,
      x: clickX,
      y: clickY,
      color: isQuestTarget ? '#39ff88' : (item.type === 'trash' || item.type === 'hazard') ? '#22d3ee' : '#22d3ee'
    };

    setFloatyTexts(prev => [...prev, newFloaty]);
    setGameItems(prev => prev.filter(x => x.id !== item.id));

    // Award global shells
    if (addShells) {
      addShells(pointsAwarded);
    }

    if (isQuestTarget) {
      // Trigger Sighting Success modal overlay
      setSuccessQuest({
        ...activeQuest,
        points: 50
      });
      setActiveQuest(null);
    }

    // Complete Kids Club mission if clean up
    if (item.type === 'trash' || item.type === 'hazard') {
      let trashCount = parseInt(localStorage.getItem('swc_cleaned_trash') || '0', 10);
      trashCount += 1;
      localStorage.setItem('swc_cleaned_trash', trashCount.toString());

      if (trashCount >= 3) {
        const completed = JSON.parse(localStorage.getItem('swc_completed_missions') || '[]');
        if (!completed.includes('cleanup')) {
          completed.push('cleanup');
          localStorage.setItem('swc_completed_missions', JSON.stringify(completed));
          
          let currentXp = parseInt(localStorage.getItem('swc_kids_xp') || '0', 10);
          localStorage.setItem('swc_kids_xp', Math.min(500, currentXp + 100).toString());

          // Trigger local state notification
          setShowMissionAlert(true);
          setTimeout(() => setShowMissionAlert(false), 5000);
        }
      }
    }

    // Auto remove floaty text after animation
    setTimeout(() => {
      setFloatyTexts(prev => prev.filter(x => x.id !== newFloaty.id));
    }, 1000);
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

          {/* Real Live YouTube Stream */}
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
              zIndex: 1
            }}
            allow="autoplay; encrypted-media"
          />

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

          {/* Interactive Game Layer Overlay */}
          {isPlaying && (
            <div className="interactiveGameLayer" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9,
              pointerEvents: 'none'
            }}>
              {gameItems.map(item => (
                <button
                  key={item.id}
                  onClick={(e) => handleItemClick(item, e)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto',
                    background: 'rgba(6, 32, 49, 0.55)',
                    border: item.type === 'fish' ? '1.5px solid rgba(34, 211, 238, 0.45)' : '1.5px solid rgba(239, 68, 68, 0.45)',
                    borderRadius: '50%',
                    width: `${item.size}px`,
                    height: `${item.size}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${item.size * 0.5}px`,
                    cursor: 'pointer',
                    boxShadow: item.type === 'fish' 
                      ? '0 0 12px rgba(34, 211, 238, 0.3)' 
                      : '0 0 12px rgba(239, 68, 68, 0.3)',
                    transition: 'transform 0.15s ease',
                    animation: 'swimOscillate 2.5s ease-in-out infinite alternate',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
                    e.currentTarget.style.background = 'rgba(6, 32, 49, 0.85)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.background = 'rgba(6, 32, 49, 0.55)';
                  }}
                  title={`Click to capture: ${item.label} (+${item.points} shells)`}
                >
                  <span style={{ display: 'inline-block', transform: item.type === 'fish' ? 'scaleX(-1)' : 'none' }}>
                    {item.emoji}
                  </span>
                  
                  {/* Floating tooltip labels */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(3, 17, 28, 0.85)',
                    border: item.type === 'fish' ? '1px solid #22d3ee' : '1px solid #ef4444',
                    color: '#fff',
                    padding: '2px 8px',
                    fontSize: '0.62rem',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '800',
                    pointerEvents: 'none',
                    opacity: 0.85
                  }}>
                    {item.label} (+{item.points})
                  </div>
                </button>
              ))}

              {/* Floaty Click Indicator Text popups */}
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

          {/* Kids Mission Clean-up Completed Alert Notification overlay */}
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
                <span style={{ fontSize: '0.78rem', color: '#b7cad6' }}>Clean the Ocean Feed (+100 XP awarded to Kids Club)</span>
              </div>
            </div>
          )}

          {/* AI Fish Detection Overlays */}
          {isPlaying && aiEnabled && detections.map(d => d.visible && (
            <div 
              key={d.id} 
              className="aiBoundingBox" 
              style={{
                position: 'absolute',
                left: d.x,
                top: d.y,
                width: `${d.w}px`,
                height: `${d.h}px`,
                border: '2px solid #22d3ee',
                boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)',
                borderRadius: '4px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 8,
                transition: 'left 2.5s ease-in-out, top 2.5s ease-in-out, opacity 0.5s ease-in-out',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-24px',
                left: '-2px',
                backgroundColor: 'rgba(6, 76, 114, 0.85)',
                border: '1.5px solid #22d3ee',
                color: '#fff',
                padding: '2px 6px',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.05em'
              }}>
                {d.label} [{d.confidence}%]
              </div>
            </div>
          ))}

          {/* Top Info Overlay (Exactly like the mockup) */}
          <div className="streamTopOverlay">
            <div className="streamInfoLeft">
              <div className="liveFeedTitle">
                <span className="liveFeedDot" style={{ backgroundColor: '#39ff88', boxShadow: '0 0 10px #39ff88' }} />
                <span>LIVE FEED</span>
              </div>
              <div className="streamCamName">
                Cam 1 - Lantana Reef View
              </div>
            </div>
            
            {/* Interactive cleanup notification banner */}
            <div className="gameHeaderBadge" style={{
              background: 'rgba(34, 211, 238, 0.15)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: '800',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#39ff88', animation: 'blinkGlow 1.5s infinite' }} />
              🎮 CLICK TO EARN: FISH (+10🐚) | DEBRIS (+25🐚)
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

          {/* Active Quest HUD */}
          {isPlaying && activeQuest && (
            <div className="activeQuestHud" style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.9) 0%, rgba(3, 17, 28, 0.95) 100%)',
              border: '1.5px solid rgba(34, 211, 238, 0.45)',
              borderRadius: '12px',
              padding: '6px 16px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.25)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              maxWidth: '45%',
              width: 'max-content',
              animation: 'fadeIn 0.5s ease',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{activeQuest.emoji}</span>
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <span style={{ display: 'block', fontSize: '0.62rem', color: '#22d3ee', fontWeight: '900', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ACTIVE QUEST
                </span>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Spot the {activeQuest.name}!
                </strong>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#b7cad6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeQuest.clue}
                </span>
              </div>
              <div style={{
                background: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '900',
                color: '#22d3ee',
                fontFamily: 'Outfit, sans-serif',
                flexShrink: 0
              }}>
                +50 🐚
              </div>
            </div>
          )}

          {/* Sighting Success Modal Overlay */}
          {successQuest && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 12, 21, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99,
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
                border: '2px solid #39ff88',
                borderRadius: '20px',
                padding: '24px',
                maxWidth: '460px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(57, 255, 136, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                animation: 'slideDownAlert 0.3s ease-out'
              }}>
                <div style={{ fontSize: '3rem', margin: '0', animation: 'swimOscillate 2s infinite alternate' }}>
                  {successQuest.emoji}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#39ff88', fontWeight: '900', letterSpacing: '0.02em' }}>
                  QUEST COMPLETED!
                </h3>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: '800' }}>
                  You spotted the {successQuest.name}!
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.45', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                  <strong>Fun Fact:</strong> {successQuest.fact}
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                  <div style={{ background: 'rgba(57, 255, 136, 0.1)', border: '1px solid #39ff88', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', color: '#39ff88' }}>
                    🐚 +50 Shells Wallet
                  </div>
                  <div style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid #22d3ee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', color: '#22d3ee' }}>
                    💵 +$0.50 USD Reward Value
                  </div>
                </div>
                <button
                  onClick={() => setSuccessQuest(null)}
                  style={{
                    background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                    border: '1.5px solid rgba(34, 211, 238, 0.35)',
                    color: '#fff',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34, 211, 238, 0.2)',
                    transition: 'all 0.2s',
                    marginTop: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Start Next Quest 🎮
                </button>
              </div>
            </div>
          )}

          {/* Bottom Player Control Bar (Exactly like the mockup) */}
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
              <span className="liveStatusDot" style={{ backgroundColor: '#39ff88', boxShadow: '0 0 8px #39ff88' }} />
              <span>LIVE</span>
            </div>

            {/* Center Seek/Progress Line (Green bar from mockup) */}
            <div className="playerProgressBarContainer">
              <div className="playerProgressBarFill" />
            </div>

            {/* Right Controls */}
            <span className="greenHdBadge">HD</span>
            
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
          from { transform: translate(-50%, -50%) translateY(-3px) rotate(1deg); }
          to { transform: translate(-50%, -50%) translateY(3px) rotate(-1deg); }
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
      `}</style>
    </section>
  );
}
