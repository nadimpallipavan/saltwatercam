import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

export default function LiveStream({ aiEnabled = false }) {
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
    </section>
  );
}
