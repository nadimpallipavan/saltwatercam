import { useState } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Gift, Award, Download, Tag, Coins, CheckCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function RewardsPage() {
  const [xp, setXp] = useState(0);
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [redeemedItems, setRedeemedItems] = useState([]);
  
  const revealRef = useScrollReveal();
  const rewardsList = siteContent.rewards;

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

  return (
    <div className="pageContainer rewardsPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <Gift size={14} /> Rewards Market
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          Explorer Rewards Marketplace
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Spend the XP you earned from answering quizzes and logging sightings to unlock exclusive wallpapers, digital badges, and local vouchers.
        </p>
      </div>

      {/* Stateful XP Status Panel */}
      <div style={{
        maxWidth: '1220px',
        margin: '0 auto 40px auto',
        padding: '24px',
        background: 'rgba(6, 32, 49, 0.55)',
        border: '1.5px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '16px',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
            <Coins size={32} style={{ color: '#22d3ee' }} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: '800' }}>Your Redeemed Wallet</h4>
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
              padding: '10px 24px',
              borderRadius: '30px',
              color: '#fff',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(57, 255, 136, 0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            CLAIM STAGING 500 XP BONUS
          </button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#39ff88', fontWeight: '800', border: '1.5px solid rgba(57, 255, 136, 0.3)', padding: '6px 16px', borderRadius: '20px', background: 'rgba(57, 255, 136, 0.05)' }}>
            ✓ BONUS CLAIMED (+500 XP)
          </span>
        )}
      </div>

      {/* Rewards Catalog Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
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
    </div>
  );
}
