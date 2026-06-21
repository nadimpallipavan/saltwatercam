import { useState } from 'react';
import { Mail, MapPin, Send, Check } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Sighting Question');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const revealRef = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate sending message
    setIsSent(true);
    setName('');
    setEmail('');
    setMessage('');

    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="pageContainer contactPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <Mail size={14} /> Contact Us
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          Connect with the Team
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Have feedback on the AI detections, suggestions for local reef studies, or business partnership inquiries? Drop us a note!
        </p>
      </div>

      {/* Grid: Left side Contact details, Right side Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>
            Get in Touch
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#b7cad6', lineHeight: '1.6' }}>
            We work with marine biologists, coastal students, and local Florida dive communities. Let us know if you would like to volunteer or suggest sensor setups.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)', color: '#22d3ee' }}>
                <Mail size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Support Email</strong>
                <span style={{ fontSize: '0.85rem', color: '#b7cad6' }}>info@saltwatercam.com</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)', color: '#22d3ee' }}>
                <MapPin size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Camera Coordinates</strong>
                <span style={{ fontSize: '0.85rem', color: '#b7cad6' }}>Lantana Dock • Boynton Beach Inlet, Florida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <TiltCard revealRef={revealRef} style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px 0', color: '#fff' }}>
            Send Message
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. johndoe@gmail.com"
                required
                style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Topic</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ padding: '10px 12px', background: '#031b2e', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem' }}
              >
                <option value="General Sighting Question">General Question</option>
                <option value="AI Fish Recognition Feedback">AI Detection Feedback</option>
                <option value="Volunteer / Internship">Volunteer / Internship</option>
                <option value="Hardware / Stream Downtime">Report Camera Downtime</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</label>
              <textarea 
                rows="4" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                required
                style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSent}
              style={{
                background: isSent ? 'rgba(57, 255, 136, 0.15)' : 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                border: '1.5px solid rgba(34, 211, 238, 0.3)',
                padding: '10px',
                borderRadius: '8px',
                color: isSent ? '#39ff88' : '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: isSent ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {isSent ? (
                <>
                  <Check size={16} /> MESSAGE SENT!
                </>
              ) : (
                <>
                  <Send size={14} /> SEND MESSAGE
                </>
              )}
            </button>
          </form>
        </TiltCard>
      </div>
    </div>
  );
}
