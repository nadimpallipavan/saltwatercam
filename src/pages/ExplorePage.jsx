import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { MapPin, Clock } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ExplorePage() {
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
        <h1>Explore Boynton Inlet Ecosystem</h1>
        <p className="subtitle">Discover our local geographical landscape in Lantana, Florida, and view real-time sightings.</p>
      </div>

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

      {/* Sightings Timeline Section */}
      <section className="exploreSection timelineSection" ref={revealRef} style={{ marginTop: '60px' }}>
        <h2 className="subHeading"><Clock size={20} className="text-aqua" style={{ display: 'inline', marginRight: '8px' }} /> Recent Camera Sightings</h2>
        <p className="sectionDesc">Real-time timeline of marine species spotted passing by the Lantana dock camera today.</p>
        
        <div className="dashboardTimeline" style={{ marginTop: '24px', paddingLeft: '30px' }}>
          {siteContent.timeline.map((item, idx) => (
            <div key={idx} className="timelineItem" style={{ marginBottom: '24px' }}>
              <span className="timelineTime" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#22d3ee', marginBottom: '4px' }}>{item.time}</span>
              <div className="timelineContent">
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{item.species}</h4>
                <p style={{ color: '#b7cad6', margin: '4px 0 0 0', fontSize: '0.95rem' }}>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
