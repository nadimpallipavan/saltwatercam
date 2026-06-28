import { useEffect, useRef } from 'react';
import { siteContent } from '../data/siteContent.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

const SPECIES_EMOJI = {
  snook: '🐟',
  tarpon: '🐡',
  turtle: '🐢',
  grouper: '🐠',
  stingray: '🌊',
};

const STATUS_COLOR = {
  'Protected game fish in Florida': '#ffa827',
  'Catch and release only': '#22d3ee',
  'Endangered': '#ef4444',
  'Critically protected': '#f97316',
  'Stable population': '#39ff88',
};

export default function MarineFeatureGrid({ setPage }) {
  const revealRef = useScrollReveal();
  const species = siteContent.species;

  return (
    <section className="marineSection" ref={revealRef} aria-labelledby="marine-heading">
      <div className="marineSectionInner">
        {/* Header */}
        <div className="sectionHeaderCentered">
          <p className="eyebrowCentered">🦈 Marine Life</p>
          <h2 id="marine-heading">Meet the Reef Residents</h2>
          <p className="subtitleCentered">
            From Silver Kings to gentle giants — these species swim past our dock daily.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="marineBentoGrid">
          {species.map((sp, i) => {
            const isHero = i === 0 || i === 1; // Snook + Tarpon get large cards
            return (
              <div
                key={sp.id}
                className={`marineCard glowCard ${isHero ? 'marineCardHero' : ''}`}
                onClick={() => setPage('marine-guide')}
                role="button"
                tabIndex={0}
                aria-label={`Learn about ${sp.name}`}
                onKeyDown={(e) => e.key === 'Enter' && setPage('marine-guide')}
              >
                {/* Glow border element */}
                <div className="glowBorder" aria-hidden="true" />

                {/* Card content */}
                <div className="marineCardInner">
                  {/* Emoji icon */}
                  <div className="marineCardEmoji" aria-hidden="true">
                    {SPECIES_EMOJI[sp.id] || '🐠'}
                  </div>

                  <div className="marineCardBody">
                    <div className="marineCardHeader">
                      <div>
                        <h3 className="marineCardName">{sp.name}</h3>
                        <p className="marineCardScientific">{sp.scientific}</p>
                      </div>
                      {sp.count && (
                        <div className="marineCardCount">
                          <strong>{sp.count}</strong>
                          <span>spotted</span>
                        </div>
                      )}
                    </div>

                    <p className="marineCardFact">{isHero ? sp.fact : sp.funFact}</p>

                    <div className="marineCardMeta">
                      <span
                        className="marineStatusBadge"
                        style={{ color: STATUS_COLOR[sp.status] || '#b7cad6', borderColor: STATUS_COLOR[sp.status] || '#b7cad6' }}
                      >
                        {sp.status}
                      </span>
                      {sp.size && <span className="marineSize">📏 {sp.size}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button
            className="primaryBtn glowBtn"
            onClick={() => setPage('marine-guide')}
            aria-label="View Full Marine Guide"
          >
            🐠 View Full Marine Guide
          </button>
        </div>
      </div>
    </section>
  );
}
