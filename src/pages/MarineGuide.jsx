import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { MapPin, Info, ArrowRight, ShieldAlert, Filter } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MarineGuide() {
  const [activeSpecies, setActiveSpecies] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const revealRef = useScrollReveal();

  const pointsOfInterest = [
    {
      id: 'dock',
      name: 'SaltWaterCam Dock',
      x: '42%',
      y: '58%',
      desc: 'The live underwater camera location at the end of the residential dock, featuring the 1000W green fish light.'
    },
    {
      id: 'inlet',
      name: 'Boynton Beach Inlet',
      x: '62%',
      y: '78%',
      desc: 'Connects the Intracoastal Waterway directly to the Atlantic Ocean, creating high tidal currents and rich marine diversity.'
    },
    {
      id: 'keylime',
      name: 'Old Key Lime House',
      x: '38%',
      y: '45%',
      desc: "Florida's oldest waterfront restaurant, a historic local landmark dating back to 1889, located just north of the dock."
    },
    {
      id: 'beercan',
      name: 'Beer Can Island',
      x: '54%',
      y: '65%',
      desc: 'A popular local sandbar and bird sanctuary located inside the lagoon, surrounded by shallow seagrass beds.'
    }
  ];

  // Map species to V2 categories
  const speciesCategories = {
    snook: 'Predators',
    tarpon: 'Predators',
    turtle: 'Reptiles',
    grouper: 'Reef Dwellers',
    stingray: 'Reef Dwellers'
  };

  const categories = ['All', 'Predators', 'Reef Dwellers', 'Reptiles'];

  const filteredSpecies = siteContent.species.filter(s => {
    if (selectedCategory === 'All') return true;
    return speciesCategories[s.id] === selectedCategory;
  });

  return (
    <div className="pageContainer" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <MapPin size={14} /> Marine Guide
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          Boynton Inlet Ecosystem Guide
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Browse our localized fish guide and view the interactive map showing the exact paths species take through the Lantana Intracoastal waterway.
        </p>
      </div>

      {/* Interactive Map Section */}
      <section className="exploreSection mapSection" style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: '800', textAlign: 'left', margin: '0 0 6px 0' }}>
          Interactive Ecosystem Map
        </h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: '#b7cad6', textAlign: 'left' }}>
          Hover or click on the glowing markers to discover key geographical features near the Boynton Beach Inlet.
        </p>

        <div className="mapContainer">
          <div className="simulatedMap" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1.5px solid rgba(34, 211, 238, 0.2)' }}>
            {/* Water and Land SVG representation */}
            <svg viewBox="0 0 800 500" className="mapSvg" style={{ background: '#020b12', display: 'block', width: '100%', height: 'auto' }}>
              {/* Land left */}
              <path d="M 0 0 L 300 0 L 320 220 L 280 320 L 290 500 L 0 500 Z" fill="rgba(6, 40, 58, 0.45)" stroke="#064C72" strokeWidth="2" />
              {/* Land right (barrier island) */}
              <path d="M 500 0 L 800 0 L 800 500 L 520 500 L 510 380 L 530 250 L 490 0 Z" fill="rgba(6, 40, 58, 0.45)" stroke="#064C72" strokeWidth="2" />
              {/* Intracoastal Lagoon (center water) */}
              <text x="100" y="80" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" letterSpacing="0.05em">Intracoastal Waterway</text>
              <text x="620" y="80" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" letterSpacing="0.05em">Atlantic Ocean</text>
              <text x="410" y="275" fill="rgba(34, 211, 238, 0.75)" fontSize="13" fontWeight="bold" letterSpacing="0.1em">Boynton Inlet</text>
              {/* Bridge */}
              <line x1="300" y1="230" x2="520" y2="240" stroke="#b7cad6" strokeWidth="6" strokeDasharray="6 3" />
              <text x="360" y="215" fill="#fff" fontSize="10" fontWeight="bold" letterSpacing="0.05em">A1A Bridge</text>
              {/* Ocean connection channel */}
              <path d="M 300 220 C 400 230, 420 250, 510 240" stroke="#22D3EE" strokeWidth="16" fill="none" opacity="0.15" />
            </svg>

            {/* Glowing Map Pins */}
            {pointsOfInterest.map((p) => (
              <button
                key={p.id}
                className="mapPin"
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: '20px',
                  height: '20px',
                  transform: 'translate(-50%, -50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 5
                }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setClickedPoint(clickedPoint === p.id ? null : p.id)}
                aria-label={`View info for ${p.name}`}
              >
                <span className="pingGlow" style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0,
                  borderRadius: '50%',
                  background: 'rgba(34, 211, 238, 0.4)',
                  animation: 'pulse 1.8s infinite alternate'
                }} />
                <span className="pinDot" style={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  left: '5px',
                  top: '5px',
                  borderRadius: '50%',
                  background: '#22d3ee',
                  boxShadow: '0 0 8px #22d3ee'
                }} />
              </button>
            ))}

            {/* Map Info Box */}
            {(hoveredPoint || (clickedPoint && pointsOfInterest.find(p => p.id === clickedPoint))) && (
              <div className="mapInfoBox" style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '16px',
                background: 'rgba(3, 27, 46, 0.9)',
                border: '1.5px solid #22d3ee',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                textAlign: 'left',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                zIndex: 10
              }}>
                <h4 className="infoBoxTitle" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1rem', fontWeight: '800' }}>
                  <MapPin size={16} style={{ color: '#22d3ee' }} />
                  {(hoveredPoint || pointsOfInterest.find(p => p.id === clickedPoint)).name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  {(hoveredPoint || pointsOfInterest.find(p => p.id === clickedPoint)).desc}
                </p>
                <span className="infoBoxTip" style={{ display: 'block', fontSize: '0.7rem', color: '#b7cad6', marginTop: '8px', opacity: 0.6 }}>
                  Click another marker to switch views or click map to close.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Species Catalog Grid */}
      <section className="exploreSection">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid rgba(34, 211, 238, 0.15)', paddingBottom: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
              Marine Life Directory
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#b7cad6' }}>
              Filter by species group and select a card to explore facts, habits, and conservation details.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'rgba(255,255,255,0.05)',
                  border: '1.5px solid',
                  borderColor: selectedCategory === cat ? '#22d3ee' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Filtered Grid */}
        <div className="speciesGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredSpecies.map((s, index) => {
            const delayClass = `delay-${(index % 3) + 1}`;
            const isActive = activeSpecies === s.id;
            
            return (
              <TiltCard 
                key={s.id} 
                revealRef={revealRef}
                className={`speciesCard ${delayClass} ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSpecies(isActive ? null : s.id)}
                style={{
                  padding: '24px',
                  background: 'rgba(6, 32, 49, 0.45)',
                  border: isActive ? '1.5px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 10px 30px rgba(34, 211, 238, 0.15)' : 'none'
                }}
              >
                <div className="cardHeader" style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="countBadge" style={{ background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.25)', color: '#22d3ee', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
                      {s.count} Sightings
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {speciesCategories[s.id]}
                    </span>
                  </div>
                  <h3 style={{ margin: '6px 0 0 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '900', color: '#fff' }}>{s.name}</h3>
                  <span className="scientificName" style={{ fontSize: '0.8rem', color: '#b7cad6', fontStyle: 'italic' }}>{s.scientific}</span>
                </div>
                <p className="cardFact" style={{ fontSize: '0.88rem', color: '#b7cad6', lineHeight: '1.5', margin: '0 0 16px 0' }}>{s.fact}</p>
                
                {isActive && (
                  <div className="extendedInfo" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#b7cad6', animation: 'fadeIn 0.3s ease' }}>
                    <div className="statRow" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <strong style={{ color: '#fff' }}>Average Size:</strong> <span>{s.size}</span>
                    </div>
                    <div className="statRow" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <strong style={{ color: '#fff' }}>Primary Diet:</strong> <span>{s.diet}</span>
                    </div>
                    <div className="statRow" style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                      <strong style={{ color: '#fff' }}>Fun Fact:</strong> <span>{s.funFact}</span>
                    </div>
                    <div className="statusAlert" style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '8px 12px', borderRadius: '8px', color: '#f43f5e', marginTop: '6px' }}>
                      <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                      <span><strong>Status:</strong> {s.status}</span>
                    </div>
                  </div>
                )}
                
                <button 
                  className="expandBtn"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#22d3ee',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    marginTop: '16px',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  {isActive ? 'Show Less' : 'Deep Dive Facts'} <ArrowRight size={14} />
                </button>
              </TiltCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
