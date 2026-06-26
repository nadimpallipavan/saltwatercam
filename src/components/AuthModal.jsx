import { useState, useRef, useEffect } from 'react';
import { X, User, Shield, Compass, Sparkles, Mail, Phone, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { authService } from '../supabaseClient.js';

const AVATARS = [
  { id: 'fish', emoji: '🐠', name: 'Neon Tang', color: '#06b6d4' },
  { id: 'turtle', emoji: '🐢', name: 'Sea Turtle', color: '#10b981' },
  { id: 'diver', emoji: '🤿', name: 'Reef Diver', color: '#f59e0b' },
  { id: 'shark', emoji: '🦈', name: 'Apex Shark', color: '#6366f1' },
  { id: 'octopus', emoji: '🐙', name: 'Coral Octopus', color: '#ec4899' },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin', color: '#06b6d4' },
];

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('turtle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim()) {
      setError('Username is required.');
      setLoading(false);
      return;
    }

    if (!isLoginTab) {
      if (!email.trim()) {
        setError('Email address is required.');
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters for security.');
      setLoading(false);
      return;
    }

    try {
      const avatarObj = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];
      
      let res;
      if (isLoginTab) {
        res = await authService.signIn(username, password);
      } else {
        res = await authService.signUp(username, email, '', password, avatarObj.emoji, faceSnapshot);
      }

      if (res.error) {
        setError(res.error.message);
      } else {
        onLogin(res.data.user);
        onClose();
        // Clear fields
        setUsername('');
        setEmail('');
        setPassword('');
        setFaceSnapshot(null);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 13, 21, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.9) 0%, rgba(3, 17, 28, 0.95) 100%)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 211, 238, 0.15)',
        position: 'relative',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b7cad6',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#b7cad6';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'rgba(34, 211, 238, 0.1)',
            border: '1.5px solid rgba(34, 211, 238, 0.3)',
            color: '#22d3ee',
            marginBottom: '12px',
          }}>
            <Compass size={24} className="glowIcon" />
          </div>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.6rem',
            fontWeight: '900',
            color: '#fff',
            margin: '0 0 6px 0',
            letterSpacing: '0.02em',
          }}>
            {isLoginTab ? 'Welcome Back Explorer' : 'Create Explorer ID'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#b7cad6',
            lineHeight: '1.4'
          }}>
            {isLoginTab 
              ? 'Log in to track your conservation impact and sync shell counts.' 
              : 'Join the community, clean up the ocean, and support real non-profits.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            onClick={() => { setIsLoginTab(true); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: isLoginTab ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
              color: isLoginTab ? '#fff' : '#b7cad6',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: isLoginTab ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid transparent'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: !isLoginTab ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
              color: !isLoginTab ? '#fff' : '#b7cad6',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: !isLoginTab ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid transparent'
            }}
          >
            Create Profile
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textAlign: 'left'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Username Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#b7cad6' }} />
              <input
                type="text"
                placeholder="e.g. ReefWatcher99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1.5px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22d3ee';
                  e.target.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {!isLoginTab && (
            <>
              {/* Email Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Address (Gmail / Email)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#b7cad6' }} />
                  <input
                    type="email"
                    placeholder="e.g. explorer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1.5px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#22d3ee';
                      e.target.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>


            </>
          )}

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <label style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Access Code / Password
            </label>
            <div style={{ position: 'relative' }}>
              <Shield size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#b7cad6' }} />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1.5px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22d3ee';
                  e.target.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Avatar Selection (Only for Sign Up / Create Profile) */}
          {!isLoginTab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginTop: '4px' }}>
              <label style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} style={{ color: '#22d3ee' }} /> Choose Avatar Mascot
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                background: 'rgba(0,0,0,0.15)',
                padding: '8px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      title={av.name}
                      style={{
                        padding: '8px 0',
                        fontSize: '1.4rem',
                        background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                        border: isSelected ? `1.5px solid ${av.color}` : '1.5px solid transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? `0 0 8px ${av.color}40` : 'none',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {av.emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Action Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.35)',
                padding: '12px 24px',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '900',
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.65 : 1,
                boxShadow: '0 4px 15px rgba(34, 211, 238, 0.2)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.04em',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 211, 238, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'AUTHENTICATING...' : (isLoginTab ? 'LOG IN EXPLORER' : 'REGISTER PROFILE')}
            </button>
          </div>
        </form>

        {/* Demo Accounts notice */}
        <div style={{
          marginTop: '20px',
          fontSize: '0.72rem',
          color: '#b7cad6',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <span>🔒 Staging Mode: Accounts are simulated locally.</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .glowIcon {
          filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.6));
        }
      `}</style>
    </div>
  );
}
