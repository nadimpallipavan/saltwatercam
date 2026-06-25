import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';
export default function LiveStream({ aiEnabled = false, addShells, shells, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  // Sighting reporting game states
  const [clickCoords, setClickCoords] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedLogSpecies, setSelectedLogSpecies] = useState(null);
  const [fishCounter, setFishCounter] = useState(0);
  const [activeAlert, setActiveAlert] = useState(null);
  const [showSeawaterAlert, setShowSeawaterAlert] = useState(false);

  // Gamification floating items states
  const [floatyTexts, setFloatyTexts] = useState([]);
  const [showMissionAlert, setShowMissionAlert] = useState(false);

  // Simulated AI detection alerts loop
  useEffect(() => {
    if (!isPlaying || !aiEnabled) {
      setActiveAlert(null);
      return;
    }

    const alertsList = [
      { type: 'fish', message: 'Common Snook detected swimming near center! 🐟', label: 'Fish' },
      { type: 'fish', message: 'Atlantic Tarpon spotted near the dock light! 🐟', label: 'Fish' },
      { type: 'turtle', message: 'Green Sea Turtle spotted on the reef floor! 🐢', label: 'Sea Turtle' },
      { type: 'shark', message: 'Reef Shark detected in the background reef! 🦈', label: 'Shark' },
      { type: 'light', message: 'Green attraction light glow intensifying! 🟢', label: 'Green Light' },
      { type: 'floor', message: 'Stingray activity spotted near the sandy floor! 🪸', label: 'Sea Floor' }
    ];

    let alertTimeout = null;
    let clearAlertTimeout = null;

    const scheduleNextAlert = () => {
      const delay = 15000 + Math.random() * 15000; // Spawns alert every 15-30s
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

  // Auto-clear seawater alert after a delay to allow clicking again
  useEffect(() => {
    if (showSeawaterAlert) {
      const timer = setTimeout(() => {
        setShowSeawaterAlert(false);
        setClickCoords(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSeawaterAlert]);

  // Handle click on the video frame overlay
  const handleFrameClick = (e) => {
    if (!isPlaying || !aiEnabled || isScanning || selectedLogSpecies || showSeawaterAlert) return;

    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickCoords({ x: clickX, y: clickY });
    setIsScanning(true);
    setShowSeawaterAlert(false);

    // Save active alert locally to prevent clearing timing race conditions
    const alertAtClick = activeAlert;

    // Run simulated AI scanning latency
    setTimeout(() => {
      setIsScanning(false);

      if (alertAtClick) {
        logVerifiedSighting(alertAtClick.type);
        setActiveAlert(null); // Consume the alert
      } else {
        logVerifiedSighting('water');
      }
    }, 1000);
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

  // Handle user classification selection
  const logVerifiedSighting = (type) => {
    if (type === 'water') {
      setShowSeawaterAlert(true);
      return;
    }

    let result = null;

    if (type === 'fish') {
      const fishSpecies = [
        {
          name: "Common Snook",
          emoji: "🐟",
          color: "Silver Body with a Black Lateral Stripe",
          confidence: "98.3%",
          fact: "The Snook has a dark black line running down its side called a lateral line. It acts like a radar, helping them feel water vibrations to hunt in the dark!"
        },
        {
          name: "Atlantic Tarpon",
          emoji: "🐟",
          color: "Metallic Silver scales",
          confidence: "97.9%",
          fact: "Tarpons are known as the Silver King! They have huge reflective scales that shine like metal and can gulp air at the surface to breathe in low-oxygen water."
        },
        {
          name: "Goliath Grouper",
          emoji: "🐡",
          color: "Mottled Olive Brown & Grey",
          confidence: "96.5%",
          fact: "Goliath Groupers can grow larger than a refrigerator and weigh up to 800 lbs! They are territorial and defend their reef caves by making low booming sounds."
        },
        {
          name: "Yellow Tang",
          emoji: "🐠",
          color: "Bright Golden Yellow",
          confidence: "98.1%",
          fact: "Yellow Tangs are tireless reef cleaners. They graze on algae growing on sea turtle shells and corals, keeping the entire ecosystem healthy!"
        },
        {
          name: "Blue Tang",
          emoji: "🐟",
          color: "Vibrant Neon Blue & Yellow Fin Highlights",
          confidence: "98.6%",
          fact: "Blue Tang surgeonfish are crucial for algae control. They can change their color to deep purple at night to blend with reef shadows!"
        }
      ];
      result = fishSpecies[Math.floor(Math.random() * fishSpecies.length)];
    } else if (type === 'turtle') {
      result = {
        name: "Green Sea Turtle",
        emoji: "🐢",
        color: "Olive Green & Dark Brown Shell",
        confidence: "99.2%",
        fact: "Green Sea Turtles are air-breathing reptiles that can hold their breath for up to 5 hours! They graze on seagrasses and algae on the reef floor."
      };
    } else if (type === 'shark') {
      result = {
        name: "Reef Shark",
        emoji: "🦈",
        color: "Slate Grey Skin & White Belly",
        confidence: "97.8%",
        fact: "Reef sharks are apex predators that keep the local fish populations healthy. They are very shy, docile, and avoid humans."
      };
    } else if (type === 'light') {
      result = {
        name: "Neon Green Dock Light Glow",
        emoji: "🟢",
        color: "Bright Emerald / Neon Green Glow",
        confidence: "98.8%",
        fact: "The green light under Lantana Dock attracts microscopic zooplankton. This draws in small baitfish, which eventually attracts large gamefish like Snook to feed at night!"
      };
    } else if (type === 'floor') {
      result = {
        name: "Sandy Sea Floor & Coral Structure",
        emoji: "🪸",
        color: "Tan Sand & Coral Rock Brown",
        confidence: "97.1%",
        fact: "Rocky limestone reef structures provide vital cracks, caves, and overhangs for small crabs, spiny lobsters, and juvenile reef fish to hide in!"
      };
    }

    if (result) {
      result.shells = 15; // Logged sightings award 15 shells
      setSelectedLogSpecies(result);
      setFishCounter(prev => prev + 1);

      if (addShells) {
        addShells(15);
      }

      if (clickCoords) {
        triggerFloaty(clickCoords.x, clickCoords.y, `🎯 VERIFIED! +15 🐚`);
      }

      // Complete Kids Club Scan Sighting Mission: Scan 3 unique species
      let scannedSpecies = JSON.parse(localStorage.getItem('swc_scanned_species') || '[]');
      if (!scannedSpecies.includes(result.name)) {
        scannedSpecies.push(result.name);
        localStorage.setItem('swc_scanned_species', JSON.stringify(scannedSpecies));

        if (scannedSpecies.length >= 3) {
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
      }
    }
    setClickCoords(null);
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

          {/* AI Alert Banner HUD overlay */}
          {activeAlert && (
            <div style={{
              position: 'absolute',
              top: '80px',
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
                  {activeAlert.message} Click the feed to scan! <strong style={{ color: '#39ff88' }}>(+15🐚)</strong>
                </span>
              </div>
            </div>
          )}


          {/* Seawater Only Alert */}
          {showSeawaterAlert && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 12, 21, 0.7)',
              backdropFilter: 'blur(4px)',
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
                  <span style={{ fontSize: '0.62rem', color: '#b7cad6', fontWeight: '900', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AI Scan Result
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: '800' }}>
                    Seawater Only
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  No marine life detected at these coordinates. Keep watching the live stream and click when a fish swims by!
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
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '4px',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s'
                  }}
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
              gap: '8px',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#39ff88', animation: 'blinkGlow 1.5s infinite' }} />
              <span>📊 Session Sightings Counted: <strong style={{ color: '#39ff88', fontSize: '0.95rem' }}>{fishCounter}</strong></span>
              <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
              <span>Click real feed to log features & verify species</span>
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

          {/* Sighting Success Modal Overlay */}
          {selectedLogSpecies && (
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
                border: '2px solid #22d3ee',
                borderRadius: '20px',
                padding: '24px 28px',
                maxWidth: '460px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(34, 211, 238, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideDownAlert 0.3s ease-out'
              }}>
                <div style={{ fontSize: '3rem', margin: '0', animation: 'swimOscillate 2s infinite alternate' }}>
                  {selectedLogSpecies.emoji}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.62rem', color: '#22d3ee', fontWeight: '900', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AI SIGHTING LOGGED [{selectedLogSpecies.confidence}]
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: '800' }}>
                    Spotted: {selectedLogSpecies.name}
                  </h4>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)', 
                  padding: '10px 14px', 
                  borderRadius: '10px',
                  border: '1.5px solid rgba(34, 211, 238, 0.1)',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#b7cad6' }}>
                    <strong style={{ color: '#22d3ee' }}>Detected Color:</strong> {selectedLogSpecies.color}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff', lineHeight: '1.45', marginTop: '2px' }}>
                    <strong style={{ color: '#39ff88', display: 'block', marginBottom: '2px', fontSize: '0.82rem' }}>Science Solution:</strong>
                    {selectedLogSpecies.fact}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                  <div style={{ background: 'rgba(57, 255, 136, 0.1)', border: '1px solid #39ff88', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', color: '#39ff88' }}>
                    🐚 +{selectedLogSpecies.shells || 10} Shells Wallet
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLogSpecies(null)}
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
                    marginTop: '4px',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Scan Next Sighting 🔍
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
