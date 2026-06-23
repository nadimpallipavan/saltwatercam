import { useState } from 'react';
import { Menu, X, Play } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import logoText from '../assets/logo-text.png';

export default function Header({ page, setPage, isAudioPlaying, onToggleAudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setPage(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      {/* Brand logo image from mockup */}
      <button className="brand" onClick={() => handleNavClick('home')} aria-label="Go home">
        <img 
          src={logoText} 
          alt={`${siteContent.brand} Logo`} 
          className="brandLogoImg" 
        />
      </button>

      {/* Desktop Navigation */}
      <nav className="nav">
        {siteContent.tabs.map((tab) => {
          const isActive = page === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => handleNavClick(tab.id)}
              className={isActive ? 'active' : ''}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>



      {/* WATCH LIVE CTA button */}
      <button className="watchBtn" onClick={() => handleNavClick('watch')}>
        <span>WATCH LIVE</span>
        <Play size={14} fill="currentColor" />
      </button>

      {/* Mobile menu toggle */}
      <button 
        className="menuBtn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobileDrawer">
          <nav className="mobileNav">
            {siteContent.tabs.map((tab) => {
              const isActive = page === tab.id;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => handleNavClick(tab.id)}
                  className={isActive ? 'active' : ''}
                >
                  {tab.label}
                </button>
              );
            })}
            <button className="mobileWatchBtn" onClick={() => handleNavClick('watch')}>
              <Play size={16} fill="currentColor" /> WATCH LIVE
            </button>

          </nav>
        </div>
      )}
    </header>
  );
}
