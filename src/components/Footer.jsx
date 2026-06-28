import { useState } from 'react';
import { Mail, ArrowRight, MapPin } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';

const FOOTER_LINKS = {
  Explore: [
    { label: 'Watch Live', page: 'watch' },
    { label: 'Marine Guide', page: 'marine-guide' },
    { label: 'Community', page: 'community' },
    { label: 'About Us', page: 'about' },
  ],
  'Kids Club': [
    { label: 'Championship', page: 'kids-club' },
    { label: 'Trivia Quiz', page: 'kids-club' },
    { label: 'Redeem Rewards', page: 'kids-club' },
    { label: 'Game Rules', page: 'kids-club' },
  ],
  Conservation: [
    { label: 'Pledge Shells', page: 'kids-club' },
    { label: 'Kingston K9 Rescue', href: 'https://kingstonk9.com' },
    { label: 'SWC Conservation Fund', page: 'about' },
    { label: 'Marine Education', page: 'about' },
  ],
};

const CAMERA_LOCATIONS = [
  'Boynton Inlet',
  'Phil Foster Park',
  'Jupiter Inlet',
  'Key Largo Reef',
  'Lake Worth Pier',
  'Lantana Dock',
];

export default function Footer({ setPage }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="footerV2" aria-label="Site footer">
      {/* Camera location marquee strip */}
      <div className="locationMarqueeStrip" aria-label="Camera locations">
        <div className="locationMarqueeTrack">
          {[...CAMERA_LOCATIONS, ...CAMERA_LOCATIONS].map((loc, i) => (
            <span key={i} className="locationMarqueeItem">
              <MapPin size={11} />
              {loc}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="footerGrid">
        {/* Col 1 — Brand */}
        <div className="footerBrand">
          <button onClick={() => setPage('home')} className="footerLogoBtn" aria-label="Go to homepage">
            <img src="logo-text.png?v=5" alt={siteContent.brand} className="footerLogoImg" />
          </button>
          <p className="footerTagline">{siteContent.tagline}</p>
          <p className="footerLocation">
            <MapPin size={13} />
            {siteContent.location}
          </p>
          {/* Social icons */}
          <div className="footerSocialsV2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="socialIconV2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="socialIconV2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="socialIconV2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>
            </a>
            <a href="mailto:hello@saltwatercam.com" aria-label="Email" className="socialIconV2">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Cols 2-4 — Link groups */}
        {Object.entries(FOOTER_LINKS).map(([group, links]) => (
          <div key={group} className="footerLinkGroup">
            <h4 className="footerLinkGroupTitle">{group}</h4>
            <ul className="footerLinkList">
              {links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="footerLink">
                      {link.label}
                    </a>
                  ) : (
                    <button onClick={() => setPage(link.page)} className="footerLink">
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Col 5 — Newsletter */}
        <div className="footerNewsletter">
          <h4 className="footerLinkGroupTitle">Stay in the Reef Loop</h4>
          <p className="footerNewsletterDesc">Get monthly sighting reports, explorer leaderboard updates, and conservation news.</p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="footerSubscribeForm" noValidate>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="footerEmailInput"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="footerSubscribeBtn" aria-label="Subscribe to newsletter">
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div className="footerSubscribeSuccess" role="status">
              <span className="footerSuccessCheck">✓</span>
              <span>You're in! Welcome to the reef. 🌊</span>
            </div>
          )}
          <p className="footerNewsletterNote">No spam. Unsubscribe any time.</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footerBottomBar">
        <span>© 2026 SaltWaterCam.com — All Rights Reserved</span>
        <div className="footerBottomLinks">
          <button className="footerBottomLink" onClick={() => setPage('about')}>Privacy Policy</button>
          <span aria-hidden="true">·</span>
          <button className="footerBottomLink" onClick={() => setPage('about')}>Terms of Use</button>
          <span aria-hidden="true">·</span>
          <span>Built with 🌊 in Lantana, FL</span>
        </div>
      </div>
    </footer>
  );
}
