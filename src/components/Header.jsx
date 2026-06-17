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
          src="/logo-header-cropped.png?v=3" 
          alt={`${siteContent.brand} Logo`} 
          className="brandLogoImg" 
        />
      </button>

      {/* Desktop Navigation */}
      <nav className="nav">
        {siteContent.tabs.map((tab) => {
          const isActive = page === tab.id || (tab.id === 'explore' && page === 'marine-life') || (tab.id === 'education' && page === 'conservation');
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

      {/* Sound Visualizer & Toggle Button */}
      <button 
        className="soundBtn" 
        onClick={onToggleAudio}
        aria-label={isAudioPlaying ? "Mute ambient ocean rumble" : "Play ambient ocean rumble"}
      >
        <div className={`soundVisualizer ${isAudioPlaying ? 'active' : ''}`}>
          <div className="soundBar" />
          <div className="soundBar" />
          <div className="soundBar" />
          <div className="soundBar" />
        </div>
        <span>{isAudioPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
      </button>

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
            <button 
              className="soundBtn mobileSoundBtn" 
              onClick={onToggleAudio}
              style={{ marginTop: '15px', alignSelf: 'center', background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
            >
              <div className={`soundVisualizer ${isAudioPlaying ? 'active' : ''}`}>
                <div className="soundBar" style={{ backgroundColor: '#fff' }} />
                <div className="soundBar" style={{ backgroundColor: '#fff' }} />
                <div className="soundBar" style={{ backgroundColor: '#fff' }} />
                <div className="soundBar" style={{ backgroundColor: '#fff' }} />
              </div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>{isAudioPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
