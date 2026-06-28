import { useState, useEffect } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Award, CheckCircle2, XCircle, RotateCcw, Trophy, Clock, Sparkles } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import RewardsPage from './RewardsPage.jsx';

export default function KidsClubPage({
  shells = 120,
  setShells,
  onDonate,
  communityDonations = { Kingston: 3420, Saltwater: 5840 },
  userDonations = { Kingston: 0, Saltwater: 0 },
  currentUser,
  onOpenAuth,
  addShells
}) {
  const [activeSubTab, setActiveSubTab] = useState('missions');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [championshipEmail, setChampionshipEmail] = useState('');
  const [championshipSubscribed, setChampionshipSubscribed] = useState(false);

  const revealRef = useScrollReveal();

  // Championship countdown timer
  const getTimeLeft = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diff = endOfMonth - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, []);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="pageContainer kidsPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>

      {/* Shelly Mascot Guide */}
      <div style={{
        margin: '0 auto 30px auto',
        background: 'rgba(6, 32, 49, 0.55)',
        border: '2.5px solid rgba(34, 211, 238, 0.35)',
        borderRadius: '24px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(12px)',
        textAlign: 'left',
        flexWrap: 'wrap'
      }}>
        <div style={{
          fontSize: '3.2rem',
          animation: 'bounceSlow 2.5s infinite ease-in-out',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(34, 211, 238, 0.12)',
          width: '74px', height: '74px',
          borderRadius: '50%',
          border: '2.5px solid #22d3ee',
          boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
        }}>🐢</div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.2px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '14px 20px',
            color: '#fff',
            fontSize: '0.92rem',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: '#22d3ee', display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>
              Shelly the Sea Turtle:
            </strong>
            "Hey Explorer! 🌊 Tap fish on the live stream to earn Shells, answer trivia questions, and climb the Championship leaderboard to win a real Explorer Adventure Kit!"
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)', margin: '0 0 12px 0' }}>
          <Award size={14} /> Kids Ocean Adventure
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '0.01em' }}>
          Marine Explorer Club
        </h1>
        <p style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
          Tap fish on the live stream, answer trivia, and compete to win real prizes every month!
        </p>
      </div>

      {/* Sub-tab toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(6, 32, 49, 0.65)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          padding: '4px', borderRadius: '30px',
          backdropFilter: 'blur(8px)'
        }}>
          <button
            onClick={() => setActiveSubTab('missions')}
            style={{
              background: activeSubTab === 'missions' ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'transparent',
              border: 'none', color: '#fff',
              padding: '8px 24px', borderRadius: '24px',
              fontSize: '0.85rem', fontWeight: '800',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >🏆 Championship &amp; Trivia</button>
          <button
            onClick={() => setActiveSubTab('rewards')}
            style={{
              background: activeSubTab === 'rewards' ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'transparent',
              border: 'none', color: '#fff',
              padding: '8px 24px', borderRadius: '24px',
              fontSize: '0.85rem', fontWeight: '800',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >🎁 Redeem Rewards</button>
        </div>
      </div>

      {activeSubTab === 'missions' ? (
        <>
          {/* ── Championship Card (Centered for balance) ───────────────── */}
          <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', width: '100%' }}>
            <TiltCard className="quizCard" revealRef={revealRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', color: '#fff', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Championship
                  </h3>
                  <button
                    onClick={() => setShowRulesModal(true)}
                    style={{
                      background: 'rgba(34, 211, 238, 0.1)',
                      border: '1px solid rgba(34, 211, 238, 0.3)',
                      color: '#22d3ee', padding: '3px 10px',
                      borderRadius: '12px', fontSize: '0.7rem',
                      fontWeight: '800', cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 211, 238, 0.1)'}
                  >Prizes &amp; Rules</button>
                </div>

                {/* Season badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(57, 255, 136, 0.1)', border: '1px solid rgba(57, 255, 136, 0.25)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.62rem', color: '#39ff88', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {currentMonthName} Season Active
                  </div>
                  <div style={{ background: 'rgba(255, 168, 39, 0.1)', border: '1px solid rgba(255, 168, 39, 0.25)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.62rem', color: '#ffa827', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} />
                    <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.5' }}>
                  First explorers to reach the <strong>5,000 Shells Milestone 🐚</strong> and the highest overall rank this month win a real <strong>Explorer Adventure Kit</strong>!
                </p>

                {/* Milestone Progress */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                    <span style={{ color: '#b7cad6', fontWeight: '700' }}>Your Milestone Progress</span>
                    <span style={{ color: '#22d3ee', fontWeight: '800' }}>{Math.min(100, Math.floor((shells / 5000) * 100))}% ({shells}/5000)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (shells / 5000) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #064c72, #39ff88)', boxShadow: '0 0 4px rgba(57, 255, 136, 0.5)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {/* Leaderboard */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#b7cad6', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Top Spotters</span>
                    <span>Shells (Lvl)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#fff', fontWeight: '600' }}>
                    <span>🥇 1. SpotterSam</span>
                    <span style={{ color: '#39ff88' }}>4,820 🐚 (Lvl 4)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#fff', fontWeight: '600' }}>
                    <span>🥈 2. AquaKatie</span>
                    <span style={{ color: '#39ff88' }}>3,940 🐚 (Lvl 4)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#fff', fontWeight: '600' }}>
                    <span>🥉 3. ReefRunner</span>
                    <span style={{ color: '#b7cad6' }}>3,150 🐚 (Lvl 2)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#22d3ee', fontWeight: '900', borderTop: '1px dashed rgba(34, 211, 238, 0.15)', paddingTop: '6px' }}>
                    <span>🌟 You ({currentUser ? currentUser.username : 'Explorer'})</span>
                    <span>{shells} 🐚 (Lvl 1)</span>
                  </div>
                </div>
              </div>

              {/* Join form */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', marginTop: 'auto' }}>
                {!championshipSubscribed ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (championshipEmail) setChampionshipSubscribed(true); }}
                    style={{ display: 'flex', gap: '6px' }}
                  >
                    <input
                      type="email"
                      placeholder="Enter email to join..."
                      value={championshipEmail}
                      onChange={(e) => setChampionshipEmail(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      required
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1.5px solid rgba(34, 211, 238, 0.2)',
                        borderRadius: '8px', padding: '6px 10px',
                        color: '#fff', fontSize: '0.75rem',
                        fontFamily: 'Outfit, sans-serif', outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                        border: 'none', color: '#fff',
                        borderRadius: '8px', padding: '6px 14px',
                        fontSize: '0.75rem', fontWeight: '800',
                        cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                      }}
                    >Join</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#39ff88', fontSize: '0.72rem', fontWeight: '800' }}>
                    <CheckCircle2 size={14} /> Registered! We'll email you at {championshipEmail}.
                  </div>
                )}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* ── How to Play & Monthly Winner Rules ──────── */}
        <div style={{
          marginTop: '30px',
          padding: '28px',
          background: 'rgba(6, 32, 49, 0.45)',
          border: '1.5px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: '24px',
          textAlign: 'left'
        }}>
          {/* Section title */}
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📖 How to Play &amp; Monthly Winner Rules
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
              Everything you need to know to earn Shells, level up, and become the monthly champion!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
              <div style={{ background: 'rgba(34, 211, 238, 0.06)', border: '1px solid rgba(34, 211, 238, 0.18)', borderRadius: '14px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: '800', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🐟 Tap Game Rules
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
                  <li>Go to the <strong style={{ color: '#fff' }}>Watch Live</strong> page and look at the live reef stream.</li>
                  <li>Tap or click directly <strong style={{ color: '#fff' }}>on a real fish</strong> swimming in the video to earn <strong style={{ color: '#22d3ee' }}>+1 Shell 🐚</strong>.</li>
                  <li>Tapping <strong style={{ color: '#f43f5e' }}>empty water</strong> earns nothing — be accurate!</li>
                  <li>You can tap as many fish as you spot — there is <strong style={{ color: '#fff' }}>no daily limit</strong>.</li>
                  <li>Fish must be <strong style={{ color: '#fff' }}>real fish in the live feed</strong>. Pre-recorded clips are not counted.</li>
                </ul>
              </div>

              {/* Block 2 — Shell Levels */}
              <div style={{ background: 'rgba(57, 255, 136, 0.06)', border: '1px solid rgba(57, 255, 136, 0.18)', borderRadius: '14px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: '800', color: '#39ff88', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⭐ Explorer Level Status
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {[
                    { lvl: 'Lvl 1', title: 'Reef Buddy 🐠',            range: '0 – 499 🐚',   color: '#b7cad6' },
                    { lvl: 'Lvl 2', title: 'Coral Explorer 🪸',        range: '500 – 1,499 🐚', color: '#22d3ee' },
                    { lvl: 'Lvl 3', title: 'Sea Turtle Sidekick 🐢',   range: '1,500 – 3,499 🐚', color: '#39ff88' },
                    { lvl: 'Lvl 4', title: 'Dolphin Defender 🐬',      range: '3,500 – 6,999 🐚', color: '#ffa827' },
                    { lvl: 'Lvl 5', title: 'Ocean Superhero 🦸',       range: '7,000 – 11,999 🐚', color: '#f59e0b' },
                    { lvl: 'Lvl 6', title: 'Sea King & Queen 👑',       range: '12,000+ 🐚',   color: '#ef4444' },
                  ].map(row => (
                    <div key={row.lvl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '5px 10px' }}>
                      <span style={{ color: row.color, fontWeight: '900', minWidth: '44px' }}>{row.lvl}</span>
                      <span style={{ color: '#fff', fontWeight: '700', flex: 1, paddingLeft: '8px' }}>{row.title}</span>
                      <span style={{ color: '#b7cad6', fontSize: '0.7rem' }}>{row.range}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block 3 — Monthly Winner Rules */}
              <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '14px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: '800', color: '#ffa827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏆 Monthly Winner Qualification
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', borderLeft: '3px solid #39ff88' }}>
                    <strong style={{ color: '#39ff88', display: 'block', marginBottom: '2px' }}>🎯 Milestone Winner</strong>
                    The <strong style={{ color: '#fff' }}>first explorer</strong> each month to reach <strong style={{ color: '#22d3ee' }}>5,000 Shells</strong> wins instantly — no matter your leaderboard rank!
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', borderLeft: '3px solid #ffa827' }}>
                    <strong style={{ color: '#ffa827', display: 'block', marginBottom: '2px' }}>👑 Leaderboard Winner</strong>
                    The explorer ranked <strong style={{ color: '#fff' }}>#1 on the leaderboard</strong> at midnight on the last day of the month wins the prize.
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px', borderLeft: '3px solid #22d3ee' }}>
                    <strong style={{ color: '#22d3ee', display: 'block', marginBottom: '2px' }}>📋 Fair Play Rules</strong>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>Only real fish taps on the live stream count.</li>
                      <li>Cheating or exploits = instant disqualification.</li>
                      <li>Winners must have a registered account (email required).</li>
                      <li>Prizes shipped within 14 days of month end.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Block 4 — Monthly Prizes */}
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.18)', borderRadius: '14px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: '800', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎁 Monthly Prizes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
                  {[
                    { emoji: '🎒', title: 'Explorer Adventure Kit', desc: 'Kids binoculars + marine life guide + SaltwaterCam sticker pack. Shipped to your door!' },
                    { emoji: '🏅', title: 'Champion Profile Badge', desc: 'A shiny digital badge displayed on your profile for the whole month — so everyone sees your win!' },
                    { emoji: '👕', title: 'Conservation T-Shirt', desc: 'Free official organic cotton SaltwaterCam T-shirt in your size.' },
                    { emoji: '🌊', title: 'Hall of Fame Listing', desc: 'Your name + score added permanently to the SaltwaterCam Ocean Academy Hall of Fame.' },
                  ].map(p => (
                    <div key={p.title} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.emoji}</span>
                      <div>
                        <strong style={{ color: '#fff', display: 'block', marginBottom: '2px', fontSize: '0.84rem' }}>{p.title}</strong>
                        <span style={{ fontSize: '0.78rem' }}>{p.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <RewardsPage
          isNested={true}
          shells={shells}
          setShells={setShells}
          onDonate={onDonate}
          communityDonations={communityDonations}
          userDonations={userDonations}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
        />
      )}

      {/* Prizes & Rules Modal */}
      {showRulesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(2, 14, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(6, 32, 49, 0.95)',
            border: '2px solid rgba(34, 211, 238, 0.4)',
            borderRadius: '20px', padding: '28px',
            maxWidth: '500px', width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '12px', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy color="#f59e0b" size={20} /> Monthly Championship
              </h3>
              <button onClick={() => setShowRulesModal(false)} style={{ background: 'none', border: 'none', color: '#b7cad6', fontSize: '1.2rem', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#b7cad6', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#ffa827" /> Rewards &amp; Prizes
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>🎒 <strong>Ocean Explorer Kit</strong>: Shipped straight to your door! Includes professional kids binoculars, marine life reference guide, and saltwatercam gear.</li>
                  <li>🐚 <strong>Champion Profile Badge</strong>: A shiny, persistent digital badge highlighting your monthly victory.</li>
                  <li>👕 <strong>Conservation Tee</strong>: Free official organic cotton Saltwatercam T-shirt.</li>
                </ul>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div>
                <h4 style={{ color: '#fff', margin: '0 0 6px 0', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} color="#22d3ee" /> How to Win
                </h4>
                <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Target Milestone</strong>: The first explorer each month to hit <strong>5,000 Shells</strong> instantly wins.</li>
                  <li><strong>Highest Level</strong>: The player who maintains the #1 spot on the leaderboard at month's end wins.</li>
                  <li><strong>Rules</strong>: Only shell taps on real fish count. Tapping empty water awards no progress.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                border: 'none', color: '#fff',
                padding: '12px', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: '800',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                marginTop: '24px', boxShadow: '0 4px 15px rgba(34, 211, 238, 0.25)'
              }}
            >Let's Go! 🐚</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
