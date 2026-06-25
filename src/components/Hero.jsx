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

        <p className="heroText">
          Spot real sea creatures, earn shells &amp; become an Ocean Explorer!
        </p>

        {/* Action buttons from mockup */}
        <div className="heroActions">
          <button className="primaryBtn watchLiveBtn" onClick={() => setPage('watch')}>
            <Play size={18} fill="currentColor" /> Play Live
          </button>
          
          <button className="secondaryBtn exploreBtn" onClick={() => setPage('kids-club')}>
            🏆 EXPLORE MISSIONS
          </button>
        </div>
      </div>
    </section>
  );
}
