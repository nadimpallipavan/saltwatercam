import { useState } from 'react';
import { Menu, X, Play } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';

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
          src="logo-text.png?v=5" 
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
          </nav>
        </div>
      )}
    </header>
  );
}
