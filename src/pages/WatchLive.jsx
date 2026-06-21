import LiveStream from '../components/LiveStream.jsx';

export default function WatchLive() {
  return (
    <div className="watchPageFull" style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '64px', paddingTop: '20px' }}>
      <LiveStream />
      
      {/* Pending Live Stream / Demo Notice Card */}
      <div className="demoNoticeCard" style={{
        maxWidth: '1220px',
        margin: '0 auto',
        padding: '28px',
        background: 'rgba(6, 32, 49, 0.45)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        textAlign: 'left',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
        width: '90%',
        alignSelf: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f43f5e',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            border: '1.5px solid rgba(239, 68, 68, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f43f5e', display: 'inline-block' }} />
            Pending Connection
          </span>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', margin: 0, fontWeight: '800', color: '#fff', letterSpacing: '0.02em' }}>
            Example Demo Stream
          </h3>
        </div>
        <p style={{ fontSize: '0.98rem', color: '#b7cad6', lineHeight: '1.65', margin: 0 }}>
          This stream currently displays a pre-recorded demo of the Lantana Reef feed. 
          The live underwater camera system is pending final installation and connection testing. 
          Once the live feed is established, the real-time telemetry and 4K stream will automatically connect here.
        </p>
      </div>
    </div>
  );
}
