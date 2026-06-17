import { siteContent } from '../data/siteContent.js';
import { BookOpen, ShieldCheck, Waves, HelpCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function EducationPage({ setPage }) {
  const revealRef = useScrollReveal();

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><BookOpen size={18} /> Education & Impact</p>
        <h1>Protect & Learn About Our Ocean</h1>
        <p className="subtitle">Discover how green lights work, how tides affect local channels, and how we can preserve marine environments.</p>
      </div>

      <div className="eduGrid">
        {/* Card 1: Green Light science */}
        <TiltCard className="eduCard" revealRef={revealRef}>
          <div className="eduIcon"><Waves size={24} /></div>
          <h3>How the Green Fish Light Works</h3>
          <p>
            Coastal water contains particles like phytoplankton, algae, and suspended sand. 
            Green light has a specific wavelength (~520-560 nm) that penetrates this turbid water more efficiently 
            than other colors, creating a wide ambient visibility dome.
          </p>
          <p>
            Plankton are naturally attracted to this glowing green area. Small baitfish (like pilchards and mullet) 
            arrive to eat the plankton, which in turn draws larger predators (like Snook, Tarpon, and Jack Crevalle) 
            to hunt, creating a lively nighttime marine community!
          </p>
        </TiltCard>

        {/* Card 2: Boynton Beach Inlet */}
        <TiltCard className="eduCard delay-1" revealRef={revealRef}>
          <div className="eduIcon"><Waves size={24} /></div>
          <h3>Boynton Beach Inlet Highway</h3>
          <p>
            Inlets act as the tidal gates of Florida's Intracoastal Waterway. Twice a day, rising tides push cold, clean, 
            nutrient-rich ocean water into the lagoon. When the tide falls, warmer, brackish lagoon water flows out.
          </p>
          <p>
            This constant exchange turns the dock area into a marine highway. Sharks, sea turtles, and game fish cruise 
            past our camera, riding these currents to forage and seek shelter.
          </p>
        </TiltCard>
      </div>

      {/* Conservation section */}
      <section className="conservationSection" ref={revealRef}>
        <div className="twoCol">
          <div>
            <p className="eyebrow"><ShieldCheck size={18} /> Conservation</p>
            <h2>Preserving Florida's Coastal Reefs</h2>
            <p>
              The waters surrounding Boynton Beach Inlet are home to rich coral reefs and critical seagrass beds. 
              These habitats serve as nurseries for more than 70% of Florida's marine species.
            </p>
            <p>
              By observing marine life without disturbing them, SaltWaterCam aims to inspire a love for the ocean in 
              the next generation, fostering environmental stewardship and supporting ocean conservation efforts.
            </p>
            <button className="primaryBtn" onClick={() => setPage('watch')}>Observe Live Stream</button>
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
    </div>
  );
}
