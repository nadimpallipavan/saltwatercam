import { useState, useEffect } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Users, Send, MessageSquare, PlusCircle, Check, Heart } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function CommunityPage() {
  const [reports, setReports] = useState(siteContent.sightingReports);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'ReefDiver', text: 'Stingray spotted moving left!', time: '1:28 PM' },
    { id: 2, user: 'FisherGirl', text: 'Snook are really active under the light tonight.', time: '1:27 PM' },
    { id: 3, user: 'OceanLover', text: 'Is that a loggerhead turtle near the piling?', time: '1:25 PM' },
    { id: 4, user: 'MarineBio', text: 'Incoming tide is bringing in very clean ocean water.', time: '1:24 PM' }
  ]);
  
  // Sighting Form state
  const [userName, setUserName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('Common Snook');
  const [sightingCount, setSightingCount] = useState('1');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  const revealRef = useScrollReveal();

  // Simulated live chat additions
  useEffect(() => {
    const liveChatPool = [
      { user: 'FloridaExplorer', text: 'Just saw a massive Tarpon cruise past the frame!' },
      { user: 'SandyToes', text: 'Water visibility looks great on the telemetry grid!' },
      { user: 'GoliathFan', text: 'Waiting to see if the big Grouper shows up.' },
      { user: 'GreenLightFan', text: 'The green LED light beam looks awesome tonight!' },
      { user: 'SnookTracker', text: 'Counted 12 snook hovering in the current shadow.' }
    ];

    let poolIdx = 0;
    const interval = setInterval(() => {
      if (poolIdx < liveChatPool.length) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages(prev => [
          {
            id: Date.now(),
            user: liveChatPool[poolIdx].user,
            text: liveChatPool[poolIdx].text,
            time: timeNow
          },
          ...prev
        ]);
        poolIdx++;
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Handle Form submit
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !notes.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReport = {
      id: Date.now(),
      user: userName,
      species: selectedSpecies,
      time: timeNow,
      count: parseInt(sightingCount) || 1,
      notes: notes,
      likes: 0
    };

    setReports(prev => [newReport, ...prev]);
    setIsSubmitted(true);
    
    // Clear inputs
    setUserName('');
    setNotes('');
    setSightingCount('1');

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  // Handle Chat submit
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      {
        id: Date.now(),
        user: 'You (Explorer)',
        text: chatInput,
        time: timeNow
      },
      ...prev
    ]);
    setChatInput('');
  };

  // Handle Sighting Sighting Report likes
  const handleLike = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  return (
    <div className="pageContainer communityPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <Users size={14} /> Community Hub
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          Explorer Community Feed
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Share your real-time sightings, chat with fellow ocean watchers, and report marine traffic near the Lantana reefs!
        </p>
      </div>

      {/* Grid: Left side sightings feed, Right side report form & chat sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1.8fr 1.2fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Sighting Reports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: '800', textAlign: 'left', margin: 0 }}>
            Recent Sighting Log
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((report) => (
              <div 
                key={report.id}
                style={{
                  padding: '20px',
                  background: 'rgba(6, 32, 49, 0.45)',
                  border: '1px solid rgba(34, 211, 238, 0.18)',
                  borderRadius: '16px',
                  textAlign: 'left',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: '#fff' }}>{report.user}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#b7cad6', opacity: 0.8 }}>Sighted: {report.time}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', background: 'rgba(34, 211, 238, 0.12)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.25)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    {report.count} {report.species}
                  </span>
                </div>
                
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#b7cad6', lineHeight: '1.45' }}>
                  {report.notes}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                  <button 
                    onClick={() => handleLike(report.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b7cad6',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <Heart size={14} fill={report.likes > 0 ? '#f43f5e' : 'none'} color={report.likes > 0 ? '#f43f5e' : '#b7cad6'} />
                    <span>{report.likes} Likes</span>
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#b7cad6', opacity: 0.6 }}>verified sighting</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sighting Submission Form & Live Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Submit Sighting Form */}
          <div style={{ padding: '24px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: '800', margin: '0 0 14px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={18} style={{ color: '#22d3ee' }} />
              Submit Sighting Report
            </h3>
            
            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Name / Alias</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. ReefWatcher4"
                  required
                  style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Species Seen</label>
                  <select 
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                    style={{ padding: '10px 12px', background: '#031b2e', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem' }}
                  >
                    <option value="Common Snook">Common Snook</option>
                    <option value="Atlantic Tarpon">Atlantic Tarpon</option>
                    <option value="Goliath Grouper">Goliath Grouper</option>
                    <option value="Green Sea Turtle">Green Sea Turtle</option>
                    <option value="Southern Stingray">Southern Stingray</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Count</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={sightingCount}
                    onChange={(e) => setSightingCount(e.target.value)}
                    required
                    style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Activity Details & Notes</label>
                <textarea 
                  rows="3" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Swam slowly past piling under green dock light."
                  required
                  style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitted}
                style={{
                  background: isSubmitted ? 'rgba(57, 255, 136, 0.15)' : 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                  border: '1.5px solid rgba(34, 211, 238, 0.3)',
                  padding: '10px',
                  borderRadius: '8px',
                  color: isSubmitted ? '#39ff88' : '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  cursor: isSubmitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitted ? (
                  <>
                    <Check size={16} /> REPORT POSTED!
                  </>
                ) : (
                  'SUBMIT SIGHTING'
                )}
              </button>
            </form>
          </div>

          {/* Sighting Chat Sidebar */}
          <div style={{ padding: '24px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', height: '350px' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: '800', margin: '0 0 14px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={18} style={{ color: '#22d3ee' }} />
              Live Sighting Chat
            </h3>
            
            {/* Scrollable messages area */}
            <div style={{ flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '6px', marginBottom: '14px' }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', color: '#22d3ee', fontFamily: 'Outfit, sans-serif' }}>{msg.user}</span>
                    <span style={{ color: '#b7cad6', fontSize: '0.72rem', opacity: 0.6 }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, color: '#b7cad6', lineHeight: '1.35' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Send Form */}
            <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Share sizing, speed or counts..."
                required
                style={{ flex: '1', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '6px', color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}
              />
              <button 
                type="submit"
                style={{
                  background: '#064c72',
                  border: '1.5px solid #22d3ee',
                  padding: '8px',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
