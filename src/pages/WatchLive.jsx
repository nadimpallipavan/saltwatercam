import { useState } from 'react';
import LiveStream from '../components/LiveStream.jsx';
import { siteContent } from '../data/siteContent.js';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const gameQuestions = [
  {
    q: "Spot the animal with a shell! Is it a sea turtle or a land tortoise?",
    options: ["Green Sea Turtle 🐢", "Land Tortoise 🐢"],
    answer: 0,
    explanation: "Green Sea Turtles live in the ocean and have flippers instead of claws! Land tortoises have heavy claws for digging and cannot swim.",
    points: 20
  },
  {
    q: "Which fish has a long black stripe running down the side of its body?",
    options: ["Common Snook 🐟", "Atlantic Tarpon 🐟"],
    answer: 0,
    explanation: "The Snook has a distinct black lateral line running from its gills to its tail, which helps them detect vibrations and hunt baitfish!",
    points: 20
  },
  {
    q: "Which giant fish weighs up to 800 lbs and makes booming noises?",
    options: ["Goliath Grouper 🐡", "Southern Stingray 🐚"],
    answer: 0,
    explanation: "The Goliath Grouper is a gentle giant that uses its swim bladder to make deep booming sounds to defend its territory!",
    points: 20
  },
  {
    q: "What color is the special underwater attraction light under our Lantana dock?",
    options: ["Neon Green 🟢", "Fire Red 🔴", "Deep Blue 🔵"],
    answer: 0,
    explanation: "Green light penetrates coastal water best and attracts tiny plankton, which brings small baitfish, attracting Snook and Tarpon!",
    points: 20
  },
  {
    q: "Which flat fish glides on the sand and has a tail with a barb?",
    options: ["Southern Stingray 🌊", "Atlantic Tarpon 🐟"],
    answer: 0,
    explanation: "Stingrays glide along the ocean floor and bury themselves in the sand to hide from predators!",
    points: 20
  }
];

export default function WatchLive({ addShells, shells, currentUser }) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [gameMode, setGameMode] = useState('cleanup'); // 'cleanup' (Ages 3+) or 'ai' (Ages 6+)
  const [exchangeSuccess, setExchangeSuccess] = useState(null);
  const [emailInput, setEmailInput] = useState('');

  // Kids Reef Spotter Game states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = gameQuestions[currentQuestionIdx];

  const handleAnswer = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    if (optionIdx === currentQuestion.answer) {
      setScore(prev => prev + 1);
      if (addShells) {
        addShells(currentQuestion.points);
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuestionIdx + 1 < gameQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="watchPageFull" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '64px', paddingTop: '20px' }}>
      <LiveStream aiEnabled={aiEnabled} addShells={addShells} shells={shells} currentUser={currentUser} gameMode={gameMode} />
      
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', flex: '1 1 500px', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 2px 0', fontFamily: 'Outfit, sans-serif', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.01em' }}>
            Reef Interactive Gaming Lens
          </h4>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.88rem', color: '#b7cad6', lineHeight: '1.45' }}>
            {gameMode === 'cleanup' 
              ? '🧹 Reef Trash Cleanup (Ages 3+): Floating plastic bottles, bags, and cans drift across the camera. Click them to clean the reef and earn shells instantly! Simple and fun click-and-pop game.'
              : '🔍 AI Spotter Challenge (Ages 6+): Simulated AI alerts flash when marine life is detected. Click the feed during alert windows to scan species, verify sightings, and learn biology facts!'}
          </p>
          
          {/* Segmented Mode Selector tabs */}
          {aiEnabled && (
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '25px',
              padding: '2px',
              gap: '2px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              marginTop: '4px'
            }}>
              <button
                onClick={() => setGameMode('cleanup')}
                style={{
                  background: gameMode === 'cleanup' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '6px 14px',
                  borderRadius: '22px',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: gameMode === 'cleanup' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                🧹 Reef Cleanup (Ages 3+)
              </button>
              <button
                onClick={() => setGameMode('ai')}
                style={{
                  background: gameMode === 'ai' ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '6px 14px',
                  borderRadius: '22px',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: gameMode === 'ai' ? '0 2px 8px rgba(34, 211, 238, 0.3)' : 'none'
                }}
              >
                🔍 AI Spotter (Ages 6+)
              </button>
            </div>
          )}
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
          {aiEnabled ? 'GAMING LENS ACTIVE' : 'ACTIVATE GAMING LENS'}
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
 
      {/* Sighting Timeline & Spotter Game side-by-side */}
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
 
        {/* Kids Reef Spotter Game Card */}
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
          {!isFinished ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#fff', fontWeight: '800', margin: 0, letterSpacing: '0.01em' }}>
                  🎮 Reef Spotter Quiz
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#22d3ee', fontWeight: '800', background: 'rgba(34, 211, 238, 0.1)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.15)', fontFamily: 'Outfit, sans-serif' }}>
                  Q {currentQuestionIdx + 1} of {gameQuestions.length}
                </span>
              </div>
              
              <p style={{ fontSize: '0.92rem', color: '#fff', fontWeight: '800', lineHeight: '1.45', margin: '4px 0 0 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <HelpCircle size={18} style={{ color: '#22d3ee', flexShrink: 0, marginTop: '2px' }} />
                {currentQuestion.q}
              </p>
 
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: '#fff'
                  };
                  
                  if (isAnswered) {
                    if (idx === currentQuestion.answer) {
                      btnStyle = {
                        background: 'rgba(57, 255, 136, 0.12)',
                        border: '1.5px solid #39ff88',
                        color: '#39ff88'
                      };
                    } else if (selectedOption === idx) {
                      btnStyle = {
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1.5px solid #f43f5e',
                        color: '#f43f5e'
                      };
                    } else {
                      btnStyle = {
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#b7cad6',
                        opacity: 0.5
                      };
                    }
                  } else if (selectedOption === idx) {
                    btnStyle = {
                      background: 'rgba(34, 211, 238, 0.1)',
                      border: '1.5px solid #22d3ee',
                      color: '#22d3ee'
                    };
                  }
 
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        textAlign: 'left',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: isAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        ...btnStyle
                      }}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQuestion.answer && <CheckCircle2 size={16} />}
                      {isAnswered && selectedOption === idx && idx !== currentQuestion.answer && <XCircle size={16} />}
                    </button>
                  );
                })}
              </div>
 
              {isAnswered && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '12px 14px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '10px', 
                  borderLeft: `3px solid ${selectedOption === currentQuestion.answer ? '#39ff88' : '#f43f5e'}`,
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#b7cad6', lineHeight: '1.4' }}>
                    {selectedOption === currentQuestion.answer ? (
                      <strong style={{ color: '#39ff88', display: 'block', marginBottom: '2px' }}>✓ CORRECT! (+{currentQuestion.points} shells)</strong>
                    ) : (
                      <strong style={{ color: '#f43f5e', display: 'block', marginBottom: '2px' }}>✗ OOPS!</strong>
                    )}
                    {currentQuestion.explanation}
                  </p>
                  <button 
                    onClick={handleNext}
                    style={{
                      background: '#064c72',
                      border: '1.5px solid #22d3ee',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#085e8d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#064c72'}
                  >
                    {currentQuestionIdx + 1 === gameQuestions.length ? 'See Results' : 'Next Sighting'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', height: '100%' }}>
              <Trophy size={48} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} />
              <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                Ocean Protector Score Card!
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#b7cad6', lineHeight: '1.5' }}>
                You identified <strong style={{ color: '#fff' }}>{score} out of {gameQuestions.length}</strong> marine life species correctly today! 
                Shells were added to your profile wallet.
              </p>
              <button 
                onClick={resetGame}
                style={{
                  background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                  border: '1.5px solid rgba(34, 211, 238, 0.35)',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <RotateCcw size={14} /> Play Again
              </button>
            </div>
          )}
        </div>

        {/* Kids Shell Club & Conservation Bank */}
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
                  <span>🏦</span> Kids Shell Bank & Club
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

                {/* Progress bar towards Master Scientist Explorer Level */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#b7cad6', marginBottom: '4px', fontWeight: '800' }}>
                    <span>Next Rank Level (Master Scout)</span>
                    <span>{Math.min(500, shells)} / 500 shells</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, Math.floor((shells / 500) * 100))}%`,
                      height: '100%',
                      background: shells >= 500 ? '#39ff88' : 'linear-gradient(90deg, #064c72, #22d3ee)',
                      boxShadow: shells >= 500 ? '0 0 8px #39ff88' : 'none',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Action Forms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Badge Unlock Action */}
                <button
                  onClick={() => {
                    if (shells < 200) return;
                    addShells(-200);
                    setExchangeSuccess({ type: 'badge', amount: 200 });
                  }}
                  disabled={shells < 200}
                  style={{
                    background: shells >= 200 
                      ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(34, 211, 238, 0.25)',
                    color: shells >= 200 ? '#fff' : '#b7cad6',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: shells >= 200 ? 'pointer' : 'default',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s',
                    opacity: shells >= 200 ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (shells >= 200) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (shells >= 200) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {shells >= 200 ? '🏆 Unlock Master Explorer Badge (200 Shells)' : '🔒 Need 200 Shells for Explorer Badge'}
                </button>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                {/* Donation Action */}
                <button
                  onClick={() => {
                    addShells(-100);
                    setExchangeSuccess({ type: 'donation', amount: 100 });
                  }}
                  disabled={shells < 100}
                  style={{
                    background: 'rgba(57, 255, 136, 0.08)',
                    border: '1.5px solid rgba(57, 255, 136, 0.25)',
                    color: shells >= 100 ? '#39ff88' : '#b7cad6',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: shells >= 100 ? 'pointer' : 'default',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s',
                    opacity: shells >= 100 ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (shells >= 100) {
                      e.currentTarget.style.background = 'rgba(57, 255, 136, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (shells >= 100) {
                      e.currentTarget.style.background = 'rgba(57, 255, 136, 0.08)';
                    }
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
                  <>
                    Congratulations! You traded <strong style={{ color: '#fff' }}>{exchangeSuccess.amount} shells</strong> to unlock the special <strong style={{ color: '#22d3ee' }}>Master Explorer Badge</strong>! Keep exploring and learning to save our oceans!
                  </>
                ) : (
                  <>
                    Fantastic! You donated <strong style={{ color: '#fff' }}>{exchangeSuccess.amount} shells</strong> to help plant a virtual coral reef structure, building a safe new home for sea turtles, crabs, and fish!
                  </>
                )}
              </p>
              <button
                onClick={() => setExchangeSuccess(null)}
                style={{
                  background: 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)',
                  border: '1.5px solid rgba(34, 211, 238, 0.35)',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 0.2s',
                  marginTop: '8px'
                }}
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
