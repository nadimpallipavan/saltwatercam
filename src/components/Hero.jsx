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
          DIVE INTO WONDER.<br />
          <span className="aquaText">LIVE</span> THE OCEAN.
        </h1>

        {/* Subtitle */}
        <p className="heroText">{siteContent.description}</p>

        {/* Action buttons from mockup */}
        <div className="heroActions">
          <button className="primaryBtn watchLiveBtn" onClick={() => setPage('watch')}>
            <Play size={18} fill="currentColor" /> WATCH LIVE NOW
          </button>
          
          <button className="secondaryBtn exploreBtn" onClick={() => setPage('marine-guide')}>
            EXPLORE OCEAN
          </button>
        </div>
      </div>
    </section>
  );
}
