import { siteContent } from '../data/siteContent.js';
import { ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ConservationPage({ setPage }) {
  const revealRef = useScrollReveal();

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><ShieldCheck size={18} /> Ocean Conservation</p>
        <h1>Preserving Our Marine Habitat</h1>
        <p className="subtitle">Learn about our active local efforts to protect the coastal reefs and seagrass beds surrounding Lantana, Florida.</p>
      </div>

      <section className="conservationSection" ref={revealRef}>
        <div className="twoCol">
          <div>
            <h2>Protecting Boynton Inlet Ecosystem</h2>
            <p>
              The waters surrounding Boynton Beach Inlet are home to rich coral reefs and critical seagrass beds. 
              These habitats serve as nurseries for more than 70% of Florida's marine species.
            </p>
            <p>
              By observing marine life without disturbing them, SaltWaterCam aims to inspire a love for the ocean in 
              the next generation, fostering environmental stewardship and supporting ocean conservation efforts.
            </p>
            <button className="primaryBtn" style={{ marginTop: '20px' }} onClick={() => setPage('watch')}>Observe Live Stream</button>
          </div>
          <div className="conservationStats">
            <TiltCard className="metricBox" revealRef={revealRef}>
              <strong>92%</strong>
              <span>Local reef health score</span>
            </TiltCard>
            <TiltCard className="metricBox delay-1" revealRef={revealRef}>
              <strong>12,430 lbs</strong>
              <span>Plastic waste removed locally</span>
            </TiltCard>
            <TiltCard className="metricBox delay-2" revealRef={revealRef}>
              <strong>1,250</strong>
              <span>Corals planted under V3 plans</span>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Action Guide Card Section */}
      <section className="exploreSection" style={{ marginTop: '60px' }}>
        <h2 className="subHeading"><Heart size={20} className="text-aqua" style={{ display: 'inline', marginRight: '8px' }} /> What You Can Do</h2>
        <p className="sectionDesc">Take simple, impactful actions in your daily life to protect Florida's delicate marine waterways.</p>
        
        <div className="speciesGrid">
          <TiltCard className="speciesCard" revealRef={revealRef}>
            <div className="countBadge" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>Action 1</div>
            <h3>Reduce Plastic Usage</h3>
            <p className="cardFact">
              Single-use plastics frequently end up in our lagoons and reefs. Switch to reusable bags, bottles, and straws to prevent plastic pollution.
            </p>
          </TiltCard>

          <TiltCard className="speciesCard delay-1" revealRef={revealRef}>
            <div className="countBadge" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>Action 2</div>
            <h3>Responsible Fishing</h3>
            <p className="cardFact">
              Practice clean catch-and-release fishing. Always dispose of monofilament line in recycling bins to prevent entangling birds and turtles.
            </p>
          </TiltCard>

          <TiltCard className="speciesCard delay-2" revealRef={revealRef}>
            <div className="countBadge" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>Action 3</div>
            <h3>Support Coral Restorations</h3>
            <p className="cardFact">
              Support local reef organizations planting nursery-grown corals back onto the Boynton Beach barrier reef tract.
            </p>
          </TiltCard>
        </div>
      </section>
    </div>
  );
}
