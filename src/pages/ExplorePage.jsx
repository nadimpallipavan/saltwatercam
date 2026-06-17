import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { MapPin, Info, ArrowRight, ShieldAlert } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ExplorePage() {
  const [activeSpecies, setActiveSpecies] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [clickedPoint, setClickedPoint] = useState(null);
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

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><MapPin size={18} /> Exploration Hub</p>
        <h1>Explore Lantana & Marine Life</h1>
        <p className="subtitle">Learn about our local ecosystem in Lantana, Florida, and discover the species seen on camera.</p>
      </div>

      {/* Species Catalog Grid */}
      <section className="exploreSection">
        <h2 className="subHeading">Marine Life Directory</h2>
        <p className="sectionDesc">Click on any card to view deep-dive biological details, conservation status, and fun facts.</p>
        
        <div className="speciesGrid">
          {siteContent.species.map((s, index) => {
            const delayClass = `delay-${(index % 3) + 1}`;
            return (
              <TiltCard 
                key={s.id} 
                revealRef={revealRef}
                className={`speciesCard ${delayClass} ${activeSpecies === s.id ? 'active' : ''}`}
                onClick={() => setActiveSpecies(activeSpecies === s.id ? null : s.id)}
              >
                <div className="cardHeader">
                  <span className="countBadge">{s.count} Sightings</span>
                  <h3>{s.name}</h3>
                  <span className="scientificName"><i>{s.scientific}</i></span>
                </div>
                <p className="cardFact">{s.fact}</p>
                
                {activeSpecies === s.id && (
                  <div className="extendedInfo">
                    <div className="statRow">
                      <strong>Average Size:</strong> <span>{s.size}</span>
                    </div>
                    <div className="statRow">
                      <strong>Primary Diet:</strong> <span>{s.diet}</span>
                    </div>
                    <div className="statRow">
                      <strong>Fun Fact:</strong> <span>{s.funFact}</span>
                    </div>
                    <div className="statusAlert">
                      <ShieldAlert size={16} />
                      <span><strong>Status:</strong> {s.status}</span>
                    </div>
                  </div>
                )}
                <button className="expandBtn">
                  {activeSpecies === s.id ? 'Show Less' : 'Deep Dive Facts'} <ArrowRight size={14} />
                </button>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="exploreSection mapSection" ref={revealRef}>
        <h2 className="subHeading">Interactive Ecosystem Map</h2>
        <p className="sectionDesc">Hover or click on the glowing markers to discover key geographical features near Boynton Beach Inlet.</p>

        <div className="mapContainer">
          <div className="simulatedMap">
            {/* Water and Land SVG representation */}
            <svg viewBox="0 0 800 500" className="mapSvg">
              {/* Land left */}
              <path d="M 0 0 L 300 0 L 320 220 L 280 320 L 290 500 L 0 500 Z" fill="rgba(6, 40, 58, 0.6)" stroke="#064C72" strokeWidth="2" />
              {/* Land right (barrier island) */}
              <path d="M 500 0 L 800 0 L 800 500 L 520 500 L 510 380 L 530 250 L 490 0 Z" fill="rgba(6, 40, 58, 0.6)" stroke="#064C72" strokeWidth="2" />
              {/* Intracoastal Lagoon (center water) */}
              <text x="180" y="80" className="mapText waterLabel">Intracoastal Waterway</text>
              <text x="640" y="80" className="mapText waterLabel">Atlantic Ocean</text>
              <text x="420" y="240" className="mapText inletLabel">Boynton Inlet</text>
              {/* Bridge */}
              <line x1="300" y1="230" x2="520" y2="240" stroke="#B7CAD6" strokeWidth="8" strokeDasharray="4 2" />
              <text x="350" y="215" className="mapText bridgeLabel">A1A Bridge</text>
              {/* Ocean connection channel */}
              <path d="M 300 220 C 400 230, 420 250, 510 240" stroke="#22D3EE" strokeWidth="16" fill="none" opacity="0.3" />
            </svg>

            {/* Glowing Map Pins */}
            {pointsOfInterest.map((p) => (
              <button
                key={p.id}
                className="mapPin"
                style={{ left: p.x, top: p.y }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setClickedPoint(clickedPoint === p.id ? null : p.id)}
                aria-label={`View info for ${p.name}`}
              >
                <span className="pingGlow" />
                <span className="pinDot" />
              </button>
            ))}

            {/* Map Info Box */}
            {(hoveredPoint || (clickedPoint && pointsOfInterest.find(p => p.id === clickedPoint))) && (
              <div className="mapInfoBox">
                <h4 className="infoBoxTitle">
                  <MapPin size={16} className="text-aqua" />
                  {(hoveredPoint || pointsOfInterest.find(p => p.id === clickedPoint)).name}
                </h4>
                <p>{(hoveredPoint || pointsOfInterest.find(p => p.id === clickedPoint)).desc}</p>
                <span className="infoBoxTip">Click map to close</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
