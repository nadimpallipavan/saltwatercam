import { useState } from 'react';
import LiveStream from '../components/LiveStream.jsx';
import { siteContent } from '../data/siteContent.js';

export default function WatchLive() {
  const [aiEnabled, setAiEnabled] = useState(false);

  return (
    <div className="watchPageFull" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '64px', paddingTop: '20px' }}>
      <LiveStream aiEnabled={aiEnabled} />
      
      {/* AI Species Recognition Toggle Bar */}
      <div className="aiControlCard" style={{
        maxWidth: '1220px',
        margin: '0 auto',
        padding: '20px 24px',
        background: 'rgba(6, 32, 49, 0.55)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        width: '90%',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.01em' }}>
            AI Species Recognition
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#b7cad6', lineHeight: '1.4' }}>
            Overlay simulated real-time bounding boxes and confidence tags to identify passing marine life in the feed.
          </p>
        </div>
        
        <button 
          onClick={() => setAiEnabled(!aiEnabled)}
          style={{
            background: aiEnabled ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(34, 211, 238, 0.35)',
            padding: '10px 24px',
            borderRadius: '30px',
            color: '#fff',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '800',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: aiEnabled ? '0 0 15px rgba(34, 211, 238, 0.4)' : 'none',
            letterSpacing: '0.04em'
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: aiEnabled ? '#39ff88' : '#b7cad6',
            boxShadow: aiEnabled ? '0 0 8px #39ff88' : 'none',
            display: 'inline-block'
          }} />
          {aiEnabled ? 'AI DETECTION ACTIVE' : 'ACTIVATE AI DETECTION'}
        </button>
      </div>

      {/* Live Ocean Telemetry Dashboard */}
      <div style={{
        maxWidth: '1220px',
        margin: '0 auto',
        width: '90%',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h4 style={{ textAlign: 'left', margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>
          Live Ocean Telemetry
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {/* Temperature */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Water Temp</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              78.4 <span style={{ fontSize: '1rem', color: '#22d3ee', fontWeight: '800' }}>°F</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #064c72, #22d3ee)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Stable (Inlet current influence)</span>
          </div>

          {/* Visibility */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visibility</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              65 <span style={{ fontSize: '1rem', color: '#39ff88', fontWeight: '800' }}>FT</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #064c72, #39ff88)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Excellent - Clear ocean inflow</span>
          </div>

          {/* Salinity */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salinity</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              35.2 <span style={{ fontSize: '0.9rem', color: '#22d3ee', fontWeight: '800' }}>PPT</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #064c72, #22d3ee)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Normal - Coastal baseline</span>
          </div>

          {/* Current Speed */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Speed</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              1.4 <span style={{ fontSize: '0.9rem', color: '#39ff88', fontWeight: '800' }}>KTS</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #064c72, #39ff88)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Incoming - Tide rising</span>
          </div>
        </div>
      </div>

      {/* Sighting Timeline & Demo Info side-by-side */}
      <div style={{
        maxWidth: '1220px',
        margin: '0 auto',
        width: '90%',
        alignSelf: 'center',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Sightings Timeline */}
        <div style={{
          padding: '24px',
          background: 'rgba(6, 32, 49, 0.45)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '16px',
          textAlign: 'left',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#fff', fontWeight: '800', margin: '0 0 16px 0', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '10px', letterSpacing: '0.01em' }}>
            Sightings Timeline (Today)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {siteContent.timeline.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.1)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid rgba(34, 211, 238, 0.15)', fontFamily: 'Outfit, sans-serif' }}>
                  {item.time}
                </span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{item.species}</strong>
                  <span style={{ fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.3' }}>{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Connection Warning Card */}
        <div style={{
          padding: '24px',
          background: 'rgba(6, 32, 49, 0.45)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '16px',
          textAlign: 'left',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                border: '1.5px solid rgba(245, 158, 11, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Outfit, sans-serif'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                Pending Connection
              </span>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', margin: 0, fontWeight: '800', color: '#fff', letterSpacing: '0.01em' }}>
                Example Demo Stream
              </h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#b7cad6', lineHeight: '1.6', margin: 0 }}>
              This stream currently displays a pre-recorded demo of the Lantana Reef feed. 
              The live underwater camera system is pending final installation and connection testing. 
              Once the live feed is established, the real-time telemetry and 4K stream will automatically connect here.
            </p>
          </div>
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '0.8rem', color: '#b7cad6', display: 'flex', justifyContent: 'space-between' }}>
            <span>Hardware: Cam-1 4K Dome</span>
            <span>Target: Boynton Beach, FL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
