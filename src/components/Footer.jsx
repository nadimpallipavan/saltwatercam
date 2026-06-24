import { Mail } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import logoText from '../assets/logo-text.png';

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      {/* Left logo */}
      <div className="footerLogo">
        <button onClick={() => setPage('home')} aria-label="Go home">
          <img 
            src={logoText} 
            alt={`${siteContent.brand} Logo`} 
            className="footerLogoImg" 
            loading="lazy"
          />
        </button>
      </div>

      {/* Center Copyright */}
      <div className="footerCopyright">
        <p>© 2026 Saltwatercam.com | All Rights Reserved</p>
      </div>

      {/* Right Social Icons */}
      <div className="footerSocials">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="socialIcon" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="socialIcon" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="socialIcon" aria-label="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>
        </a>
        <a href="mailto:hello@saltwatercam.com" className="socialIcon" aria-label="Email Newsletter">
          <Mail size={18} />
        </a>
      </div>
    </footer>
  );
}
