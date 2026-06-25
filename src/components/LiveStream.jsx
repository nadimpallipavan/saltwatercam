import { useState, useEffect, useRef } from 'react';
import { Maximize, Volume2, VolumeX, Settings, Share2, Play, Pause, Camera, Tv } from 'lucide-react';

// Helper to render high-quality realistic SVG sprites for fish and trash
function TargetSprite({ type, label }) {
  if (type === 'fish') {
    if (label === 'Common Snook') {
      return (
        <svg viewBox="0 0 120 50" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Snook: Sleek body, black lateral line */}
          <path d="M 10 25 C 25 15, 60 12, 95 22 C 105 20, 115 12, 118 25 C 115 38, 105 30, 95 28 C 60 38, 25 35, 10 25 Z" fill="url(#snookGrad)" />
          {/* Tail Fin */}
          <path d="M 95 25 L 110 12 L 106 25 L 110 38 Z" fill="#718096" opacity="0.8" />
          {/* Gills & Head */}
          <path d="M 28 17 C 29 25, 29 30, 27 33" stroke="#2d3748" strokeWidth="1" fill="none" />
          <circle cx="18" cy="22" r="2.5" fill="#fef08a" />
          <circle cx="18.5" cy="22" r="1" fill="#000" />
          {/* Distinct Black Lateral Line */}
          <path d="M 28 25 C 50 23, 75 24, 95 26" stroke="#1a202c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Fins */}
          <path d="M 50 14 L 58 8 L 62 14 Z" fill="#718096" opacity="0.8" /> {/* Dorsal */}
          <path d="M 75 14 L 85 10 L 88 15 Z" fill="#718096" opacity="0.8" /> {/* 2nd Dorsal */}
          <path d="M 42 32 L 48 38 L 46 32 Z" fill="#718096" opacity="0.8" /> {/* Pectoral */}
          <path d="M 65 31 L 71 36 L 68 31 Z" fill="#718096" opacity="0.8" /> {/* Pelvic */}
          
          <defs>
            <linearGradient id="snookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="30%" stopColor="#cbd5e0" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#a0aec0" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Atlantic Tarpon') {
      return (
        <svg viewBox="0 0 130 50" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Tarpon: Shiny silver large scales, upturned mouth */}
          <path d="M 8 28 C 18 20, 50 10, 100 20 C 110 18, 120 12, 125 25 C 120 38, 110 32, 100 30 C 50 40, 18 36, 8 28 Z" fill="url(#tarponGrad)" />
          {/* Large upturned jaw */}
          <path d="M 8 28 C 12 28, 16 31, 14 33 C 12 33, 9 30, 8 28" fill="#4a5568" />
          <circle cx="16" cy="24" r="3" fill="#cbd5e0" />
          <circle cx="16.5" cy="24" r="1.2" fill="#000" />
          {/* Large Tail Fin */}
          <path d="M 100 25 L 122 10 L 115 25 L 122 40 Z" fill="#4a5568" opacity="0.9" />
          {/* Long dorsal filament */}
          <path d="M 68 15 C 65 5, 75 2, 85 8 L 74 15 Z" fill="#2d3748" />
          {/* Pelvic fin */}
          <path d="M 52 35 L 58 42 L 56 35 Z" fill="#4a5568" opacity="0.8" />
          
          <defs>
            <linearGradient id="tarponGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#718096" />
              <stop offset="40%" stopColor="#edf2f7" />
              <stop offset="80%" stopColor="#cbd5e0" />
              <stop offset="100%" stopColor="#718096" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Goliath Grouper') {
      return (
        <svg viewBox="0 0 110 60" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Grouper: Heavy mottled body, rounded tail */}
          <path d="M 8 30 C 20 12, 70 12, 90 28 C 96 26, 100 25, 104 30 C 100 35, 96 34, 90 32 C 70 48, 20 48, 8 30 Z" fill="url(#grouperGrad)" />
          {/* Rounded Tail Fin */}
          <path d="M 90 30 C 100 20, 106 30, 106 30 C 106 30, 100 40, 90 30" fill="#2d3748" />
          <circle cx="18" cy="27" r="2.8" fill="#e2e8f0" />
          <circle cx="18.5" cy="27" r="1.2" fill="#000" />
          {/* Mottled dark spots */}
          <circle cx="35" cy="25" r="1.5" fill="#1a202c" opacity="0.7" />
          <circle cx="45" cy="20" r="2" fill="#1a202c" opacity="0.7" />
          <circle cx="55" cy="28" r="1.8" fill="#1a202c" opacity="0.7" />
          <circle cx="65" cy="22" r="2.2" fill="#1a202c" opacity="0.7" />
          <circle cx="40" cy="35" r="2.5" fill="#1a202c" opacity="0.7" />
          <circle cx="50" cy="38" r="1.5" fill="#1a202c" opacity="0.7" />
          <circle cx="62" cy="36" r="2" fill="#1a202c" opacity="0.7" />
          <circle cx="75" cy="30" r="2.4" fill="#1a202c" opacity="0.7" />
          {/* Heavy fins */}
          <path d="M 45 16 C 55 10, 75 10, 80 18 Z" fill="#2d3748" />
          <path d="M 38 38 C 42 46, 48 46, 44 38 Z" fill="#2d3748" />
          
          <defs>
            <linearGradient id="grouperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a202c" />
              <stop offset="45%" stopColor="#718096" />
              <stop offset="90%" stopColor="#4a5568" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Green Sea Turtle') {
      return (
        <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Turtle: Oval shell, flippers, head */}
          <path d="M 70 20 L 85 10 L 78 25 Z" fill="#2f3e22" />
          <path d="M 70 60 L 85 70 L 78 55 Z" fill="#2f3e22" />
          <ellipse cx="50" cy="40" rx="28" ry="22" fill="url(#turtleShellGrad)" stroke="#1c2813" strokeWidth="1.5" />
          <ellipse cx="50" cy="40" rx="20" ry="14" fill="none" stroke="#1c2813" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 22 40 L 78 40 M 50 18 L 50 62" stroke="#1c2813" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 38 24 C 28 8, 12 10, 8 18 C 12 25, 28 28, 38 24 Z" fill="#3f512b" stroke="#1c2813" strokeWidth="0.5" />
          <path d="M 38 56 C 28 72, 12 70, 8 62 C 12 55, 28 52, 38 56 Z" fill="#3f512b" stroke="#1c2813" strokeWidth="0.5" />
          <path d="M 22 40 C 15 35, 8 36, 6 40 C 8 44, 15 45, 22 40 Z" fill="#3f512b" />
          <circle cx="10" cy="38" r="1.2" fill="#fff" />
          <circle cx="10" cy="38" r="0.6" fill="#000" />
          
          <defs>
            <linearGradient id="turtleShellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#556b2f" />
              <stop offset="50%" stopColor="#6b8e23" />
              <stop offset="100%" stopColor="#2e8b57" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Reef Shark') {
      return (
        <svg viewBox="0 0 130 50" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Shark: Sleek grey body, sharp dorsal fin */}
          <path d="M 6 25 C 20 14, 55 10, 95 21 C 105 19, 115 15, 124 25 C 115 35, 105 31, 95 29 C 55 40, 20 36, 6 25 Z" fill="url(#sharkGrad)" />
          <path d="M 44 14 C 48 2, 58 4, 62 14 Z" fill="#4a5568" />
          <path d="M 38 31 C 36 43, 44 48, 48 31 Z" fill="#4a5568" />
          <path d="M 98 25 L 122 8 L 114 25 L 120 42 L 105 29 Z" fill="#2d3748" />
          <circle cx="15" cy="22" r="1.5" fill="#000" />
          <path d="M 23 20 L 23 28 M 26 21 L 26 27 M 29 22 L 29 26" stroke="#2d3748" strokeWidth="1" />
          
          <defs>
            <linearGradient id="sharkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d3748" />
              <stop offset="50%" stopColor="#718096" />
              <stop offset="100%" stopColor="#4a5568" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Yellow Tang') {
      return (
        <svg viewBox="0 0 80 60" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          {/* Yellow Tang: Oval bright yellow body */}
          <path d="M 6 30 C 12 10, 48 5, 60 22 C 68 25, 74 20, 76 30 C 74 40, 68 35, 60 38 C 48 55, 12 50, 6 30 Z" fill="url(#yellowTangGrad)" />
          <path d="M 60 30 L 72 18 L 68 30 L 72 42 Z" fill="#eab308" />
          <circle cx="16" cy="24" r="3.2" fill="#fff" />
          <circle cx="16.5" cy="24" r="1.5" fill="#000" />
          <path d="M 52 29 L 58 30 L 52 31 Z" fill="#fff" />
          <path d="M 25 11 C 38 6, 52 10, 56 18 Z" fill="#eab308" />
          <path d="M 25 49 C 38 54, 52 50, 56 42 Z" fill="#eab308" />
          
          <defs>
            <linearGradient id="yellowTangGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
  } else {
    // Trash types
    if (label === 'Plastic Bottle') {
      return (
        <svg viewBox="0 0 50 100" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
          <path d="M 20 8 L 30 8 L 30 18 L 38 25 L 38 88 L 12 88 L 12 25 L 20 18 Z" fill="rgba(147, 197, 253, 0.45)" stroke="#60a5fa" strokeWidth="1.5" />
          <rect x="18" y="2" width="14" height="6" rx="1" fill="#2563eb" />
          <line x1="16" y1="36" x2="34" y2="36" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          <line x1="16" y1="44" x2="34" y2="44" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          <rect x="12" y="52" width="26" height="15" fill="rgba(59, 130, 246, 0.3)" />
          <path d="M 18 78 Q 25 74, 32 78" stroke="#60a5fa" strokeWidth="1" fill="none" />
        </svg>
      );
    }
    if (label === 'Plastic Bag') {
      return (
        <svg viewBox="0 0 80 90" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.75, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
          <path d="M 22 28 C 16 12, 28 8, 30 25 C 38 8, 50 12, 46 28 C 58 32, 62 76, 45 84 C 30 86, 12 82, 10 68 C 8 46, 14 32, 22 28 Z" fill="rgba(241, 245, 249, 0.4)" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 24 38 Q 38 48, 44 34 M 18 52 Q 32 58, 48 50 M 26 72 Q 40 68, 54 74" stroke="#e2e8f0" strokeWidth="1" fill="none" />
        </svg>
      );
    }
    if (label === 'Plastic Cup') {
      return (
        <svg viewBox="0 0 60 90" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
          <path d="M 12 12 L 48 12 L 40 82 L 20 82 Z" fill="rgba(226, 232, 240, 0.45)" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="30" cy="12" rx="18" ry="4" fill="rgba(255,255,255,0.2)" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 16 48 L 44 48 L 40 82 L 20 82 Z" fill="rgba(147, 197, 253, 0.2)" />
        </svg>
      );
    }
    if (label === 'Aluminum Can') {
      return (
        <svg viewBox="0 0 60 85" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.85, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
          <path d="M 15 15 L 45 15 C 48 24, 42 28, 45 42 C 40 50, 48 55, 45 74 L 15 74 C 12 60, 18 55, 15 42 C 18 28, 12 24, 15 15 Z" fill="url(#canGrad)" stroke="#ef4444" strokeWidth="1.5" />
          <ellipse cx="30" cy="15" rx="15" ry="3" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="1" />
          <rect x="28" y="10" width="4" height="6" rx="1" fill="#718096" />
          <path d="M 15 32 Q 30 25, 43 30 M 13 54 Q 28 60, 45 48" stroke="#b91c1c" strokeWidth="1.5" fill="none" />
          
          <defs>
            <linearGradient id="canGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    if (label === 'Rubber Balloon') {
      return (
        <svg viewBox="0 0 60 100" style={{ width: '100%', height: '100%', overflow: 'visible', opacity: 0.85, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
          <ellipse cx="30" cy="35" rx="18" ry="24" fill="url(#balloonGrad)" />
          <path d="M 28 59 L 32 59 L 30 65 Z" fill="#b91c1c" />
          <path d="M 30 65 Q 26 78, 34 85 Q 28 92, 30 98" stroke="#e2e8f0" strokeWidth="1" fill="none" />
          <ellipse cx="22" cy="25" rx="4" ry="7" transform="rotate(-15 22 25)" fill="rgba(255,255,255,0.45)" />
          
          <defs>
            <linearGradient id="balloonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
  }
  
  return (
    <svg viewBox="0 0 80 50" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="40" cy="25" rx="30" ry="15" fill="rgba(34, 211, 238, 0.4)" stroke="#22d3ee" strokeWidth="1.5" />
    </svg>
  );
}

export default function LiveStream({ aiEnabled = false, addShells, shells, currentUser }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);
  const [fishCounter, setFishCounter] = useState(0);
  const [trashCleanedCount, setTrashCleanedCount] = useState(0);
  const [cleanupAlert, setCleanupAlert] = useState(null);

  // Simulated AI targets tracking (detections)
  const [detections, setDetections] = useState([
    { id: 'f1', type: 'fish', label: 'Common Snook', confidence: 98, x: 25, y: 40, w: 14, h: 10, visible: true },
    { id: 'f2', type: 'fish', label: 'Atlantic Tarpon', confidence: 97, x: 60, y: 25, w: 18, h: 12, visible: false },
    { id: 'f3', type: 'fish', label: 'Goliath Grouper', confidence: 96, x: 45, y: 65, w: 16, h: 14, visible: true },
    { id: 'f4', type: 'fish', label: 'Green Sea Turtle', confidence: 99, x: 75, y: 48, w: 13, h: 11, visible: false },
    { id: 'f5', type: 'fish', label: 'Reef Shark', confidence: 96, x: 15, y: 55, w: 18, h: 11, visible: false },
    { id: 'f6', type: 'fish', label: 'Yellow Tang', confidence: 98, x: 55, y: 35, w: 10, h: 8, visible: true },
    
    { id: 't1', type: 'trash', label: 'Plastic Bottle', emoji: '🍾', fact: 'Plastic bottles can take 450 years to break down in the ocean!', confidence: 89, x: 30, y: 45, w: 10, h: 8, visible: false },
    { id: 't2', type: 'trash', label: 'Plastic Bag', emoji: '🛍️', fact: 'Sea turtles often mistake plastic bags for tasty jellyfish!', confidence: 91, x: 70, y: 35, w: 12, h: 10, visible: true },
    { id: 't3', type: 'trash', label: 'Plastic Cup', emoji: '🥤', fact: 'Over 8 million tons of plastic trash enter our oceans every year!', confidence: 88, x: 50, y: 58, w: 10, h: 8, visible: false },
    { id: 't4', type: 'trash', label: 'Aluminum Can', emoji: '🥫', fact: 'Recycling aluminum cans saves 95% of the energy needed to make new ones!', confidence: 92, x: 20, y: 70, w: 11, h: 9, visible: false },
    { id: 't5', type: 'trash', label: 'Rubber Balloon', emoji: '🎈', fact: 'Balloons can float for miles and end up blocking animals\' stomachs.', confidence: 87, x: 80, y: 62, w: 10, h: 9, visible: true }
  ]);

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

  // Update detections animation and movement
  useEffect(() => {
    if (!isPlaying || !aiEnabled) return;

    const interval = setInterval(() => {
      setDetections(prev => prev.map(d => {
        const randomAction = Math.random();
        let nextVisible = d.visible;
        let nextX = d.x;
        let nextY = d.y;
        let nextConf = d.confidence;

        // Randomly toggle visibility
        if (randomAction > 0.72) {
          nextVisible = !d.visible;
        }

        if (nextVisible) {
          if (d.type === 'trash') {
            // Trash drifts from left to right
            let xVal = d.x + 2.5;
            if (xVal > 95) {
              xVal = 5 + Math.random() * 10;
              nextVisible = false; // Hide on wrap around
            }
            nextX = xVal;
            nextY = Math.max(20, Math.min(80, d.y + (Math.random() > 0.5 ? 1 : -1)));
          } else {
            // Fish swim around inside container bounds
            const xVal = d.x + (Math.random() > 0.5 ? 3 : -3);
            const yVal = d.y + (Math.random() > 0.5 ? 2 : -2);
            nextX = Math.max(10, Math.min(85, xVal));
            nextY = Math.max(20, Math.min(75, yVal));
          }
          nextConf = Math.min(99, Math.max(85, d.confidence + (Math.random() > 0.5 ? 1 : -1)));
        } else {
          // Reset positions occasionally when off-screen
          if (d.type === 'trash' && Math.random() > 0.8) {
            nextX = 5 + Math.random() * 15;
            nextY = 20 + Math.random() * 60;
          } else if (Math.random() > 0.8) {
            nextX = 15 + Math.random() * 70;
            nextY = 20 + Math.random() * 55;
          }
        }

        return { ...d, visible: nextVisible, x: nextX, y: nextY, confidence: nextConf };
      }));
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, aiEnabled]);

  // Click on a target (fish or trash)
  const handleTargetTap = (d, e) => {
    e.stopPropagation(); // Stop click from propagating to the background seawater handler
    if (!isPlaying || !aiEnabled) return;

    if (d.type === 'fish') {
      if (addShells) {
        addShells(1);
      }
      const nextFishCount = fishCounter + 1;
      setFishCounter(nextFishCount);
      triggerFloaty(d.x, d.y, `🐟 Fish Sighted! +1 🐚`);

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
    } else if (d.type === 'trash') {
      if (addShells) {
        addShells(10);
      }
      setTrashCleanedCount(prev => prev + 1);
      triggerFloaty(d.x, d.y, `🧼 Cleaned: ${d.label}! +10 🐚`);

      setCleanupAlert({
        emoji: "🧼",
        label: d.label,
        fact: d.fact
      });
    }
  };

  // Click on empty seawater (background click)
  const handleSeawaterTap = (e) => {
    if (!isPlaying || !aiEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    triggerFloaty(clickX, clickY, `💧 Seawater! +0 🐚`);
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

          {/* Transparent click catcher overlay for Seawater taps */}
          {isPlaying && aiEnabled && (
            <div 
              ref={containerRef}
              onClick={handleSeawaterTap}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 8,
                cursor: 'pointer'
              }}
              title="Click directly on passing fish or trash to log them and clean up the ocean!"
            />
          )}

          {/* Clickable Realistic Fish & Trash Overlays (No borders, no names, borderless) */}
          {isPlaying && aiEnabled && detections.filter(d => d.visible).map(d => (
            <div
              key={d.id}
              onClick={(e) => handleTargetTap(d, e)}
              style={{
                position: 'absolute',
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.w}%`,
                height: `${d.h}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 9,
                animation: d.type === 'fish' 
                  ? 'swimOscillate 2.5s infinite alternate ease-in-out' 
                  : 'trashSway 3.5s infinite alternate ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                opacity: 0.78
              }}
            >
              <TargetSprite type={d.type} label={d.label} />
            </div>
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

          {/* Top Info Overlay */}
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
              <span>Watch live feed: Click fish (+1 🐚) & clean trash (+10 🐚) directly to Level Up!</span>
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

          {/* Cleaned Trash educational banner */}
          {cleanupAlert && (
            <div style={{
              position: 'absolute',
              top: '135px',
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
              <span className="liveStatusDot" style={{ backgroundColor: '#39ff88', boxShadow: '0 0 8px #39ff88' }} />
              <span>LIVE</span>
            </div>

            {/* Center Seek/Progress Line */}
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
        @keyframes trashSway {
          0% { transform: rotate(-15deg) translateY(-2px); }
          100% { transform: rotate(15deg) translateY(2px); }
        }
        @keyframes pulseCleanBorder {
          0% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
          50% { border-color: rgba(16, 185, 129, 1); box-shadow: 0 0 25px rgba(16, 185, 129, 0.55); }
          100% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        }
      `}</style>
    </section>
  );
}
