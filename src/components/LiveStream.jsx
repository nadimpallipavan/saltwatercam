import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

export default function LiveStream({ aiEnabled = false, addShells, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Simulated AI targets tracking
  const [detections, setDetections] = useState([
    { id: 1, label: 'COMMON SNOOK', confidence: 94, x: '35%', y: '40%', w: 130, h: 65, visible: true },
    { id: 2, label: 'ATLANTIC TARPON', confidence: 89, x: '65%', y: '30%', w: 180, h: 75, visible: false },
    { id: 3, label: 'GOLIATH GROUPER', confidence: 91, x: '45%', y: '60%', w: 150, h: 90, visible: true },
    { id: 4, label: 'GREEN SEA TURTLE', confidence: 97, x: '72%', y: '50%', w: 110, h: 70, visible: false },
  ]);

  // Gamification floating items states
  const [gameItems, setGameItems] = useState([]);
  const [floatyTexts, setFloatyTexts] = useState([]);
  const [showMissionAlert, setShowMissionAlert] = useState(false);

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
          nextConf = Math.min(99, Math.max(82, d.confidence + (Math.random() > 0.5 ? 1 : -1)));
        }

        return { ...d, visible: nextVisible, x: nextX, y: nextY, confidence: nextConf };
      }));
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, aiEnabled]);

  // 1. Game loop: Spawn floating items (fish/trash)
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setGameItems(prev => {
        if (prev.length >= 4) return prev; // cap at 4 items

        const templates = [
          { type: 'fish', emoji: '🐠', label: 'Neon Tang', points: 10, size: 50 },
          { type: 'fish', emoji: '🐟', label: 'Silver Snook', points: 10, size: 52 },
          { type: 'fish', emoji: '🐡', label: 'Puffer Fish', points: 10, size: 46 },
          { type: 'trash', emoji: '🧴', label: 'Plastic Bottle', points: 25, size: 48 },
          { type: 'trash', emoji: '🥤', label: 'Soda Can', points: 25, size: 45 },
          { type: 'hazard', emoji: '🛢️', label: 'Toxic Barrel', points: 25, size: 54 },
          { type: 'trash', emoji: '🕸️', label: 'Ghost Net', points: 25, size: 50 },
        ];

        const selected = templates[Math.floor(Math.random() * templates.length)];
        const newItem = {
          id: Math.random().toString(36).substring(2, 9),
          ...selected,
          x: 105, // start off-screen to the right
          y: 15 + Math.random() * 60, // random height
          speed: 0.18 + Math.random() * 0.22, // swim speed
          hovered: false,
        };

        return [...prev, newItem];
      });
    }, 3200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

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

    // Spawn popup floating text
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const newFloaty = {
      id: Math.random().toString(36).substring(2, 9),
      text: item.type === 'fish' ? `+${item.points} ${item.label} Scanned` : `+${item.points} Cleaned! 🌊`,
      x: clickX,
      y: clickY,
      color: item.type === 'fish' ? '#22d3ee' : '#39ff88'
    };

    setFloatyTexts(prev => [...prev, newFloaty]);
    setGameItems(prev => prev.filter(x => x.id !== item.id));

    // Award global shells
    if (addShells) {
      addShells(item.points);
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

          {/* Mockup live stream background */}
          <img 
            src="watch-live-bg-clean.png" 
            alt="Live Underwater Stream" 
            className="streamBgImage" 
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
                <span className="liveFeedDot" style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
                <span>DEMO FEED <span className="timezoneLabel">(Connection Pending)</span></span>
              </div>
              <div className="streamCamName">
                Cam 1 - Reef View (Demo Mode)
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
              <span className="liveStatusDot" style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
              <span>DEMO</span>
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
