import { useState, useEffect } from 'react';
import LiveStream from '../components/LiveStream.jsx';
import { Wifi } from 'lucide-react';

export default function WatchLive({ addShells, shells, currentUser }) {
  const [exchangeSuccess, setExchangeSuccess] = useState(null);

  // Level calculation matching LiveStream.jsx
  const getLevelInfo = (shellCount) => {
    if (shellCount < 500)   return { level: 1, target: 500,   prevTarget: 0,     title: 'Reef Buddy 🐠' };
    if (shellCount < 1500)  return { level: 2, target: 1500,  prevTarget: 500,   title: 'Coral Explorer 🪸' };
    if (shellCount < 3500)  return { level: 3, target: 3500,  prevTarget: 1500,  title: 'Sea Turtle Sidekick 🐢' };
    if (shellCount < 7000)  return { level: 4, target: 7000,  prevTarget: 3500,  title: 'Dolphin Defender 🐬' };
    if (shellCount < 12000) return { level: 5, target: 12000, prevTarget: 7000,  title: 'Ocean Superhero 🦸' };
    return                        { level: 6, target: null,  prevTarget: 12000, title: 'Sea King & Queen 👑' };
  };

  const levelInfo = getLevelInfo(shells);

  // ── Real-time NOAA water temperature (Station 8722670 – Lake Worth Pier, FL) ──
  const [waterTemp, setWaterTemp] = useState(null);
  const [tempStatus, setTempStatus] = useState('loading');

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const now = new Date();
        const end   = now.toISOString().slice(0, 16).replace('T', ' ');
        const start = new Date(now - 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ');
        const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?` +
          `begin_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}` +
          `&station=8722670&product=water_temperature&datum=MLLW&time_zone=lst_ldt` +
          `&interval=6&units=english&application=saltwatercam&format=json`;
        const res  = await fetch(url);
        const data = await res.json();
        const readings = data?.data;
        if (readings && readings.length > 0) {
          const latest = readings[readings.length - 1].v;
          setWaterTemp(parseFloat(latest).toFixed(1));
          setTempStatus('ok');
        } else {
          setTempStatus('error');
        }
      } catch {
        setTempStatus('error');
      }
    };
    fetchTemp();
    const interval = setInterval(fetchTemp, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="watchPageFull" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '64px', paddingTop: '20px' }}>
      <LiveStream addShells={addShells} shells={shells} currentUser={currentUser} />

      {/* Kids Reef Explorer Game Instructions */}
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
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 2px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎮</span> Reef Explorer Game
          </h4>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#b7cad6', lineHeight: '1.5' }}>
            Watch the live reef stream! Tap directly on the real fish swimming in the video to earn <strong>1 Shell</strong> (+1 🐚). Tapping empty seawater earns nothing. Earn shells to Level Up your explorer rank — and compete in the monthly Championship on the Kids Club page!
          </p>
        </div>
      </div>

      {/* Live Ocean Telemetry Dashboard */}
      <div style={{
        maxWidth: '1220px', margin: '0 auto', width: '90%',
        alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 4px 0' }}>
          <h4 style={{ textAlign: 'left', margin: 0, fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>
            Live Ocean Data
          </h4>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '0.65rem', fontWeight: '900', color: '#39ff88',
            background: 'rgba(57,255,136,0.08)', border: '1px solid rgba(57,255,136,0.25)',
            padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#39ff88', animation: 'blinkGreen 1.5s infinite', display: 'inline-block' }} />
            NOAA Live
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {/* Water Temperature */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Water Temp</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              {tempStatus === 'loading' && <span style={{ fontSize: '1rem', color: '#b7cad6' }}>Loading…</span>}
              {tempStatus === 'ok'      && <>{waterTemp} <span style={{ fontSize: '1rem', color: '#22d3ee', fontWeight: '800' }}>°F</span></>}
              {tempStatus === 'error'   && <span style={{ fontSize: '1.1rem', color: '#b7cad6' }}>Unavailable</span>}
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: tempStatus === 'ok' ? `${Math.min(100, ((parseFloat(waterTemp) - 60) / 30) * 100)}%` : '0%', height: '100%', background: 'linear-gradient(90deg, #064c72, #22d3ee)', transition: 'width 1s ease' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#39ff88', display: 'block', marginTop: '6px' }}>
              {tempStatus === 'ok' ? '✓ Live — NOAA Station 8722670 (Lake Worth Pier, FL)' : tempStatus === 'loading' ? 'Fetching from NOAA…' : 'NOAA data temporarily unavailable'}
            </span>
          </div>

          {/* Visibility */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visibility</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              — <span style={{ fontSize: '1rem', color: '#b7cad6', fontWeight: '800' }}>FT</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #064c72, #39ff88)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Live camera data — available when cam is online</span>
          </div>

          {/* Salinity */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salinity</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              — <span style={{ fontSize: '0.9rem', color: '#b7cad6', fontWeight: '800' }}>PPT</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #064c72, #22d3ee)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Sensor online when camera connects</span>
          </div>

          {/* Current Speed */}
          <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Speed</span>
            <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff', margin: '6px 0', fontFamily: 'Outfit, sans-serif' }}>
              — <span style={{ fontSize: '0.9rem', color: '#b7cad6', fontWeight: '800' }}>KTS</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #064c72, #39ff88)' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: '#b7cad6', display: 'block', marginTop: '6px' }}>Sensor online when camera connects</span>
          </div>
        </div>
      </div>

      {/* Shell Bank & Club Card */}
      <div style={{
        maxWidth: '1220px', margin: '0 auto', width: '90%',
        alignSelf: 'center',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
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
          justifyContent: 'space-between',
          minHeight: '380px'
        }}>
          {!exchangeSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', color: '#fff', fontWeight: '800', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.01em' }}>
                  <span>🏦</span> Kids Shell Bank &amp; Club
                </h4>

                {/* Balance Summary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Shells Balance</span>
                    <strong style={{ fontSize: '1.3rem', color: '#22d3ee', fontFamily: 'Outfit, sans-serif' }}>🐚 {shells}</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Explorer Status</span>
                    <strong style={{ fontSize: '1.05rem', color: '#39ff88', fontFamily: 'Outfit, sans-serif' }}>
                      {shells >= 500 ? '👑 Master Scout' : '🐠 Active Scout'}
                    </strong>
                  </div>
                </div>

                {/* Progress bar towards Next Level */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#b7cad6', marginBottom: '4px', fontWeight: '800' }}>
                    <span>Next Rank: {levelInfo.target ? levelInfo.title : 'Grand Master'}</span>
                    <span>{levelInfo.target ? `${shells} / ${levelInfo.target} 🐚` : `${shells} 🐚`}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: levelInfo.target ? `${Math.min(100, Math.floor(((shells - levelInfo.prevTarget) / (levelInfo.target - levelInfo.prevTarget)) * 100))}%` : '100%',
                      height: '100%',
                      background: !levelInfo.target ? '#39ff88' : 'linear-gradient(90deg, #064c72, #22d3ee)',
                      boxShadow: !levelInfo.target ? '0 0 8px #39ff88' : 'none',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (shells < 200) return;
                    addShells(-200);
                    setExchangeSuccess({ type: 'badge', amount: 200 });
                  }}
                  disabled={shells < 200}
                  style={{
                    background: shells >= 200 ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(34, 211, 238, 0.25)',
                    color: shells >= 200 ? '#fff' : '#b7cad6',
                    padding: '10px', borderRadius: '10px',
                    fontSize: '0.78rem', fontWeight: '800',
                    cursor: shells >= 200 ? 'pointer' : 'default',
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                    opacity: shells >= 200 ? 1 : 0.6
                  }}
                >
                  {shells >= 200 ? '🏆 Unlock Master Explorer Badge (200 Shells)' : '🔒 Need 200 Shells for Explorer Badge'}
                </button>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    if (shells < 100) return;
                    addShells(-100);
                    setExchangeSuccess({ type: 'donation', amount: 100 });
                  }}
                  disabled={shells < 100}
                  style={{
                    background: 'rgba(57, 255, 136, 0.08)',
                    border: '1.5px solid rgba(57, 255, 136, 0.25)',
                    color: shells >= 100 ? '#39ff88' : '#b7cad6',
                    padding: '10px', borderRadius: '10px',
                    fontSize: '0.75rem', fontWeight: '800',
                    cursor: shells >= 100 ? 'pointer' : 'default',
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                    opacity: shells >= 100 ? 1 : 0.5
                  }}
                >
                  {shells >= 100 ? '🐠 Donate 100 Shells to Plant a Coral Reef' : '🔒 Need 100 Shells to Donate'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '100%' }}>
              <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 10px rgba(57, 255, 136, 0.3))' }}>
                {exchangeSuccess.type === 'badge' ? '🏆' : '🪸'}
              </span>
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                {exchangeSuccess.type === 'badge' ? 'Explorer Badge Unlocked!' : 'Thank you, Conservationist!'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.4' }}>
                {exchangeSuccess.type === 'badge' ? (
                  <>Congratulations! You traded <strong style={{ color: '#fff' }}>{exchangeSuccess.amount} shells</strong> to unlock the special <strong style={{ color: '#22d3ee' }}>Master Explorer Badge</strong>!</>
                ) : (
                  <>Fantastic! You donated <strong style={{ color: '#fff' }}>{exchangeSuccess.amount} shells</strong> to help plant a virtual coral reef structure!</>
                )}
              </p>
              <button
                onClick={() => setExchangeSuccess(null)}
                style={{ background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)', border: '1.5px solid rgba(34, 211, 238, 0.35)', color: '#fff', padding: '8px 20px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: '8px' }}
              >
                Back to Bank 🏦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
