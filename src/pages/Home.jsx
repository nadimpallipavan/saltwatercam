import Hero from '../components/Hero.jsx';
import { siteContent } from '../data/siteContent.js';
import { ArrowRight, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function Home({ setPage }) {
  const revealRef = useScrollReveal();

  return (
    <>
      {/* Immersive Hero section */}
      <Hero setPage={setPage} />

      {/* About / Story Section */}
      <section id="about" className="section twoCol" ref={revealRef}>
        <div className="aboutLeft">
          <p className="sectionLabel"><BookOpen size={16} /> Our Story</p>
          <h2>{siteContent.aboutHeadline}</h2>
        </div>
        <div className="aboutRight">
          <p className="aboutMainText">
            {siteContent.aboutText}
          </p>
          <button className="textLink" onClick={() => setPage('about')}>
            Read our full project FAQ <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Core V1 Feature Previews */}
      <section id="explore" className="section cards">
        <TiltCard className="card" revealRef={revealRef} onClick={() => setPage('explore')}>
          <div className="cardIcon"><ShieldCheck size={24} /></div>
          <h3>Green Fish Light</h3>
          <p>Learn how our 1000-watt green LED light cuts through coastal turbidity to attract local marine life and create a thriving nocturnal feeding ground.</p>
          <span className="cardAction">Learn science <ArrowRight size={14} /></span>
        </TiltCard>

        <TiltCard className="card delay-1" revealRef={revealRef} onClick={() => setPage('explore')}>
          <div className="cardIcon"><Heart size={24} /></div>
          <h3>Local Marine Life</h3>
          <p>From juvenile sea turtles and Southern stingrays to migrating tarpon, discover the species that swim through the Boynton Beach Inlet region daily.</p>
          <span className="cardAction">See directory <ArrowRight size={14} /></span>
        </TiltCard>

        <TiltCard className="card delay-2" revealRef={revealRef} onClick={() => setPage('kids-club')}>
          <div className="cardIcon"><BookOpen size={24} /></div>
          <h3>Built for All Ages</h3>
          <p>Simple navigation, interactive trivia, and large high-contrast elements make exploration fun and educational for kids and families alike.</p>
          <span className="cardAction">Enter kids club <ArrowRight size={14} /></span>
        </TiltCard>
      </section>

      {/* CTA Section */}
      <section className="ctaSection" ref={revealRef}>
        <h2>Ready to see it live?</h2>
        <p>Watch snooks, tarpons, and sea turtles swimming near our dock in real-time.</p>
        <button className="primaryBtn ctaWatchBtn" onClick={() => setPage('watch')}>
          Watch Live Stream Now
        </button>
      </section>
    </>
  );
}
