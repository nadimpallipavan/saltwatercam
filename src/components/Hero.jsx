import { Play } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import ShaderHero from './ShaderHero.jsx';

const HEADLINE_WORDS_L1 = ['WATCH', 'LIVE.'];
const HEADLINE_WORDS_L2 = ['PLAY', '&', 'EXPLORE!'];

export default function Hero({ setPage }) {
  return (
    <section className="hero heroV2" aria-label="Hero">
      {/* WebGL caustic shader background */}
      <ShaderHero />

      {/* Particle canvas overlay (existing global one handles this) */}

      {/* Dark-to-transparent gradient at bottom to blend into page */}
      <div className="heroGradientBottom" aria-hidden="true" />

      <div className="heroContent heroContentV2">
        {/* Live badge */}
        <div className="liveBadgeV2" aria-label="Live from Boynton Beach Inlet, FL">
          <span className="liveDotRing" aria-hidden="true" />
          <span className="liveDot" aria-hidden="true" />
          <span className="liveBadgeText">{siteContent.locationBadge}</span>
        </div>

        {/* Animated headline — word by word */}
        <h1 className="heroHeadlineV2" aria-label="Watch Live. Play & Explore!">
          <span className="heroLine1">
            {HEADLINE_WORDS_L1.map((word, i) => (
              <span key={word} className="heroWord" style={{ animationDelay: `${i * 0.12}s` }}>
                {word}
              </span>
            ))}
          </span>
          <span className="heroLine2 aquaText">
            {HEADLINE_WORDS_L2.map((word, i) => (
              <span key={i} className="heroWord" style={{ animationDelay: `${(i + HEADLINE_WORDS_L1.length) * 0.12 + 0.1}s` }}>
                {word}
              </span>
            ))}
          </span>
        </h1>

        <p className="heroSubV2 heroWord" style={{ animationDelay: '0.72s' }}>
          Spot real sea creatures, earn shells &amp; become an Ocean Explorer!
        </p>

        {/* CTA buttons */}
        <div className="heroActionsV2" style={{ animationDelay: '0.88s' }}>
          <button
            className="primaryBtn watchLiveBtnV2 glowBtn"
            onClick={() => setPage('watch')}
            aria-label="Play Live Stream"
          >
            <Play size={18} fill="currentColor" />
            Play Live
          </button>

          <button
            className="secondaryBtn exploreBtnV2"
            onClick={() => setPage('kids-club')}
            aria-label="Explore Kids Club Missions"
          >
            🏆 EXPLORE MISSIONS
          </button>
        </div>

        {/* Quick stat teasers */}
        <div className="heroStatRow heroWord" style={{ animationDelay: '1.05s' }}>
          {[
            { val: '24/7', label: 'Live Stream' },
            { val: '5+', label: 'Species Daily' },
            { val: 'Free', label: 'No signup needed' },
          ].map(s => (
            <div key={s.label} className="heroStat">
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scrollIndicator" aria-hidden="true">
        <span className="scrollDot" />
        <span className="scrollLine" />
      </div>
    </section>
  );
}
