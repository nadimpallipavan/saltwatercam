import { Play } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';

export default function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="heroOverlay" />
      
      <div className="heroContent">
        {/* Top badge */}
        <p className="eyebrow liveBadgeContainer">
          <span className="liveIndicatorDot" />
          {siteContent.locationBadge}
        </p>

        {/* Custom split heading */}
        <h1>
          WATCH LIVE.<br />
          <span className="aquaText">PLAY & EXPLORE!</span>
        </h1>

        {/* Subtitle */}
        <p className="heroText">
          Watch underwater animals in real-time, identify passing species, clean up plastic trash, and earn shells to redeem cool explorer rewards!
        </p>

        {/* Action buttons from mockup */}
        <div className="heroActions">
          <button className="primaryBtn watchLiveBtn" onClick={() => setPage('watch')}>
            <Play size={18} fill="currentColor" /> 🎮 WATCH & PLAY LIVE
          </button>
          
          <button className="secondaryBtn exploreBtn" onClick={() => setPage('kids-club')}>
            🏆 EXPLORE MISSIONS
          </button>
        </div>
      </div>
    </section>
  );
}
