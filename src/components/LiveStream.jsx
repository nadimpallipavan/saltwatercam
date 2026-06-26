import { useState, useEffect, useRef } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

// Format a Date to Eastern Time HH:MM:SS AM/PM
const toEasternTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  });
};

const toEasternDate = (date) => {
  return date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

// Fish coordinate keyframes synced to the WebM reef video loop
// Each keyframe: { t: seconds, x: % from left, y: % from top, visible: bool }
const keyframes = {
  f1: [ // Bannerfish — swims left to right
    { t: 0,  x: 15, y: 35, visible: true  },
    { t: 4,  x: 45, y: 48, visible: true  },
    { t: 8,  x: 75, y: 38, visible: true  },
    { t: 11, x: 92, y: 25, visible: true  },
    { t: 13, x: 95, y: 20, visible: false }
  ],
  f2: [ // Yellow Tang — swims right to left
    { t: 0,  x: 90, y: 70, visible: false },
    { t: 2,  x: 85, y: 65, visible: true  },
    { t: 6,  x: 50, y: 55, visible: true  },
    { t: 10, x: 20, y: 45, visible: true  },
    { t: 13, x: 5,  y: 40, visible: false }
  ]
};

// Linear interpolation between keyframe positions
const getInterpolatedPosition = (targetId, time) => {
  const frames = keyframes[targetId];
  if (!frames) return { x: 0, y: 0, visible: false };

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].t < time) i++;

  const f0 = frames[i];
  const f1 = frames[i + 1] || f0;

  if (f0.t === f1.t) return { x: f0.x, y: f0.y, visible: f0.visible };

  const ratio = (time - f0.t) / (f1.t - f0.t);
  return {
    x: f0.x + (f1.x - f0.x) * ratio,
    y: f0.y + (f1.y - f0.y) * ratio,
    visible: ratio < 0.5 ? f0.visible : f1.visible
  };
};

// Virtual fish positions for the live feed simulation
const getVirtualFishPosition = (id, time) => {
  const cycle = time % 15;
  const progress = cycle / 15;

  if (id === 'v1') {
    const x = progress * 130 - 15;
    const y = 35 + Math.sin(progress * Math.PI * 2) * 8;
    const visible = x >= 0 && x <= 100;
    return { x, y, visible };
  }
  if (id === 'v2') {
    const x = 115 - progress * 130;
    const y = 60 + Math.cos(progress * Math.PI * 2) * 10;
    const visible = x >= 0 && x <= 100;
    return { x, y, visible };
  }
  if (id === 'v3') {
    const fastCycle = time % 10;
    const fastProgress = fastCycle / 10;
    const x = fastProgress * 140 - 20;
    const y = 25 + Math.sin(fastProgress * Math.PI * 2) * 5;
    const visible = x >= 0 && x <= 100;
    return { x, y, visible };
  }
  const medCycle = time % 12;
  const medProgress = medCycle / 12;
  const x = 120 - medProgress * 140;
  const y = 75 + Math.sin(medProgress * Math.PI) * 12;
  const visible = x >= 0 && x <= 100;
  return { x, y, visible };
};

export default function LiveStream({ addShells, shells, currentUser }) {
  // 'recorded' = game loop with accurate fish detection | 'youtube' = view-only live stream
  const [feedType, setFeedType] = useState('recorded');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [fishCounter, setFishCounter] = useState(0);

  // Floating tap-result text popups
  const [floatyTexts, setFloatyTexts] = useState([]);

  // Mission alert
  const [showMissionAlert, setShowMissionAlert] = useState(false);

  // Level progression
  const getLevelInfo = (shellCount) => {
    if (shellCount < 20)  return { level: 1, target: 20,   prevTarget: 0,   title: 'Tadpole Scout' };
    if (shellCount < 50)  return { level: 2, target: 50,   prevTarget: 20,  title: 'Reef Explorer' };
    if (shellCount < 100) return { level: 3, target: 100,  prevTarget: 50,  title: 'Marine Protector' };
    if (shellCount < 200) return { level: 4, target: 200,  prevTarget: 100, title: 'Ocean Guardian' };
    return                       { level: 5, target: null,  prevTarget: 200, title: 'Grand Master Protector' };
  };

  const [currentLevel, setCurrentLevel] = useState(() => getLevelInfo(shells).level);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(null);

  // Live real-time clock (Eastern Time — Boynton Beach, FL)
  const [liveTime, setLiveTime] = useState(() => toEasternTime(new Date()));
  const [liveDate, setLiveDate] = useState(() => toEasternDate(new Date()));
  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setLiveTime(toEasternTime(now));
      setLiveDate(toEasternDate(now));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const info = getLevelInfo(shells);
    if (info.level > currentLevel) {
      setCurrentLevel(info.level);
      setShowLevelUpAlert(info);
    } else if (info.level < currentLevel) {
      setCurrentLevel(info.level);
    }
  }, [shells, currentLevel]);

  // Sync play / pause to the <video> element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying, feedType]);

  // Sync mute to the <video> element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted, feedType]);

  // ─── ACCURATE FISH DETECTION (both live and recorded loops) ───────────────────
  const handleGameTap = (e) => {
    if (!isPlaying || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // For live feed, use date-based elapsed seconds. For recorded, use video position.
    const time = feedType === 'youtube' 
      ? (Date.now() / 1000) 
      : (videoRef.current ? videoRef.current.currentTime : 0);

    const dist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    const HIT_THRESHOLD = 15; // Must tap within 15% of fish center

    let hit = false;

    if (feedType === 'recorded') {
      const posF1 = getInterpolatedPosition('f1', time);
      const posF2 = getInterpolatedPosition('f2', time);
      const hitF1 = posF1.visible && dist(clickX, clickY, posF1.x, posF1.y) <= HIT_THRESHOLD;
      const hitF2 = posF2.visible && dist(clickX, clickY, posF2.x, posF2.y) <= HIT_THRESHOLD;
      hit = hitF1 || hitF2;
    } else {
      // Live YouTube feed - check against simulated/virtual sea animal targets
      const posV1 = getVirtualFishPosition('v1', time);
      const posV2 = getVirtualFishPosition('v2', time);
      const posV3 = getVirtualFishPosition('v3', time);
      const posV4 = getVirtualFishPosition('v4', time);
      
      const hitV1 = posV1.visible && dist(clickX, clickY, posV1.x, posV1.y) <= HIT_THRESHOLD;
      const hitV2 = posV2.visible && dist(clickX, clickY, posV2.x, posV2.y) <= HIT_THRESHOLD;
      const hitV3 = posV3.visible && dist(clickX, clickY, posV3.x, posV3.y) <= HIT_THRESHOLD;
      const hitV4 = posV4.visible && dist(clickX, clickY, posV4.x, posV4.y) <= HIT_THRESHOLD;
      hit = hitV1 || hitV2 || hitV3 || hitV4;
    }

    if (hit) {
      // ✅ Fish detected!
      if (addShells) addShells(1);
      const next = fishCounter + 1;
      setFishCounter(next);
      triggerFloaty(clickX, clickY, '🐟 Fish Detected! +1 🐚', '#39ff88');

      // Kids Club mission: spot 3 fish
      if (next >= 3) {
        const completed = JSON.parse(localStorage.getItem('swc_completed_missions') || '[]');
        if (!completed.includes('cleanup')) {
          completed.push('cleanup');
          localStorage.setItem('swc_completed_missions', JSON.stringify(completed));
          const xp = Math.min(500, parseInt(localStorage.getItem('swc_kids_xp') || '0', 10) + 100);
          localStorage.setItem('swc_kids_xp', xp.toString());
          setShowMissionAlert(true);
          setTimeout(() => setShowMissionAlert(false), 5000);
        }
      }
    } else {
      // 💧 Water — no fish here
      triggerFloaty(clickX, clickY, '💧 Water Detected! +0', '#60a5fa');
    }
  };

  // Spawn a floating text label that fades upward and disappears
  const triggerFloaty = (x, y, text, color = '#39ff88') => {
    const id = Math.random().toString(36).slice(2, 9);
    setFloatyTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setFloatyTexts(prev => prev.filter(f => f.id !== id)), 1400);
  };

  const levelInfo = getLevelInfo(shells);

  return (
    <section className="liveStage">
      <div className="liveFrame">
        <div className={`underwaterScene ${isPlaying ? 'playing' : 'paused'}`}>

          {/* HUD scanning line */}
          {isPlaying && <div className="scanningLine" />}

          {/* HUD: live time — real-time, no fake data */}
          {isPlaying && (
            <div className="hudIndicator">
              <span className="hudSignalDot" />
              <span>📍 Boynton Beach, FL &nbsp;|&nbsp; {liveDate} &nbsp;|&nbsp; 🕐 {liveTime} ET</span>
            </div>
          )}

          {/* ── VIDEO / IFRAME ────────────────────────────── */}
          {feedType === 'youtube' ? (
            <iframe
              id="yt-live-stream"
              src="https://www.youtube.com/embed/fT23X66iQ7Q?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&loop=1&playlist=fT23X66iQ7Q"
              title="Live Underwater Stream"
              className="streamBgImage"
              style={{
                border: 'none', pointerEvents: 'none',
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', zIndex: 1
              }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video
              ref={videoRef}
              src="https://upload.wikimedia.org/wikipedia/commons/2/24/Tropical_Fish_Banner_Fish_on_Coral_Reef.webm"
              className="streamBgImage"
              autoPlay loop muted playsInline
              crossOrigin="anonymous"
              style={{
                border: 'none', pointerEvents: 'none',
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', objectFit: 'cover', zIndex: 1
              }}
            />
          )}

          {/* Glowing green beam */}
          <div className="greenBeam" />

          {/* Bubbles */}
          {isPlaying && (
            <>
              <div className="bubble b1" />
              <div className="bubble b2" />
              <div className="bubble b3" />
              <div className="bubble b4" />
              <div className="bubble b5" />
            </>
          )}

          {/* ── CLICK CATCHER (active for both loops) ────────── */}
          {isPlaying && (
            <div
              ref={containerRef}
              onClick={handleGameTap}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 8, cursor: 'crosshair'
              }}
              title="Tap directly on the fish swimming in the video!"
            />
          )}



          {/* ── FLOATING TAP RESULT TEXTS ─────────────────────── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 90, pointerEvents: 'none' }}>
            {floatyTexts.map(f => (
              <div key={f.id} style={{
                position: 'absolute',
                left: `${f.x}%`, top: `${f.y}%`,
                transform: 'translate(-50%, -50%)',
                color: f.color,
                fontSize: '1.05rem', fontWeight: '900',
                fontFamily: 'Outfit, sans-serif',
                textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 10px currentColor',
                pointerEvents: 'none',
                animation: 'floatUpFade 1.2s forwards ease-out',
                whiteSpace: 'nowrap'
              }}>
                {f.text}
              </div>
            ))}
          </div>

          {/* ── MISSION COMPLETED BANNER ──────────────────────── */}
          {showMissionAlert && (
            <div style={{
              position: 'absolute', top: '80px', left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(6,32,49,0.95) 0%, rgba(3,17,28,0.98) 100%)',
              border: '2px solid #39ff88', boxShadow: '0 0 25px rgba(57,255,136,0.35)',
              borderRadius: '12px', padding: '12px 20px', color: '#fff',
              zIndex: 99, display: 'flex', alignItems: 'center', gap: '12px',
              animation: 'slideDownAlert 0.4s ease-out', fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🏆</span>
              <div>
                <strong style={{ display: 'block', color: '#39ff88', fontSize: '0.88rem' }}>MISSION COMPLETED!</strong>
                <span style={{ fontSize: '0.78rem', color: '#b7cad6' }}>Spotted 3 fish — +100 XP awarded!</span>
              </div>
            </div>
          )}

          {/* ── TOP INFO OVERLAY ──────────────────────────────── */}
          <div className="streamTopOverlay">
            <div className="streamInfoLeft">
              <div className="liveFeedTitle">
                <span className="liveFeedDot" style={{
                  backgroundColor: feedType === 'youtube' ? '#39ff88' : '#22d3ee',
                  boxShadow: feedType === 'youtube' ? '0 0 10px #39ff88' : '0 0 10px #22d3ee'
                }} />
                <span>{feedType === 'youtube' ? 'LIVE FEED (YOUTUBE)' : 'GAME LOOP — AI ACTIVE'}</span>
              </div>
              <div className="streamCamName">
                {feedType === 'youtube' ? 'Cam 1 - Lantana Dock Live Stream' : 'Tap the fish to earn shells!'}
              </div>
            </div>

            {/* Fish counter badge */}
            <div className="gameHeaderBadge" style={{
              background: 'rgba(34,211,238,0.12)',
              border: '1px solid rgba(34,211,238,0.25)',
              color: '#fff', fontSize: '0.78rem', fontWeight: '800',
              padding: '6px 14px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{
                display: 'inline-block', width: '6px', height: '6px',
                borderRadius: '50%', backgroundColor: '#39ff88',
                animation: 'blinkGlow 1.5s infinite'
              }} />
              <span>🐟 Fish Spotted: <strong style={{ color: '#39ff88' }}>{fishCounter}</strong></span>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>|</span>
              <span style={{ color: '#b7cad6' }}>
                {feedType === 'recorded' ? 'Tap the fish — not the water!' : 'Switch to Game Loop to play'}
              </span>
            </div>

            {/* Top-right buttons */}
            <div className="streamControlButtonsRight">
              <button className="iconCircleBtn" onClick={() => alert('Link copied!')} aria-label="Share"><Share2 size={16} /></button>
              <button className="iconCircleBtn" onClick={() => alert('Snapshot saved!')} aria-label="Snapshot"><Camera size={16} /></button>
              <button className="iconCircleBtn" onClick={() => alert('Fullscreen activated!')} aria-label="Fullscreen"><Maximize size={16} /></button>
            </div>
          </div>

          {/* Paused overlay */}
          {!isPlaying && (
            <div className="pausedOverlay">
              <button className="playOverlayBtn" onClick={() => setIsPlaying(true)} aria-label="Play">
                <Play size={32} fill="currentColor" />
              </button>
              <p>Stream Paused</p>
            </div>
          )}

          {/* Level Up celebration */}
          {showLevelUpAlert && (
            <div onClick={() => setShowLevelUpAlert(null)} style={{
              position: 'absolute', inset: 0,
              background: 'rgba(2,12,21,0.85)', backdropFilter: 'blur(10px)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', color: '#fff', fontFamily: 'Outfit, sans-serif', cursor: 'pointer'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6,32,49,0.98) 0%, rgba(3,17,28,0.99) 100%)',
                border: '3px solid #39ff88', borderRadius: '24px',
                padding: '36px 32px', maxWidth: '420px', width: '95%',
                textAlign: 'center', boxShadow: '0 0 50px rgba(57,255,136,0.35)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                animation: 'slideDownAlert 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <div style={{ fontSize: '4.5rem', animation: 'bounceUp 1s infinite alternate' }}>🏆</div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#39ff88', fontWeight: '900',
                    letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block' }}>Congratulations!</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '2.1rem', color: '#fff', fontWeight: '900' }}>LEVEL UP!</h3>
                </div>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#b7cad6' }}>
                  You reached <strong style={{ color: '#39ff88' }}>Level {showLevelUpAlert.level}</strong>!
                </p>
                <div style={{
                  background: 'rgba(57,255,136,0.1)', border: '1.5px solid rgba(57,255,136,0.3)',
                  padding: '8px 20px', borderRadius: '30px',
                  fontSize: '0.95rem', fontWeight: '800', color: '#39ff88',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  ⭐ Rank: {showLevelUpAlert.title}
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  Tap anywhere to keep playing
                </p>
              </div>
            </div>
          )}

          {/* Level progress HUD — hidden on mobile via .levelProgressHud CSS class */}
          {isPlaying && feedType === 'recorded' && (
            <div className="levelProgressHud" style={{
              position: 'absolute', top: '75px', left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(3,27,46,0.85)', backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(34,211,238,0.35)', borderRadius: '20px',
              padding: '6px 16px', color: '#fff', zIndex: 90,
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontFamily: 'Outfit, sans-serif', pointerEvents: 'none',
              minWidth: '290px', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⭐</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#22d3ee',
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Level {levelInfo.level}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>({levelInfo.title})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginLeft: '12px' }}>
                <div style={{
                  height: '6px', background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px', flex: 1, overflow: 'hidden'
                }}>
                  <div style={{
                    width: levelInfo.target
                      ? `${((shells - levelInfo.prevTarget) / (levelInfo.target - levelInfo.prevTarget)) * 100}%`
                      : '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #064c72, #22d3ee)',
                    borderRadius: '3px',
                    transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)'
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#39ff88', whiteSpace: 'nowrap' }}>
                  {levelInfo.target ? `${shells}/${levelInfo.target} 🐚` : `${shells} 🐚`}
                </span>
              </div>
            </div>
          )}

          {/* ── BOTTOM CONTROL BAR ────────────────────────────── */}
          <div className="streamBottomControlBar">
            <button className="playerBarBtn" onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            {/* Mobile-only snapshot and share buttons */}
            <button className="playerBarBtn mobileOnlyBtn" onClick={() => alert('Snapshot saved!')} aria-label="Snapshot">
              <Camera size={18} />
            </button>

            <button className="playerBarBtn mobileOnlyBtn" onClick={() => alert('Link copied!')} aria-label="Share">
              <Share2 size={18} />
            </button>

            <button className="playerBarBtn desktopOnlyBtn" onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className="playerBarLiveStatus desktopOnlyBtn">
              <span className="liveStatusDot" style={{
                backgroundColor: feedType === 'youtube' ? '#39ff88' : '#22d3ee',
                boxShadow: feedType === 'youtube' ? '0 0 8px #39ff88' : '0 0 8px #22d3ee'
              }} />
              <span>LIVE</span>
            </div>

            <div className="playerProgressBarContainer desktopOnlyBtn">
              <div className="playerProgressBarFill" />
            </div>

            <span className="greenHdBadge desktopOnlyBtn">HD</span>

            {/* Feed selector */}
            <select
              value={feedType}
              onChange={e => setFeedType(e.target.value)}
              className="desktopOnlyBtn"
              style={{
                background: 'rgba(6,32,49,0.9)',
                border: '1.5px solid rgba(34,211,238,0.45)',
                borderRadius: '16px', color: '#fff',
                fontSize: '0.75rem', fontWeight: '800',
                padding: '4px 10px', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', outline: 'none',
                boxShadow: '0 0 10px rgba(34,211,238,0.15)', marginRight: '4px'
              }}
            >
              <option value="recorded">🎮 Game Loop (AI Active)</option>
              <option value="youtube">📺 Live (YouTube)</option>
            </select>

            <button className="autoDropdownBtn desktopOnlyBtn">Auto <span className="dropdownArrow">▼</span></button>

            <button className="playerBarBtn desktopOnlyBtn" onClick={() => alert('Picture in Picture activated!')} aria-label="PiP">
              <Tv size={18} />
            </button>

            <div className="settingsDropdownContainer desktopOnlyBtn">
              <button className="playerBarBtn" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
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

      {/* Mobile-only feed switcher */}
      <div className="mobileFeedSwitcher">
        <button 
          className={feedType === 'youtube' ? 'active' : ''} 
          onClick={() => setFeedType('youtube')}
        >
          📺 Live Reef Cam
        </button>
        <button 
          className={feedType === 'recorded' ? 'active' : ''} 
          onClick={() => setFeedType('recorded')}
        >
          🎮 Game Loop
        </button>
      </div>

      {/* Mobile-only info banner under the video */}
      <div className="mobileInfoBanner">
        <span className="hudSignalDot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#39ff88', boxShadow: '0 0 8px #39ff88', marginRight: '6px' }} />
        <span>📍 Boynton Beach, FL &nbsp;|&nbsp; {liveDate} &nbsp;|&nbsp; {liveTime} ET</span>
      </div>

      <style>{`
        @keyframes floatUpFade {
          0%   { transform: translate(-50%, -50%) translateY(0);    opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-70px); opacity: 0; }
        }
        @keyframes blinkGlow {
          0%   { opacity: 0.4; box-shadow: 0 0 2px #39ff88; }
          50%  { opacity: 1;   box-shadow: 0 0 8px #39ff88; }
          100% { opacity: 0.4; box-shadow: 0 0 2px #39ff88; }
        }
        @keyframes slideDownAlert {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
        }
        @keyframes bounceUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
