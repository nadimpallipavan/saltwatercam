import { useState, useEffect } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy, Compass, Star, Printer, Gift } from 'lucide-react';
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
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('swc_kids_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem('swc_completed_missions');
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('missions'); // 'missions' or 'rewards'
  const [spottedSpecies, setSpottedSpecies] = useState([]);
  
  // Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const revealRef = useScrollReveal();
  const currentQuestion = siteContent.quiz[currentQuestionIdx];

  // Badges catalog
  const badgesList = [
    { id: 'protector', name: 'Reef Protector', xpReq: 150, icon: Trophy, desc: 'Earned at 150 XP. A protector of the Lantana reefs.', color: '#22d3ee' },
    { id: 'scientist', name: 'Marine Scientist', xpReq: 300, icon: Compass, desc: 'Earned at 300 XP. Analyzed marine life & water physics.', color: '#39ff88' },
    { id: 'diver', name: 'Deep Diver', xpReq: 450, icon: Star, desc: 'Earned at 450 XP. Logged simulated dives & sightings.', color: '#f59e0b' },
    { id: 'master', name: 'Master Explorer', xpReq: 500, icon: Award, desc: 'Earned at 500 XP. Completed all missions on the reef!', color: '#e11d48' },
  ];

  // Sync spotted species
  useEffect(() => {
    const loadSpotted = () => {
      const saved = JSON.parse(localStorage.getItem('swc_spotted_species') || '[]');
      setSpottedSpecies(saved);
    };
    loadSpotted();
    window.addEventListener('focus', loadSpotted);
    return () => window.removeEventListener('focus', loadSpotted);
  }, []);

  // Update unlocked badges based on XP
  useEffect(() => {
    const newlyUnlocked = badgesList
      .filter(b => xp >= b.xpReq)
      .map(b => b.id);
    setUnlockedBadges(newlyUnlocked);
  }, [xp]);

  // Sync back to localStorage
  useEffect(() => {
    localStorage.setItem('swc_kids_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('swc_completed_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Handle Quiz completion
  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.answer - 1) {
      setScore(score + 1);
    }
  };

  const handleNextClick = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentQuestionIdx + 1 < siteContent.quiz.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setIsFinished(true);
      completeMission('trivia', 150);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setIsFinished(false);
  };

  // Complete a mission
  const completeMission = (missionId, xpAward) => {
    if (completedMissions.includes(missionId)) return;
    setCompletedMissions(prev => [...prev, missionId]);
    setXp(prev => Math.min(500, prev + xpAward));
  };

  return (
    <div className="pageContainer kidsPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Cartoon Mascot Guide Speech Bubble */}
      <div style={{
        maxWidth: '1220px',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(34, 211, 238, 0.12)',
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          border: '2.5px solid #22d3ee',
          boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'
        }}>
          🐢
        </div>
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
            "Hey Explorer! 🌊 Welcome to the Kids Club! Complete quests to earn XP, unlock trophy badges, and watch the live stream to fill your Sighting Log Book!"
          </div>
        </div>
      </div>

      {/* Header and Sub-view Toggle */}
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <Award size={14} /> Kids Ocean Adventure
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          Marine Explorer Dashboard
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Complete missions, earn XP, and unlock achievement badges to become a certified Boynton Reef Protector!
        </p>
      </div>

      <div className="subViewToggleContainer" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(6, 32, 49, 0.65)',
          border: '1.5px solid rgba(34, 211, 238, 0.25)',
          padding: '4px',
          borderRadius: '30px',
          backdropFilter: 'blur(8px)'
        }}>
          <button
            onClick={() => setActiveSubTab('missions')}
            style={{
              background: activeSubTab === 'missions' ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'transparent',
              border: 'none',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: '24px',
              fontSize: '0.85rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Quests & Accomplishments
          </button>
          <button
            onClick={() => setActiveSubTab('rewards')}
            style={{
              background: activeSubTab === 'rewards' ? 'linear-gradient(135deg, #064c72 0%, #22d3ee 100%)' : 'transparent',
              border: 'none',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: '24px',
              fontSize: '0.85rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Redeem Rewards
          </button>
        </div>
      </div>

      {activeSubTab === 'missions' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Column: Progress & Trophy Cabinet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* XP Progress Card */}
              <div style={{ padding: '24px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px 0', color: '#fff' }}>Explorer Progress</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#b7cad6', marginBottom: '8px', fontWeight: '700' }}>
                  <span>RANK: {xp >= 500 ? 'Master Reef Protector' : xp >= 300 ? 'Junior Oceanographer' : 'Salty Cadet'}</span>
                  <span>{xp} / 500 XP</span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ height: '14px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '14px' }}>
                  <div 
                    style={{ 
                      width: `${(xp / 500) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #064c72 0%, #22d3ee 50%, #39ff88 100%)',
                      transition: 'width 0.5s ease' 
                    }} 
                  />
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  Gain XP by answering trivia questions, viewing telemetry, and reporting simulated reef sightings!
                </p>
              </div>

              {/* Digital Trophy Cabinet */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(6, 32, 49, 0.6) 0%, rgba(6, 48, 73, 0.4) 100%)',
                border: '2px solid rgba(34, 211, 238, 0.35)',
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
                textAlign: 'left',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏆</span> Trophy Cabinet
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#b7cad6', lineHeight: '1.4' }}>
                  Collect XP from quests to unlock these rare collector badges!
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {badgesList.map(badge => {
                    const isUnlocked = unlockedBadges.includes(badge.id);
                    const IconComponent = badge.icon;
                    
                    return (
                      <div 
                        key={badge.id}
                        style={{
                          padding: '16px 12px',
                          background: isUnlocked 
                            ? 'linear-gradient(135deg, rgba(6, 76, 114, 0.3) 0%, rgba(34, 211, 238, 0.08) 100%)' 
                            : 'rgba(255,255,255,0.02)',
                          border: isUnlocked 
                            ? `2px solid ${badge.color}` 
                            : '1.5px dashed rgba(255,255,255,0.08)',
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          opacity: isUnlocked ? 1 : 0.6
                        }}
                      >
                        {!isUnlocked && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.8rem', opacity: 0.3 }}>
                            🔒
                          </div>
                        )}
                        <IconComponent 
                          size={26} 
                          color={isUnlocked ? badge.color : '#b7cad6'} 
                          style={{ marginBottom: '8px' }} 
                        />
                        <strong style={{ fontSize: '0.8rem', color: isUnlocked ? '#fff' : '#b7cad6', display: 'block', fontWeight: '800' }}>
                          {badge.name}
                        </strong>
                        <span style={{ fontSize: '0.65rem', color: isUnlocked ? badge.color : '#b7cad6', fontWeight: '800', marginTop: '6px' }}>
                          {isUnlocked ? 'UNLOCKED' : `${badge.xpReq} XP`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Quests & Trivia Quiz */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Explorer Quests Board */}
              <div style={{ padding: '24px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px 0', color: '#fff' }}>Explorer Quests</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {siteContent.missions.map(mission => {
                    const isCompleted = completedMissions.includes(mission.id);
                    
                    return (
                      <div 
                        key={mission.id}
                        style={{
                          padding: '14px 16px',
                          background: isCompleted ? 'rgba(57, 255, 136, 0.05)' : 'rgba(255,255,255,0.03)',
                          border: isCompleted ? '1.5px solid rgba(57, 255, 136, 0.25)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: isCompleted ? '#39ff88' : '#fff', display: 'block' }}>
                            {mission.label}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#b7cad6', marginTop: '2px', display: 'block' }}>
                            {mission.description}
                          </span>
                        </div>
                        <div>
                          {isCompleted ? (
                            <span style={{ color: '#39ff88', fontSize: '0.8rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={16} /> DONE
                            </span>
                          ) : (
                            <button
                              onClick={() => completeMission(mission.id, mission.xp)}
                              style={{
                                background: '#064c72',
                                border: '1px solid #22d3ee',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                color: '#fff',
                                fontSize: '0.78rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              +{mission.xp} XP
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Embedded Trivia Quiz Card */}
              <TiltCard className="quizCard" revealRef={revealRef}>
                {!isFinished ? (
                  <div style={{ textAlign: 'left' }}>
                    <div className="quizProgress" style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#b7cad6', fontWeight: '700' }}>Trivia Challenge (Question {currentQuestionIdx + 1} of {siteContent.quiz.length})</span>
                      <div className="progressBar" style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '6px' }}>
                        <div 
                          className="progressFill" 
                          style={{ 
                            width: `${((currentQuestionIdx + 1) / siteContent.quiz.length) * 100}%`,
                            height: '100%',
                            background: '#22d3ee',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="quizQuestion" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <HelpCircle size={20} style={{ color: '#22d3ee', flexShrink: 0 }} />
                      {currentQuestion.question}
                    </h3>

                    <div className="optionsGrid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentQuestion.options.map((option, idx) => {
                        let btnStyle = {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff'
                        };
                        
                        if (isAnswered) {
                          if (idx === currentQuestion.answer - 1) {
                            btnStyle = {
                              background: 'rgba(57, 255, 136, 0.1)',
                              border: '1.5px solid #39ff88',
                              color: '#39ff88'
                            };
                          } else if (selectedOption === idx) {
                            btnStyle = {
                              background: 'rgba(244, 63, 94, 0.1)',
                              border: '1.5px solid #f43f5e',
                              color: '#f43f5e'
                            };
                          } else {
                            btnStyle = {
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              color: '#b7cad6',
                              opacity: 0.6
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
                            onClick={() => handleOptionClick(idx)}
                            disabled={isAnswered}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '8px',
                              textAlign: 'left',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              cursor: isAnswered ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease',
                              ...btnStyle
                            }}
                          >
                            <span style={{ display: 'flex', gap: '8px' }}>
                              <span style={{ color: '#22d3ee' }}>{['A', 'B', 'C', 'D'][idx]}</span>
                              <span>{option}</span>
                            </span>
                            {isAnswered && idx === currentQuestion.answer - 1 && <CheckCircle2 size={16} />}
                            {isAnswered && selectedOption === idx && idx !== currentQuestion.answer - 1 && <XCircle size={16} />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderLeft: `3px solid ${selectedOption === currentQuestion.answer - 1 ? '#39ff88' : '#f43f5e'}` }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#b7cad6', lineHeight: '1.4' }}>
                          {currentQuestion.explanation}
                        </p>
                        <button 
                          onClick={handleNextClick}
                          style={{
                            background: '#064c72',
                            border: '1.5px solid #22d3ee',
                            color: '#fff',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          {currentQuestionIdx + 1 === siteContent.quiz.length ? 'Finish Quiz' : 'Next Question'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <Trophy size={48} color="#eab308" style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 6px 0' }}>Quiz Completed!</h3>
                    <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#b7cad6' }}>
                      Score: <strong style={{ color: '#fff' }}>{score} / {siteContent.quiz.length}</strong>. 
                      You earned +150 XP for completing this quest!
                    </p>
                    <button 
                      onClick={resetQuiz}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={14} /> Try Again
                    </button>
                  </div>
                )}
              </TiltCard>
            </div>
          </div>

          {/* Reef Spotter's Log Book */}
          <div style={{
            marginTop: '40px',
            padding: '30px 24px',
            background: 'rgba(6, 32, 49, 0.45)',
            border: '1.5px solid rgba(34, 211, 238, 0.25)',
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
            textAlign: 'left',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📸</span> Reef Spotter's Log Book
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: '#b7cad6', lineHeight: '1.4' }}>
              Tapping creatures on the **Live Stream** or answering **Quiz Questions** unlocks entries in your notebook. Can you spot all 7?
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {[
                { name: 'Bannerfish', emoji: '🐠', color: '#06b6d4', desc: 'Swims left to right. Famous for its long white dorsal fin!' },
                { name: 'Yellow Tang', emoji: '💛', color: '#eab308', desc: 'A vibrant yellow fish that helps keep the coral reef clean!' },
                { name: 'Green Sea Turtle', emoji: '🐢', color: '#10b981', desc: 'A gentle reptile that nests on local Boynton beaches.' },
                { name: 'Common Snook', emoji: '🐟', color: '#6366f1', desc: 'Has a distinct black lateral line. Loves dock pilings!' },
                { name: 'Goliath Grouper', emoji: '🐡', color: '#a855f7', desc: 'A giant predator that can weigh up to 800 pounds.' },
                { name: 'Southern Stingray', emoji: '🌊', color: '#38bdf8', desc: 'Glides on the sandy floor and buries itself to hide.' },
                { name: 'Green Attractor Light', emoji: '🟢', color: '#22c55e', desc: 'Green LED light under the dock that draws in tiny plankton.' }
              ].map(item => {
                const isSpotted = spottedSpecies.includes(item.name);
                return (
                  <div 
                    key={item.name}
                    style={{
                      padding: '20px 16px',
                      background: isSpotted 
                        ? 'linear-gradient(135deg, rgba(6, 76, 114, 0.25) 0%, rgba(34, 211, 238, 0.05) 100%)' 
                        : 'rgba(255,255,255,0.02)',
                      border: isSpotted 
                        ? `1.5px solid ${item.color}` 
                        : '1.5px dashed rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      opacity: isSpotted ? 1 : 0.6,
                      boxShadow: isSpotted ? `0 6px 15px ${item.color}15` : 'none'
                    }}
                  >
                    <div style={{
                      fontSize: '2.8rem',
                      marginBottom: '10px',
                      filter: isSpotted ? 'none' : 'grayscale(100%) brightness(40%)'
                    }}>
                      {isSpotted ? item.emoji : '❓'}
                    </div>
                    
                    <strong style={{ fontSize: '0.9rem', color: isSpotted ? '#fff' : '#64748b', fontWeight: '800' }}>
                      {isSpotted ? item.name : 'Unknown Creature'}
                    </strong>

                    <p style={{
                      margin: '8px 0 12px 0',
                      fontSize: '0.72rem',
                      color: isSpotted ? '#b7cad6' : '#475569',
                      lineHeight: '1.45',
                      height: '44px',
                      overflow: 'hidden'
                    }}>
                      {isSpotted ? item.desc : 'Hint: Watch the live stream carefully or play quizzes to discover this entry!'}
                    </p>

                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: '900',
                      color: isSpotted ? '#39ff88' : '#64748b',
                      background: isSpotted ? 'rgba(57, 255, 136, 0.08)' : 'rgba(255,255,255,0.04)',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {isSpotted ? '✓ Spotted!' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Printable Certificate Showcase at 500 XP */}
          {xp >= 500 && (
            <div style={{ marginTop: '40px', padding: '32px', background: 'linear-gradient(135deg, rgba(6, 76, 114, 0.4) 0%, rgba(34, 211, 238, 0.15) 100%)', border: '2px solid #22d3ee', borderRadius: '16px', boxShadow: '0 0 25px rgba(34, 211, 238, 0.25)', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
              <Trophy size={48} color="#f59e0b" style={{ margin: '0 auto 12px auto' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '0 0 6px 0' }}>
                Congratulations, Certified Protector!
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#b7cad6', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                You have earned a perfect score of 500 XP and unlocked all missions. You are now officially recognized as a certified Lantana Reef Protector!
              </p>
              
              {/* Certificate Board Render */}
              <div style={{
                maxWidth: '650px',
                margin: '0 auto 24px auto',
                background: '#fff',
                color: '#031b2e',
                border: '8px double #064c72',
                padding: '40px 24px',
                borderRadius: '4px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', fontWeight: '800', textTransform: 'uppercase', color: '#064c72', display: 'block', marginBottom: '8px' }}>
                  Certificate of Achievement
                </span>
                <div style={{ width: '40px', height: '2px', background: '#064c72', margin: '0 auto 18px auto' }} />
                <span style={{ fontSize: '0.9rem', color: '#555', display: 'block', fontStyle: 'italic', marginBottom: '8px' }}>
                  This document certifies that the bearer is a certified
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#031b2e', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Boynton Inlet Reef Protector
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#666', maxWidth: '450px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                  For outstanding dedication to marine biology, understanding green light physics, and supporting ocean conservation efforts.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px', padding: '0 24px' }}>
                  <div style={{ textAlign: 'left', borderTop: '1px solid #aaa', width: '150px', paddingTop: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#777', display: 'block' }}>REPRESENTATIVE</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>SaltwaterCam Team</span>
                  </div>
                  <Award size={36} color="#064c72" />
                  <div style={{ textAlign: 'right', borderTop: '1px solid #aaa', width: '150px', paddingTop: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#777', display: 'block' }}>DATE</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>June 2026</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                style={{
                  background: '#fff',
                  border: 'none',
                  color: '#031b2e',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontWeight: '900',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}
              >
                PRINT CERTIFICATE
              </button>
            </div>
          )}
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

      <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
