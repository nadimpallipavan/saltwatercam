import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Gift, Download, Tag, Heart, X, Printer, Sparkles, ShieldAlert, CheckCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

// Reward items use Shells (🐚) as currency — earned by tapping fish on the live stream
const shellRewards = [
  {
    id: 'wallpaper-reef',
    title: 'Lantana Reef Wallpaper',
    cost: 50,
    emoji: '🖼️',
    image: 'watch-live-bg-clean.png',
    desc: 'High-resolution 4K digital wallpaper of the Lantana Reef live feed. Perfect for your desktop or phone!'
  },
  {
    id: 'badge-marine-scholar',
    title: 'Marine Scholar Badge',
    cost: 100,
    emoji: '🏅',
    image: 'logo-circle.png',
    desc: 'A premium digital badge to show off your reef knowledge. Share it on social media or your profile!'
  },
  {
    id: 'coupon-gear',
    title: '15% Off Ocean Gear Coupon',
    cost: 200,
    emoji: '🎟️',
    image: 'logo-text.png',
    desc: 'Redeemable at local Boynton Beach and Lantana surf and dive shops. Great for young explorers!'
  }
];

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
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [kingstonAmount, setKingstonAmount] = useState('');
  const [saltwaterAmount, setSaltwaterAmount] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  const revealRef = useScrollReveal();

  const KingstonGoal = 5000;
  const SaltwaterGoal = 10000;
  const kingstonPercent = Math.min(100, (communityDonations.Kingston / KingstonGoal) * 100);
  const saltwaterPercent = Math.min(100, (communityDonations.Saltwater / SaltwaterGoal) * 100);

  const handleRedeem = (item) => {
    if (shells < item.cost || redeemedItems.includes(item.id)) return;
    if (setShells) setShells(prev => prev - item.cost);
    setRedeemedItems(prev => [...prev, item.id]);
  };

  const handleDownload = (item) => {
    if (item.id === 'coupon-gear') {
      alert('Your 15% off coupon code is: INLET15. Present this at local Lantana dive shops!');
    } else {
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
      alert('Not enough shells! Tap fish on the Watch Live page to earn more 🐟');
      return;
    }
    const success = onDonate(charityId, amount);
    if (success) {
      const newReceipt = {
        receiptId: `SWC-${Math.floor(100000 + Math.random() * 900000)}`,
        charityName: charityId === 'Kingston' ? 'Kingston K9 Search & Rescue' : 'SaltwaterCam Conservation Fund',
        amount,
        valueDollars: (amount / 10).toFixed(0),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        user: currentUser ? currentUser.username : 'Guest Explorer',
        avatar: currentUser ? currentUser.avatar : '🐚'
      };
      setActiveReceipt(newReceipt);
      setAmountInput('');
    }
  };

  const card = {
    padding: '24px',
    background: 'rgba(6, 32, 49, 0.45)',
    border: '1.5px solid rgba(34, 211, 238, 0.2)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    textAlign: 'left'
  };

  return (
    <div
      className={isNested ? 'rewardsPage' : 'pageContainer rewardsPage'}
      style={isNested
        ? { color: '#fff', fontFamily: 'Outfit, sans-serif' }
        : { maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff', fontFamily: 'Outfit, sans-serif' }
      }
    >
      {/* Page Header — only shown when standalone (not nested inside Kids Club) */}
      {!isNested && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)', margin: '0 0 12px 0' }}>
            <Gift size={14} /> Rewards &amp; Conservation
          </p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '0.01em' }}>
            Explorer Rewards &amp; Pledges
          </h1>
          <p style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
            Spend your 🐚 Shells to unlock digital rewards, or pledge them to support real ocean conservation!
          </p>
        </div>
      )}

      {/* ── Shell Wallet Banner ─────────────────────────── */}
      <div style={{
        ...card,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '30px',
        background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.7) 0%, rgba(6, 50, 76, 0.5) 100%)',
        border: '1.5px solid rgba(34, 211, 238, 0.35)',
        boxShadow: '0 8px 32px rgba(34, 211, 238, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(34, 211, 238, 0.25)', fontSize: '2rem', lineHeight: 1 }}>
            🐚
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', fontWeight: '800' }}>Your Shell Wallet</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b7cad6' }}>
              Earned by tapping fish on the <strong style={{ color: '#22d3ee' }}>Watch Live</strong> page
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#22d3ee', letterSpacing: '-0.01em' }}>
            {shells} <span style={{ fontSize: '1.4rem' }}>🐚</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#b7cad6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Available Shells
          </div>
        </div>
      </div>

      {/* ── Digital Rewards Shop ────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '1.3rem' }}>🎁</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: '900', color: '#fff', margin: 0 }}>
            Digital Rewards Shop
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#b7cad6', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: '20px', fontWeight: '700' }}>
            Spend Shells
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {shellRewards.map((item) => {
            const isRedeemed = redeemedItems.includes(item.id);
            const canAfford = shells >= item.cost;
            return (
              <TiltCard
                key={item.id}
                revealRef={revealRef}
                style={{
                  ...card,
                  border: isRedeemed ? '1.5px solid #39ff88' : '1.5px solid rgba(34, 211, 238, 0.2)',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                  boxShadow: isRedeemed ? '0 8px 24px rgba(57, 255, 136, 0.1)' : card.boxShadow
                }}
              >
                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '2.2rem', width: '56px', height: '56px',
                    background: isRedeemed ? 'rgba(57, 255, 136, 0.1)' : 'rgba(34, 211, 238, 0.08)',
                    border: `1.5px solid ${isRedeemed ? '#39ff88' : 'rgba(34, 211, 238, 0.2)'}`,
                    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 3px 0', fontSize: '1rem', fontWeight: '800', color: isRedeemed ? '#39ff88' : '#fff' }}>
                      {item.title}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', color: isRedeemed ? '#39ff88' : '#22d3ee' }}>
                      {item.cost} 🐚
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.5' }}>
                  {item.desc}
                </p>

                {/* Action button */}
                {isRedeemed ? (
                  <button
                    onClick={() => handleDownload(item)}
                    style={{
                      width: '100%', background: 'rgba(57, 255, 136, 0.08)',
                      border: '1.5px solid #39ff88', padding: '10px',
                      borderRadius: '10px', color: '#39ff88',
                      fontFamily: 'Outfit, sans-serif', fontWeight: '800',
                      fontSize: '0.82rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {item.id === 'coupon-gear' ? <Tag size={15} /> : <Download size={15} />}
                    {item.id === 'coupon-gear' ? 'View Coupon Code' : 'Download Reward'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    style={{
                      width: '100%',
                      background: canAfford
                        ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: canAfford ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      padding: '10px', borderRadius: '10px',
                      color: canAfford ? '#fff' : '#475569',
                      fontFamily: 'Outfit, sans-serif', fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: canAfford ? 'pointer' : 'default',
                      opacity: canAfford ? 1 : 0.55, transition: 'all 0.2s'
                    }}
                  >
                    {canAfford ? `Redeem for ${item.cost} 🐚` : `Need ${item.cost - shells} more 🐚`}
                  </button>
                )}
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* ── Ocean Pledging Dashboard ────────────────────── */}
      <section style={{
        ...card,
        marginBottom: '48px',
        padding: '32px',
        borderRadius: '20px',
        border: '1.5px solid rgba(34, 211, 238, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Heart size={20} style={{ color: '#ef4444', filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))' }} />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: '900', color: '#fff', margin: 0 }}>
            Pledge Shells to Ocean Conservation
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#b7cad6', margin: '0 0 24px 0', lineHeight: '1.5', maxWidth: '700px' }}>
          Pledge your collected 🐚 Shells to approved non-profit organizations. Every <strong>10 Shells = 1 Simulated Conservation Impact Point</strong> recorded in support of local reefs.
        </p>

        {/* Guest warning */}
        {!currentUser && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1.5px solid rgba(245, 158, 11, 0.25)',
            padding: '12px 18px', borderRadius: '12px',
            marginBottom: '24px', flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: '700' }}>
                Log in to link pledges to your Explorer profile!
              </span>
            </div>
            <button
              onClick={onOpenAuth}
              style={{ background: '#f59e0b', color: '#03111c', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '900', fontSize: '0.78rem', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}
            >Login / Register</button>
          </div>
        )}

        {/* Charity cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

          {/* Kingston K9 */}
          {[
            {
              id: 'Kingston',
              name: 'Kingston K9 Search & Rescue',
              url: 'https://Kingstonk9.com',
              urlLabel: 'Kingstonk9.com',
              emoji: '🐕',
              desc: 'Supporting search-and-rescue dog training programs and emergency water safety operations.',
              goal: KingstonGoal,
              communityTotal: communityDonations.Kingston,
              userTotal: userDonations.Kingston,
              percent: kingstonPercent,
              barColor: 'linear-gradient(90deg, #064c72, #22d3ee)',
              barGlow: 'rgba(34, 211, 238, 0.4)',
              amount: kingstonAmount,
              setAmount: setKingstonAmount,
              pledgeGrad: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
            },
            {
              id: 'Saltwater',
              name: 'SaltwaterCam Conservation',
              url: 'https://saltwatercam.com',
              urlLabel: 'saltwatercam.com',
              emoji: '🌊',
              desc: 'Funding telemetry sensors, water chemistry monitors, and 4K camera installations on Boynton reefs.',
              goal: SaltwaterGoal,
              communityTotal: communityDonations.Saltwater,
              userTotal: userDonations.Saltwater,
              percent: saltwaterPercent,
              barColor: 'linear-gradient(90deg, #064c72, #39ff88)',
              barGlow: 'rgba(57, 255, 136, 0.4)',
              amount: saltwaterAmount,
              setAmount: setSaltwaterAmount,
              pledgeGrad: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)',
            }
          ].map(c => (
            <div key={c.id} style={{
              background: 'rgba(3, 17, 28, 0.5)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '22px',
              display: 'flex', flexDirection: 'column', gap: '18px'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: '800' }}>
                    {c.name}
                  </h3>
                  <a href={c.url} target="_blank" rel="noreferrer"
                    style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: '800', textDecoration: 'none' }}>
                    {c.urlLabel} ↗
                  </a>
                </div>
                <span style={{ fontSize: '1.8rem' }}>{c.emoji}</span>
              </div>

              <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.5' }}>{c.desc}</p>

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#b7cad6', marginBottom: '6px' }}>
                  <span>Community Goal</span>
                  <strong>{c.communityTotal.toLocaleString()} / {c.goal.toLocaleString()} 🐚 ({c.percent.toFixed(0)}%)</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.percent}%`, height: '100%', background: c.barColor, boxShadow: `0 0 8px ${c.barGlow}`, transition: 'width 0.5s ease-out' }} />
                </div>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#b7cad6' }}>
                  <span>Your Pledges: <strong>{c.userTotal} 🐚</strong></span>
                  <span>Impact: <strong>{(c.userTotal / 10).toFixed(0)} pts</strong></span>
                </div>
              </div>

              {/* Pledge input */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  {['20', '50', '100'].map(amt => (
                    <button key={amt} onClick={() => c.setAmount(amt)}
                      style={{ flex: 1, padding: '6px 4px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      +{amt} 🐚
                    </button>
                  ))}
                  <button onClick={() => c.setAmount(shells.toString())}
                    style={{ flex: 1, padding: '6px 4px', fontSize: '0.72rem', background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.25)', borderRadius: '6px', color: '#22d3ee', fontWeight: '800', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    Max
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="Shell amount"
                    value={c.amount}
                    onChange={(e) => c.setAmount(e.target.value)}
                    style={{
                      flex: 1, padding: '9px 12px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px', color: '#fff',
                      outline: 'none', fontSize: '0.84rem',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  />
                  <button
                    onClick={() => executeDonation(c.id, c.amount, c.setAmount)}
                    style={{
                      background: c.pledgeGrad,
                      border: 'none', borderRadius: '8px',
                      color: '#fff', padding: '9px 18px',
                      fontWeight: '800', fontSize: '0.82rem',
                      cursor: 'pointer', fontFamily: 'Outfit, sans-serif'
                    }}
                  >Pledge</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pledge Receipt Modal ────────────────────────── */}
      {activeReceipt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(2, 13, 21, 0.88)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.97) 0%, rgba(3, 17, 28, 0.99) 100%)',
            border: '2px solid rgba(34, 211, 238, 0.4)',
            borderRadius: '24px', padding: '32px',
            width: '100%', maxWidth: '460px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(34, 211, 238, 0.2)',
            position: 'relative', textAlign: 'center'
          }}>
            <button
              onClick={() => setActiveReceipt(null)}
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7cad6', cursor: 'pointer' }}
            ><X size={17} /></button>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(57, 255, 136, 0.1)', border: '2px solid #39ff88', color: '#39ff88', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={28} style={{ filter: 'drop-shadow(0 0 8px rgba(57, 255, 136, 0.5))' }} />
              </div>
            </div>

            <span style={{ fontSize: '0.7rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Conservation Pledge Receipt
            </span>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '6px 0 18px 0' }}>
              Pledge Confirmed! 🎉
            </h3>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(34, 211, 238, 0.25)', borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', fontSize: '0.84rem' }}>
              {[
                { label: 'Explorer', val: `${activeReceipt.avatar} ${activeReceipt.user}`, color: '#fff' },
                { label: 'Beneficiary', val: activeReceipt.charityName, color: '#22d3ee' },
                { label: 'Pledged Shells', val: `${activeReceipt.amount} 🐚`, color: '#fff' },
                { label: 'Conservation Impact', val: `${activeReceipt.valueDollars} Points`, color: '#39ff88' },
                { label: 'Date', val: activeReceipt.date, color: '#fff' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b7cad6' }}>{row.label}:</span>
                  <span style={{ color: row.color, fontWeight: '700' }}>{row.val}</span>
                </div>
              ))}
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: 'monospace', textAlign: 'center', marginTop: '6px', letterSpacing: '0.04em' }}>
                RECEIPT ID: {activeReceipt.receiptId}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px', color: '#fff', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif' }}
              ><Printer size={15} /> Print</button>
              <button
                onClick={() => setActiveReceipt(null)}
                style={{ flex: 1, background: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)', border: 'none', padding: '10px', borderRadius: '10px', color: '#fff', fontWeight: '900', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              ><CheckCircle size={15} /> Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
