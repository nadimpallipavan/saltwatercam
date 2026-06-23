import { siteContent } from '../data/siteContent.js';
import { BookOpen, Waves, HelpCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function EducationPage({ setPage }) {
  const revealRef = useScrollReveal();

  return (
    <div className="pageContainer">
      <div className="sectionHeader">
        <p className="eyebrow"><BookOpen size={18} /> Education & Ecosystems</p>
        <h1>Ecosystem Education Hub</h1>
        <p className="subtitle">Discover the science behind our green underwater lights and how tides affect marine migration.</p>
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

      {/* FAQs section moved here for educational reference */}
      <section className="faqSection" ref={revealRef} style={{ marginTop: '60px', width: '100%' }}>
        <h2 className="subHeading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={24} className="text-aqua" /> Frequently Asked Questions
        </h2>
        <p className="sectionDesc" style={{ marginBottom: '28px' }}>Got questions about the camera setup or streaming? Here are direct answers.</p>
        <div className="faqGrid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {siteContent.faqs.map((faq, idx) => (
            <div key={idx} className="faqItem" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.05)' }}>
              <h4 style={{ color: '#22d3ee', margin: '0 0 8px 0', fontSize: '1.1rem' }}>{faq.q}</h4>
              <p style={{ color: '#b7cad6', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
