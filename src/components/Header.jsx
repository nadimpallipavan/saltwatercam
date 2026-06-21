import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';

export default function Header({ 
  page, 
  setPage, 
  isAudioPlaying, 
  onToggleAudio, 
  currentUser, 
  shells, 
  onOpenAuth, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setPage(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Brand logo image from mockup */}
      <button className="brand" onClick={() => handleNavClick('home')} aria-label="Go home" style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="logo-text.png?v=5" 
          alt={`${siteContent.brand} Logo`} 
          className="brandLogoImg" 
        />
      </button>

      {/* Desktop Navigation */}
      <nav className="nav" style={{ display: 'flex', gap: '24px', marginLeft: 'auto', marginRight: '20px' }}>
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

      {/* Header Auth & Stats Widget */}
      <div className="headerAuthWidget" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        // On mobile, if nav is display:none, this widget will float right next to the menuBtn
      }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Shell Wallet Counter */}
            <div 
              title="Shell Wallet"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1.5px solid rgba(34, 211, 238, 0.25)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: '900',
                color: '#22d3ee',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)'
              }}
            >
              <span style={{ fontSize: '1rem' }}>🐚</span>
              <span>{shells}</span>
            </div>

            {/* Profile Avatar Button */}
            <button
              onClick={() => {
                if (window.confirm(`Log out from ${currentUser.username}?`)) {
                  onLogout();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(6, 32, 49, 0.65)',
                border: '1.5px solid rgba(34, 211, 238, 0.2)',
                padding: '6px 14px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '0.82rem',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.2)';
                e.currentTarget.style.background = 'rgba(6, 32, 49, 0.65)';
              }}
              title="Click to logout"
            >
              {currentUser.faceImage ? (
                <img 
                  src={currentUser.faceImage} 
                  alt={currentUser.username} 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #22d3ee',
                    boxShadow: '0 0 6px rgba(34, 211, 238, 0.4)'
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.1rem' }}>{currentUser.avatar}</span>
              )}
              <span className="headerUsername" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.username}
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
              border: '1.5px solid rgba(34, 211, 238, 0.35)',
              padding: '8px 18px',
              borderRadius: '20px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 211, 238, 0.15)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Login / Create Profile
          </button>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button 
        className="menuBtn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        style={{ marginLeft: '12px' }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobileDrawer" style={{ zIndex: 99 }}>
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

            {/* Mobile Auth Indicator inside drawer */}
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              {currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#fff' }}>
                    {currentUser.faceImage ? (
                      <img 
                        src={currentUser.faceImage} 
                        alt={currentUser.username} 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1.5px solid #22d3ee',
                          boxShadow: '0 0 8px rgba(34, 211, 238, 0.4)'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.4rem' }}>{currentUser.avatar}</span>
                    )}
                    <strong>{currentUser.username}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: '800' }}>
                    🐚 {shells} Shells in Wallet
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1.5px solid rgba(239, 68, 68, 0.3)',
                      padding: '10px',
                      borderRadius: '10px',
                      color: '#f87171',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                    border: '1.5px solid rgba(34, 211, 238, 0.35)',
                    padding: '10px',
                    borderRadius: '10px',
                    color: '#fff',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Login / Create Profile
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
