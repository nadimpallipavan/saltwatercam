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

      {/* Header Auth & Stats Widget */}
      <div className="headerAuthWidget">
        {currentUser ? (
          <div className="headerUserContainer">
            {/* Shell Wallet Counter */}
            <div className="shellWallet" title="Shell Wallet">
              <span className="shellIcon">🐚</span>
              <span>{shells}</span>
            </div>

            {/* Profile Avatar Button */}
            <button
              className="profileBtn"
              onClick={() => {
                if (window.confirm(`Log out from ${currentUser.username}?`)) {
                  onLogout();
                }
              }}
              title="Click to logout"
            >
              {currentUser.faceImage ? (
                <img 
                  src={currentUser.faceImage} 
                  alt={currentUser.username} 
                  className="profileAvatarImg"
                />
              ) : (
                <span className="profileAvatarEmoji">{currentUser.avatar}</span>
              )}
              <span className="headerUsername">
                {currentUser.username}
              </span>
            </button>
          </div>
        ) : (
          <button className="loginBtn" onClick={onOpenAuth}>
            Login / Create Profile
          </button>
        )}
      </div>

      {/* Mobile Auth Button (visible only on mobile, next to hamburger menu toggle) */}
      <div className="mobileAuthBtn">
        {currentUser ? (
          <button
            className="mobileProfileBtn"
            onClick={() => {
              if (window.confirm(`Log out from ${currentUser.username}?`)) {
                onLogout();
              }
            }}
            title={`Logged in as ${currentUser.username}. Click to logout.`}
          >
            {currentUser.faceImage ? (
              <img 
                src={currentUser.faceImage} 
                alt={currentUser.username} 
                className="mobileAvatarImg"
              />
            ) : (
              <span className="mobileAvatarInitials">{currentUser.avatar || currentUser.username[0].toUpperCase()}</span>
            )}
          </button>
        ) : (
          <button
            className="mobileLoginBtn"
            onClick={onOpenAuth}
            title="Login / Create Profile"
          >
            <User size={16} />
          </button>
        )}
      </div>

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

          {currentUser && (
            <div className="mobileDrawerUserCard">
              <div className="mobileDrawerUserDetails">
                {currentUser.faceImage ? (
                  <img src={currentUser.faceImage} alt={currentUser.username} className="mobileDrawerAvatar" />
                ) : (
                  <span className="mobileDrawerAvatarPlaceholder">{currentUser.avatar || currentUser.username[0].toUpperCase()}</span>
                )}
                <div>
                  <div className="mobileDrawerUsername">{currentUser.username}</div>
                  <div className="mobileDrawerShellCount">🐚 {shells} Shells</div>
                </div>
              </div>
              <button className="mobileDrawerLogoutBtn" onClick={() => {
                if (window.confirm(`Log out from ${currentUser.username}?`)) {
                  onLogout();
                  setMobileMenuOpen(false);
                }
              }}>
                <LogOut size={14} style={{ marginRight: '6px' }} /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
