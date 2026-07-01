import { X, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.9) 0%, rgba(3, 17, 28, 0.95) 100%)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '24px',
        padding: '36px 24px',
        width: '100%',
        maxWidth: '440px',
        margin: 'auto',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 211, 238, 0.15)',
        position: 'relative',
        textAlign: 'center',
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

        {/* Phase 2 Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(34, 211, 238, 0.1)', border: '1.5px solid rgba(34, 211, 238, 0.3)', color: '#22d3ee', marginBottom: '20px' }}>
          <Sparkles size={28} className="glowIcon" />
        </div>

        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '20px', fontSize: '0.68rem', fontWeight: '900', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          Phase 2 Feature
        </div>

        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.6rem',
          fontWeight: '900',
          color: '#fff',
          margin: '0 0 12px 0',
          letterSpacing: '0.02em',
        }}>
          Profiles Coming Soon
        </h2>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '0.92rem',
          color: '#b7cad6',
          lineHeight: '1.5',
          fontFamily: 'Outfit, sans-serif'
        }}>
          Profiles and saved progress are coming in Phase 2. You can still explore live cams and Ocean Academy now.
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
            border: '1.5px solid rgba(34, 211, 238, 0.35)',
            padding: '12px 24px',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '900',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(34, 211, 238, 0.2)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.04em',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 211, 238, 0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Start Exploring 🌊
        </button>
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
