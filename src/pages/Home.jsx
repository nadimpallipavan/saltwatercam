import { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero.jsx';
import MarineFeatureGrid from '../components/MarineFeatureGrid.jsx';
import { siteContent } from '../data/siteContent.js';
import { ArrowRight, BookOpen, ShieldCheck, Heart, Eye, Fish, Star } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

// ── Stat counter card ──────────────────────────────────────────────────────
function StatCounter({ value, suffix = '', label, icon: Icon }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="statCard" ref={ref}>
      {Icon && <Icon size={20} className="statIcon" aria-hidden="true" />}
      <strong className="statValue">
        {count.toLocaleString()}{suffix}
      </strong>
      <span className="statLabel">{label}</span>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: "My kids won't stop watching — they learned more about sea turtles in one afternoon than in a whole semester!",
    author: 'Sarah M.',
    role: 'Parent, Palm Beach County',
    avatar: '🌊',
  },
  {
    quote: 'I spotted a Goliath Grouper on my lunch break. This is the most relaxing thing on the internet.',
    author: 'James T.',
    role: 'Marine biology teacher',
    avatar: '🐡',
  },
  {
    quote: 'The Kids Club Championship got my daughter OBSESSED with ocean conservation. She donated all her shells to coral reef planting!',
    author: 'Rosa K.',
    role: 'Parent, Jupiter FL',
    avatar: '🐢',
  },
];

export default function Home({ setPage }) {
  const revealRef = useScrollReveal();

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <Hero setPage={setPage} />

      {/* ── 2. Live Stats Strip ──────────────────────────────────────────── */}
      <section className="statsStrip" aria-label="Live statistics" ref={revealRef}>
        <div className="statsStripInner">
          {/* Pulsing LIVE badge */}
          <div className="liveBadgeStrip">
            <span className="liveDotRing" aria-hidden="true" />
            <span className="liveDot" aria-hidden="true" />
            <span>LIVE NOW</span>
          </div>
          <div className="statsGrid">
            <StatCounter value={1258} label="Viewers Watching" icon={Eye} />
            <StatCounter value={12}   label="Species Today" icon={Fish} />
            <StatCounter value={1847} label="All-Time Sightings" suffix="+" icon={Star} />
            <StatCounter value={24}   suffix="/7" label="Live Stream" icon={Eye} />
          </div>
        </div>
      </section>

      {/* ── 3. About / Story ─────────────────────────────────────────────── */}
      <section id="about" className="section twoCol" ref={revealRef}>
        <div className="aboutLeft">
          <p className="sectionLabel"><BookOpen size={16} /> Our Story</p>
          <h2>{siteContent.aboutHeadline}</h2>
        </div>
        <div className="aboutRight">
          <p className="aboutMainText">{siteContent.aboutText}</p>
          <button className="textLink" onClick={() => setPage('about')}>
            Read our full project FAQ <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 4. Marine Life Bento Grid ────────────────────────────────────── */}
      <MarineFeatureGrid setPage={setPage} />

      {/* ── 5. Feature Previews ──────────────────────────────────────────── */}
      <section id="explore" className="section cards" ref={revealRef}>
        <TiltCard className="card" revealRef={revealRef} onClick={() => setPage('marine-guide')}>
          <div className="cardIcon"><ShieldCheck size={24} /></div>
          <h3>Green Fish Light</h3>
          <p>Learn how our 1000-watt green LED light cuts through coastal turbidity to attract local marine life and create a thriving nocturnal feeding ground.</p>
          <span className="cardAction">Learn science <ArrowRight size={14} /></span>
        </TiltCard>

        <TiltCard className="card delay-1" revealRef={revealRef} onClick={() => setPage('marine-guide')}>
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

      {/* ── 6. Testimonials ──────────────────────────────────────────────── */}
      <section className="testimonialsSection" ref={revealRef} aria-labelledby="testimonials-heading">
        <div className="sectionHeaderCentered">
          <p className="eyebrowCentered">💬 What Families Say</p>
          <h2 id="testimonials-heading">Loved by Ocean Explorers</h2>
        </div>
        <div className="testimonialsGrid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonialCard">
              <p className="testimonialQuote">"{t.quote}"</p>
              <div className="testimonialAuthor">
                <span className="testimonialAvatar" aria-hidden="true">{t.avatar}</span>
                <div>
                  <strong className="testimonialName">{t.author}</strong>
                  <span className="testimonialRole">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Kids Club CTA ─────────────────────────────────────────────── */}
      <section className="kidsCtaSection" ref={revealRef} aria-labelledby="kids-cta-heading">
        <div className="kidsCtaInner">
          <div className="kidsCtaLeft">
            <p className="eyebrow">🏆 Kids Explorer Club</p>
            <h2 id="kids-cta-heading">Earn Shells. Level Up. Win Real Prizes.</h2>
            <p className="kidsCtaDesc">
              Tap fish on the live stream to collect 🐚 Shells. Climb the monthly leaderboard and win an <strong>Explorer Adventure Kit</strong> shipped straight to your door!
            </p>
            {/* Animated progress bar teaser */}
            <div className="kidsProgressDemo" aria-label="Example shell progress: Level 2, 500 of 1500 shells">
              <div className="kidsProgressHeader">
                <span>🪸 Coral Explorer — Lvl 2</span>
                <span>500 / 1,500 🐚</span>
              </div>
              <div className="kidsProgressTrack">
                <div className="kidsProgressFill" style={{ '--progress-target': '33%' }} />
              </div>
            </div>
            <button
              className="primaryBtn glowBtn kidsCtaBtn"
              onClick={() => setPage('kids-club')}
              aria-label="Join the Kids Explorer Club"
            >
              🏆 Join Explorer Club
            </button>
          </div>
          <div className="kidsCtaRight" aria-hidden="true">
            <div className="kidsCtaTrophyBadge">
              <span className="trophyEmoji">🏆</span>
              <div className="trophyRing ring1" />
              <div className="trophyRing ring2" />
              <div className="trophyRing ring3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final watch-live CTA ──────────────────────────────────────── */}
      <section className="ctaSection" ref={revealRef} aria-labelledby="cta-heading">
        <h2 id="cta-heading">Ready to see it live?</h2>
        <p>Watch snooks, tarpons, and sea turtles swimming near our dock in real-time.</p>
        <button className="primaryBtn ctaWatchBtn glowBtn" onClick={() => setPage('watch')}>
          Watch Live Stream Now
        </button>
      </section>
    </>
  );
}
