import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  // Transparent → frosted glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (tabId) => {
    setPage(tabId);
    setMobileMenuOpen(false);
  };

  // On non-home pages always show solid header
  const isHome = page === 'home';
  const transparent = isHome && !scrolled && !mobileMenuOpen;

  return (
    <header className={`header headerV2 ${transparent ? 'headerTransparent' : 'headerScrolled'}`}>
      {/* Brand logo */}
      <button className="brand" onClick={() => handleNavClick('home')} aria-label="Go home">
        <img
          src="logo-text.png?v=5"
          alt={`${siteContent.brand} Logo`}
          className="brandLogoImg"
        />
      </button>

      {/* Desktop Navigation */}
      <nav className="nav" aria-label="Main navigation">
        {siteContent.tabs.map((tab) => {
          const isActive = page === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Auth widget */}
      <div className="headerAuthWidget">
        {currentUser ? (
          <div className="headerUserContainer">
            <div className="shellWallet" title="Shell Wallet">
              <span className="shellIcon">🐚</span>
              <span>{shells}</span>
            </div>
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
                <img src={currentUser.faceImage} alt={currentUser.username} className="profileAvatarImg" />
              ) : (
                <span className="profileAvatarEmoji">{currentUser.avatar}</span>
              )}
              <span className="headerUsername">{currentUser.username}</span>
            </button>
          </div>
        ) : (
          <button className="loginBtn" onClick={onOpenAuth}>
            Login / Create Profile
          </button>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="menuBtn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobileDrawer">
          <nav className="mobileNav" aria-label="Mobile navigation">
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

          {currentUser ? (
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
          ) : (
            <button className="mobileDrawerLoginBtn" onClick={() => {
              onOpenAuth();
              setMobileMenuOpen(false);
            }}>
              <User size={16} style={{ marginRight: '8px' }} /> Login / Create Profile
            </button>
          )}
        </div>
      )}
    </header>
  );
}
