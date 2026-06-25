import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';
export default function LiveStream({ aiEnabled = false, addShells, shells, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  // Sighting reporting game states
  const [clickCoords, setClickCoords] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [fishCounter, setFishCounter] = useState(0);
  const [activeAlert, setActiveAlert] = useState(null);

  // Floating trash states
  const [trashItems, setTrashItems] = useState([]);
  const [trashCleanedCount, setTrashCleanedCount] = useState(0);
  const [cleanupAlert, setCleanupAlert] = useState(null);

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

  // Simulated AI detection alerts loop
  useEffect(() => {
    if (!isPlaying || !aiEnabled) {
      setActiveAlert(null);
      return;
    }

    const alertsList = [
      { type: 'fish', message: 'Common Snook detected swimming! 🐟 Tap video! (+1 🐚)', label: 'Fish' },
      { type: 'fish', message: 'Atlantic Tarpon spotted near dock light! 🐟 Tap video! (+1 🐚)', label: 'Fish' },
      { type: 'turtle', message: 'Green Sea Turtle spotted! 🐢 Tap video! (+1 🐚)', label: 'Sea Turtle' },
      { type: 'shark', message: 'Reef Shark cruising in the reef! 🦈 Tap video! (+1 🐚)', label: 'Shark' },
      { type: 'light', message: 'Baitfish swarming around light! 🟢 Tap video! (+1 🐚)', label: 'Green Light' },
      { type: 'floor', message: 'Stingray gliding on sandy floor! 🪸 Tap video! (+1 🐚)', label: 'Sea Floor' }
    ];

    let alertTimeout = null;
    let clearAlertTimeout = null;

    const scheduleNextAlert = () => {
      const delay = 12000 + Math.random() * 12000; // Spawns alert every 12-24s
      alertTimeout = setTimeout(() => {
        const randomAlert = alertsList[Math.floor(Math.random() * alertsList.length)];
        setActiveAlert(randomAlert);

        // Alert remains active for 6 seconds
        clearAlertTimeout = setTimeout(() => {
          setActiveAlert(null);
          scheduleNextAlert();
        }, 6000);

      }, delay);
    };

    scheduleNextAlert();

    return () => {
      clearTimeout(alertTimeout);
      clearTimeout(clearAlertTimeout);
    };
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



  // Simulated floating trash loop (Reef Trash Cleanup Mode)
  useEffect(() => {
    if (!isPlaying || !aiEnabled) {
      setTrashItems([]);
      return;
    }

    const trashTypes = [
      { emoji: '🍾', label: 'Plastic Bottle', fact: 'Plastic bottles can take 450 years to break down in the ocean!' },
      { emoji: '🛍️', label: 'Plastic Bag', fact: 'Sea turtles often mistake plastic bags for tasty jellyfish!' },
      { emoji: '🥤', label: 'Plastic Cup', fact: 'Over 8 million tons of plastic trash enter our oceans every year!' },
      { emoji: '🥫', label: 'Aluminum Can', fact: 'Recycling aluminum cans saves 95% of the energy needed to make new ones!' },
      { emoji: '🎈', label: 'Rubber Balloon', fact: 'Balloons can float for miles and end up blocking animals\' stomachs.' }
    ];

    const spawnTrash = () => {
      setTrashItems(prev => {
        // Limit max concurrent trash items to avoid cluttering the screen
        if (prev.length >= 4) return prev;

        const randomType = trashTypes[Math.floor(Math.random() * trashTypes.length)];
        const newItem = {
          id: Math.random().toString(36).substring(2, 9),
          emoji: randomType.emoji,
          label: randomType.label,
          fact: randomType.fact,
          y: 20 + Math.random() * 55, // Drifts between 20% and 75% depth
          duration: 10 + Math.random() * 8, // Drifts across in 10-18s
          scale: 0.85 + Math.random() * 0.55 // Scale between 0.85 and 1.4
        };

        // Auto-remove trash item after its duration ends
        setTimeout(() => {
          setTrashItems(current => current.filter(item => item.id !== newItem.id));
        }, newItem.duration * 1000);

        return [...prev, newItem];
      });
    };

    // Spawn first item after 1.5 seconds, then spawn periodically
    const firstSpawn = setTimeout(spawnTrash, 1500);

    const spawnInterval = setInterval(() => {
      spawnTrash();
    }, 7000 + Math.random() * 4000);

    return () => {
      clearTimeout(firstSpawn);
      clearInterval(spawnInterval);
    };
  }, [isPlaying, aiEnabled]);

  // Trash Click Handler
  const handleTrashClick = (e, item) => {
    e.stopPropagation(); // Avoid triggering standard frame click coordinates

    setTrashItems(prev => prev.filter(x => x.id !== item.id));
    setTrashCleanedCount(prev => prev + 1);

    if (addShells) {
      addShells(10); // Award +10 Shells for cleaning trash
    }

    // Trigger floating success text at click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();
    const clickX = ((rect.left - parentRect.left + rect.width / 2) / parentRect.width) * 100;
    const clickY = ((rect.top - parentRect.top + rect.height / 2) / parentRect.height) * 100;
    triggerFloaty(clickX, clickY, `🧼 Cleaned! +10 🐚`);

    // Show temporary educational toast at top center
    setCleanupAlert({
      emoji: item.emoji,
      label: item.label,
      fact: item.fact
    });
  };

  // Auto-clear cleanup alert toast
  useEffect(() => {
    if (cleanupAlert) {
      const timer = setTimeout(() => {
        setCleanupAlert(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [cleanupAlert]);

  // Handle click on the video frame overlay
  const handleFrameClick = (e) => {
    if (!isPlaying || !aiEnabled || isScanning) return;

    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickCoords({ x: clickX, y: clickY });
    setIsScanning(true);

    const alertAtClick = activeAlert;

    // Fast 300ms scanning feedback
    setTimeout(() => {
      setIsScanning(false);
      setClickCoords(null);

      if (alertAtClick) {
        // Award +1 Shell for spotting a fish
        if (addShells) {
          addShells(1);
        }
        
        const nextFishCount = fishCounter + 1;
        setFishCounter(nextFishCount);
        triggerFloaty(clickX, clickY, `🐟 Fish Spot! +1 🐚`);
        setActiveAlert(null); // Consume alert

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
        // Seawater tap (0 shells)
        triggerFloaty(clickX, clickY, `💧 Seawater! +0 🐚`);
      }
    }, 300);
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

          {/* Interactive AI Scanning Lens Overlays (Covering background video clicks) */}
          {isPlaying && aiEnabled && (
            <div 
              className="aiScanOverlay"
              onClick={handleFrameClick}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 8,
                cursor: isScanning ? 'wait' : 'crosshair'
              }}
              title="AI Lens Active: Click anywhere on the live video feed to scan!"
            />
          )}

          {/* Pulsing Target Scan Reticle */}
          {isScanning && clickCoords && (
            <div
              style={{
                position: 'absolute',
                left: `${clickCoords.x}%`,
                top: `${clickCoords.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                pointerEvents: 'none'
              }}
            >
              <div className="scanTargetRing" />
              <div className="scanRadarPulse" />
              <div style={{
                position: 'absolute',
                top: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(3, 27, 46, 0.9)',
                border: '1.5px solid #22d3ee',
                color: '#22d3ee',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.68rem',
                fontWeight: '900',
                whiteSpace: 'nowrap',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
                animation: 'blinkGlow 1s infinite'
              }}>
                AI LENS SCANNING...
              </div>
            </div>
          )}

          {/* Level Progress HUD Bar */}
          {isPlaying && aiEnabled && (
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

          {/* AI Alert Banner HUD overlay (AI Spotter Mode) */}
          {activeAlert && (
            <div style={{
              position: 'absolute',
              top: '135px', // Shifted down to stack nicely under Level Progress HUD bar
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '16px',
              padding: '12px 24px',
              color: '#fff',
              zIndex: 90,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 10px rgba(239, 68, 68, 0.2)',
              animation: 'pulseAlertBorder 2s infinite ease-in-out, slideDownAlert 0.3s ease-out',
              fontFamily: 'Outfit, sans-serif',
              pointerEvents: 'none' // Click passes through to the underlying scanner overlay
            }}>
              <span className="blinkingRedDot" style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 10px #ef4444',
                display: 'inline-block',
                animation: 'blinkDot 1s infinite'
              }} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#ff6b6b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  🚨 AI ALERT: ACTIVE SIGHTING
                </strong>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                  {activeAlert.message} Click the feed to scan! <strong style={{ color: '#39ff88' }}>(+1🐚)</strong>
                </span>
              </div>
            </div>
          )}

          {/* Cleaned Trash educational banner */}
          {cleanupAlert && (
            <div style={{
              position: 'absolute',
              top: '135px', // Shifted down to stack nicely under Level Progress HUD bar
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(16, 185, 129, 0.18)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(16, 185, 129, 0.65)',
              borderRadius: '16px',
              padding: '12px 24px',
              color: '#fff',
              zIndex: 90,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35), inset 0 0 10px rgba(16, 185, 129, 0.2)',
              animation: 'pulseCleanBorder 1.5s infinite ease-in-out, slideDownAlert 0.3s ease-out',
              fontFamily: 'Outfit, sans-serif',
              pointerEvents: 'none',
              maxWidth: '420px',
              width: '90%'
            }}>
              <span style={{ fontSize: '2.5rem' }}>{cleanupAlert.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#34d399', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  🧼 CLEANED: {cleanupAlert.label} (+10🐚)
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                  {cleanupAlert.fact}
                </span>
              </div>
            </div>
          )}

          {/* Floating Trash Cleanup items */}
          {isPlaying && aiEnabled && trashItems.map(item => (
            <button
              key={item.id}
              onClick={(e) => handleTrashClick(e, item)}
              style={{
                position: 'absolute',
                top: `${item.y}%`,
                fontSize: '2.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 85,
                transform: `scale(${item.scale})`,
                animation: `driftAcross ${item.duration}s linear forwards`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                outline: 'none',
                userSelect: 'none',
                padding: '10px'
              }}
              className="floatingTrashBtn"
            >
              <span className="trashEmoji" style={{
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
                animation: 'trashSway 3s ease-in-out infinite alternate',
                display: 'inline-block'
              }}>
                {item.emoji}
              </span>
              <span style={{
                fontSize: '0.62rem',
                background: 'rgba(239, 68, 68, 0.95)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '20px',
                marginTop: '4px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '900',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                letterSpacing: '0.05em'
              }}>
                TAP ME! 🧹
              </span>
            </button>
          ))}




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
              <span>🐟 Fish Tapped: <strong style={{ color: '#39ff88', fontSize: '0.95rem' }}>{fishCounter}</strong></span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
              <span>🧹 Trash Cleaned: <strong style={{ color: '#39ff88', fontSize: '0.95rem' }}>{trashCleanedCount}</strong></span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
              <span>Watch live feed: Click fish (+1 🐚) & trash (+10 🐚) to Level Up!</span>
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
        @keyframes driftAcross {
          0% { left: -60px; }
          100% { left: calc(100% + 60px); }
        }
        @keyframes trashSway {
          0% { transform: rotate(-15deg) translateY(-2px); }
          100% { transform: rotate(15deg) translateY(2px); }
        }
        @keyframes pulseCleanBorder {
          0% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
          50% { border-color: rgba(16, 185, 129, 1); box-shadow: 0 0 25px rgba(16, 185, 129, 0.55); }
          100% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        }
        @keyframes pulseAlertBorder {
          0% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
          50% { border-color: rgba(239, 68, 68, 1); box-shadow: 0 0 25px rgba(239, 68, 68, 0.5); }
          100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }
        }
        @keyframes blinkDot {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        .scanTargetRing {
          border: 2px dashed #22d3ee;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          animation: spinRing 4s linear infinite;
        }
        .scanRadarPulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #22d3ee;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          animation: pingRadar 1s ease-out infinite;
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pingRadar {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
