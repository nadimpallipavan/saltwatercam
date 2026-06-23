import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { ArrowRight, ShieldAlert, Fish } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MarineLifePage() {
  const [activeSpecies, setActiveSpecies] = useState(null);
  const revealRef = useScrollReveal();

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><Fish size={18} /> Marine Directory</p>
        <h1>Local Marine Life Guide</h1>
        <p className="subtitle">Identify and learn about the fish and sea creatures spotted on our Boynton Beach Inlet camera.</p>
      </div>

      {/* Species Catalog Grid */}
      <section className="exploreSection">
        <h2 className="subHeading">Marine Species Catalog</h2>
        <p className="sectionDesc">Click on any card to view deep-dive biological details, diet, average sizes, and conservation status.</p>
        
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
    </div>
  );
}
