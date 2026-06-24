import { useState, useEffect } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Gift, Award, Download, Tag, Coins, Heart, X, Printer, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function RewardsPage({ 
  shells = 120, 
  setShells,
  onDonate, 
  communityDonations = { Kingston: 3420, Saltwater: 5840 },
  userDonations = { Kingston: 0, Saltwater: 0 },
  currentUser,
  onOpenAuth,
  isNested = false
}) {
  // Sync XP from KidsClubPage local storage key so they are connected
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('swc_kids_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [redeemedItems, setRedeemedItems] = useState([]);
  
  // Donation presets and inputs
  const [kingstonAmount, setKingstonAmount] = useState('');
  const [saltwaterAmount, setSaltwaterAmount] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);
  
  const revealRef = useScrollReveal();
  const rewardsList = siteContent.rewards;

  useEffect(() => {
    localStorage.setItem('swc_kids_xp', xp.toString());
  }, [xp]);

  const claimXpBonus = () => {
    if (claimedBonus) return;
    setXp(prev => prev + 500);
    setClaimedBonus(true);
  };

  const handleRedeem = (item) => {
    if (xp < item.cost || redeemedItems.includes(item.id)) return;
    setXp(prev => prev - item.cost);
    setRedeemedItems(prev => [...prev, item.id]);
  };

  const handleDownload = (item) => {
    if (item.id === 'coupon-gear') {
      alert('Your 15% off coupon code is: INLET15. Present this at local Lantana dive shops!');
    } else {
      // Direct link to download the public asset
      const link = document.createElement('a');
      link.href = item.image;
      link.download = `${item.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const executeDonation = (charityId, amountStr, setAmountInput) => {
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid shell amount to pledge.');
      return;
    }
    if (shells < amount) {
      alert('Insufficient shells in your wallet. Scan fish and debris in the Watch Live feed to earn more!');
      return;
    }

    const success = onDonate(charityId, amount);
    if (success) {
      // Trigger receipt modal
      const newReceipt = {
        receiptId: `SWC-${Math.floor(100000 + Math.random() * 900000)}`,
        charityName: charityId === 'Kingston' ? 'Kingston K9 Search & Rescue' : 'SaltwaterCam Conservation Fund',
        charityDomain: charityId === 'Kingston' ? 'Kingstonk9.com' : 'saltwatercam.com',
        amount: amount,
        valueDollars: (amount / 10).toFixed(2),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        user: currentUser ? currentUser.username : 'Guest Explorer',
        avatar: currentUser ? currentUser.avatar : '🐚'
      };
      setActiveReceipt(newReceipt);
      setAmountInput('');
    }
  };

  // Charity targets and goals
  const KingstonGoal = 5000;
  const SaltwaterGoal = 10000;

  const kingstonPercent = Math.min(100, (communityDonations.Kingston / KingstonGoal) * 100);
  const saltwaterPercent = Math.min(100, (communityDonations.Saltwater / SaltwaterGoal) * 100);

  return (
    <div className={isNested ? "rewardsPage" : "pageContainer rewardsPage"} style={isNested ? { color: '#fff' } : { maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      {!isNested && (
        <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
            <Gift size={14} /> Rewards & Conservation
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
            Explorer Rewards & Pledges
          </h1>
          <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
            Redeem wallpapers with your XP, or pledge your collected livestream shells to support real-world ocean conservation efforts!
          </p>
        </div>
      )}

      {/* Stateful XP & Shell Wallet Status Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* XP Wallet */}
        <div style={{
          padding: '24px',
          background: 'rgba(6, 32, 49, 0.55)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
              <Coins size={32} style={{ color: '#22d3ee' }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: '800' }}>Rewards Wallet</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#b7cad6' }}>
                Current Balance: <strong style={{ color: '#fff', fontSize: '1rem' }}>{xp} XP</strong>
              </p>
            </div>
          </div>

          {!claimedBonus ? (
            <button 
              onClick={claimXpBonus}
              style={{
                background: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)',
                border: '1.5px solid rgba(57, 255, 136, 0.35)',
                padding: '10px 18px',
                borderRadius: '30px',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(57, 255, 136, 0.25)',
                transition: 'all 0.3s ease'
              }}
            >
              CLAIM 500 XP
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#39ff88', fontWeight: '800', border: '1.5px solid rgba(57, 255, 136, 0.3)', padding: '6px 14px', borderRadius: '20px', background: 'rgba(57, 255, 136, 0.05)' }}>
              ✓ CLAIMED
            </span>
          )}
        </div>

        {/* Shells Wallet */}
        <div style={{
          padding: '24px',
          background: 'rgba(6, 32, 49, 0.55)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
              <span style={{ fontSize: '2.1rem' }}>🐚</span>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: '800' }}>Simulated Shell Wallet</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#b7cad6' }}>
                Current Tokens: <strong style={{ color: '#22d3ee', fontSize: '1.1rem' }}>{shells} 🐚</strong>
              </p>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#b7cad6', borderLeft: '1.5px solid rgba(255, 255, 255, 0.1)', paddingLeft: '12px' }}>
            Earned by scanning marine life and clearing ocean trash.
          </div>
        </div>
      </div>

      {/* V2 Non-Profit Donation Dashboard */}
      <section style={{
        maxWidth: '1220px',
        margin: '0 auto 48px auto',
        padding: '32px',
        background: 'rgba(6, 32, 49, 0.4)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '24px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={20} style={{ color: '#ef4444', filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))' }} />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '0.01em' }}>
            Simulated Ocean Pledging Dashboard
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#b7cad6', margin: '0 0 28px 0', lineHeight: '1.5', maxWidth: '800px' }}>
          Pledge your collected shells to these approved non-profit organizations. 
          For every <strong>10 shells (🐚) pledged, we record $1.00 of simulated conservation funding</strong> for telemetry infrastructure.
        </p>

        {/* Auth warning */}
        {!currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1.5px solid rgba(245, 158, 11, 0.25)',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: '700' }}>
                You are currently donating as Guest. Log in or create a profile to link pledges to your Explorer ID!
              </span>
            </div>
            <button 
              onClick={onOpenAuth}
              style={{
                background: '#f59e0b',
                color: '#03111c',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: '900',
                fontSize: '0.78rem',
                fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Login / Register
            </button>
          </div>
        )}

        {/* Charity Donation Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
          {/* Charity 1: Kingston K9 */}
          <div style={{
            background: 'rgba(3, 17, 28, 0.45)',
            border: '1.5px solid rgba(34, 211, 238, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800' }}>
                    Kingston K9 Search & Rescue
                  </h3>
                  <a 
                    href="https://Kingstonk9.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: '800', textDecoration: 'none' }}
                  >
                    Kingstonk9.com ↗
                  </a>
                </div>
                <span style={{ fontSize: '1.8rem' }}>🐕</span>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
                Supporting search-and-rescue dog training programs and emergency water safety operations.
              </p>
            </div>

            {/* Community Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#b7cad6', marginBottom: '6px' }}>
                <span>Community Goal Progress</span>
                <strong>{communityDonations.Kingston} / {KingstonGoal} 🐚 ({kingstonPercent.toFixed(0)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${kingstonPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #064c72, #22d3ee)',
                  boxShadow: '0 0 8px rgba(34, 211, 238, 0.4)',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#b7cad6' }}>
                <span>Your Pledges: <strong>{userDonations.Kingston} 🐚</strong></span>
                <span>Value: <strong>${(userDonations.Kingston / 10).toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Pledge Inputs */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {/* presets */}
                <button 
                  onClick={() => setKingstonAmount('20')} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +20 🐚
                </button>
                <button 
                  onClick={() => setKingstonAmount('50')} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +50 🐚
                </button>
                <button 
                  onClick={() => setKingstonAmount(Math.min(shells, 100).toString())} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +100 🐚
                </button>
                <button 
                  onClick={() => setKingstonAmount(shells.toString())} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', borderRadius: '6px', color: '#22d3ee', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Max
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number"
                  placeholder="Shell Amount"
                  value={kingstonAmount}
                  onChange={(e) => setKingstonAmount(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={() => executeDonation('Kingston', kingstonAmount, setKingstonAmount)}
                  style={{
                    background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                    border: '1.5px solid rgba(34, 211, 238, 0.35)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '10px 16px',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  Pledge
                </button>
              </div>
            </div>
          </div>

          {/* Charity 2: SaltwaterCam */}
          <div style={{
            background: 'rgba(3, 17, 28, 0.45)',
            border: '1.5px solid rgba(34, 211, 238, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800' }}>
                    SaltwaterCam Conservation
                  </h3>
                  <a 
                    href="https://saltwatercam.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: '800', textDecoration: 'none' }}
                  >
                    saltwatercam.com ↗
                  </a>
                </div>
                <span style={{ fontSize: '1.8rem' }}>🌊</span>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.5' }}>
                Funding telemetry sensors, water chemistry monitors, and public 4K camera installations on Boynton reefs.
              </p>
            </div>

            {/* Community Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#b7cad6', marginBottom: '6px' }}>
                <span>Community Goal Progress</span>
                <strong>{communityDonations.Saltwater} / {SaltwaterGoal} 🐚 ({saltwaterPercent.toFixed(0)}%)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${saltwaterPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #064c72, #39ff88)',
                  boxShadow: '0 0 8px rgba(57, 255, 136, 0.4)',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#b7cad6' }}>
                <span>Your Pledges: <strong>{userDonations.Saltwater} 🐚</strong></span>
                <span>Value: <strong>${(userDonations.Saltwater / 10).toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Pledge Inputs */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <button 
                  onClick={() => setSaltwaterAmount('20')} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +20 🐚
                </button>
                <button 
                  onClick={() => setSaltwaterAmount('50')} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +50 🐚
                </button>
                <button 
                  onClick={() => setSaltwaterAmount(Math.min(shells, 100).toString())} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  +100 🐚
                </button>
                <button 
                  onClick={() => setSaltwaterAmount(shells.toString())} 
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: 'rgba(57, 255, 136, 0.1)', border: '1px solid rgba(57, 255, 136, 0.25)', borderRadius: '6px', color: '#39ff88', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Max
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number"
                  placeholder="Shell Amount"
                  value={saltwaterAmount}
                  onChange={(e) => setSaltwaterAmount(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={() => executeDonation('Saltwater', saltwaterAmount, setSaltwaterAmount)}
                  style={{
                    background: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)',
                    border: '1.5px solid rgba(57, 255, 136, 0.35)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '10px 16px',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  Pledge
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Catalog Grid */}
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: '900', color: '#fff', textAlign: 'left', marginBottom: '20px' }}>
        Digital Rewards Shop
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '64px' }}>
        {rewardsList.map((item) => {
          const isRedeemed = redeemedItems.includes(item.id);
          const canAfford = xp >= item.cost;
          
          return (
            <TiltCard 
              key={item.id} 
              revealRef={revealRef}
              style={{
                padding: '24px',
                background: 'rgba(6, 32, 49, 0.45)',
                border: isRedeemed ? '1.5px solid #39ff88' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isRedeemed ? '0 10px 30px rgba(57, 255, 136, 0.08)' : 'none'
              }}
            >
              <div>
                {/* Reward Image container */}
                <div style={{
                  height: '140px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.2)',
                  marginBottom: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    loading="lazy"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: isRedeemed ? '#39ff88' : '#22d3ee', fontFamily: 'Outfit, sans-serif' }}>
                    {item.cost} XP
                  </span>
                </div>
                
                <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.45' }}>
                  {item.desc}
                </p>
              </div>

              <div>
                {isRedeemed ? (
                  <button 
                    onClick={() => handleDownload(item)}
                    style={{
                      width: '100%',
                      background: 'rgba(57, 255, 136, 0.08)',
                      border: '1.5px solid #39ff88',
                      padding: '10px',
                      borderRadius: '8px',
                      color: '#39ff88',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.id === 'coupon-gear' ? <Tag size={16} /> : <Download size={16} />}
                    {item.id === 'coupon-gear' ? 'VIEW COUPON CODE' : 'DOWNLOAD REWARD'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    style={{
                      width: '100%',
                      background: canAfford ? '#064c72' : 'rgba(255,255,255,0.03)',
                      border: canAfford ? '1.5px solid #22d3ee' : '1px solid rgba(255,255,255,0.05)',
                      padding: '10px',
                      borderRadius: '8px',
                      color: canAfford ? '#fff' : '#b7cad6',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: canAfford ? 'pointer' : 'default',
                      opacity: canAfford ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {canAfford ? 'REDEEM ITEM' : 'INSUFFICIENT XP'}
                  </button>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Printable Receipt Modal Overlay */}
      {activeReceipt && (
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
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.95) 0%, rgba(3, 17, 28, 0.98) 100%)',
            border: '2px solid rgba(34, 211, 238, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 211, 238, 0.25)',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setActiveReceipt(null)}
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
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Receipt Content to Print */}
            <div id="printable-receipt-card" style={{
              background: 'linear-gradient(145deg, #041b2b, #020e17)',
              border: '1.5px dashed rgba(34, 211, 238, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '12px',
              marginBottom: '24px',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(57, 255, 136, 0.1)',
                  border: '2px solid #39ff88',
                  color: '#39ff88',
                }}>
                  <Sparkles size={28} style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 136, 0.5))' }} />
                </div>
              </div>

              <span style={{ fontSize: '0.72rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Conservation Pledge Receipt
              </span>
              
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '4px 0 16px 0' }}>
                Pledge Confirmed!
              </h3>

              {/* Grid detail */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>Explorer:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{activeReceipt.avatar} {activeReceipt.user}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>Beneficiary:</span>
                  <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{activeReceipt.charityName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>Pledged Shells:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{activeReceipt.amount} 🐚</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>Simulated Value:</span>
                  <span style={{ color: '#39ff88', fontWeight: 'bold' }}>${activeReceipt.valueDollars} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>Date:</span>
                  <span style={{ color: '#fff' }}>{activeReceipt.date}</span>
                </div>
              </div>

              {/* Footer text */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.62rem', color: '#b7cad6', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  RECEIPT ID: {activeReceipt.receiptId}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#22d3ee', fontStyle: 'italic', marginTop: '6px' }}>
                  Thank you for helping protect Boynton Reef! 🌊
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(255, 255, 255, 0.1)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                <Printer size={16} /> Print Card
              </button>

              <button
                onClick={() => {
                  alert('Thank you! Your simulated receipt is downloaded to local clipboard.');
                  setActiveReceipt(null);
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)',
                  border: '1.5px solid rgba(57, 255, 136, 0.35)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
