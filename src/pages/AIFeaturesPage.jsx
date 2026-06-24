import { useState, useEffect } from 'react';
import { siteContent } from '../data/siteContent.js';
import { Cpu, Target, Clock, BarChart3, ShieldCheck, Zap, Sparkles, MessageSquare, Send, RefreshCw } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function AIFeaturesPage() {
  const revealRef = useScrollReveal();
  const stats = siteContent.aiModelStats;

  // LLM Telemetry Briefing states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [telemetryBrief, setTelemetryBrief] = useState('');
  const [telemetrySeed, setTelemetrySeed] = useState(0);

  // LLM Prompt Assistant states
  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  const generateTelemetryBrief = (seed) => {
    const briefs = [
      "**AI Biologist Analysis**: The high concentration of Common Snook (45% of today's 1,420 detections) is strongly correlated with the incoming tide at Boynton Beach Inlet. Snook are ambush predators; the tidal current pushes baitfish through the Lantana dock channel where the green light acts as an aggregate. Given the stable Bermuda Current water temperature of 78.4°F, expect heightened Atlantic Tarpon feeding activity in the shadow lines over the next 90 minutes as the tide reaches its peak.",
      "**AI Biologist Analysis**: Current ocean telemetry shows excellent visibility (65 feet) under the Lantana dock. This has resulted in a 15% increase in Goliath Grouper targets (currently 15% of all active detections) emerging from deeper reef cracks to forage. Snook counts are holding steady, sheltering in dock pilings. The incoming current at 1.4 knots provides optimal dissolved oxygen levels, prompting high metabolic activity. No immediate predator anomalies detected.",
      "**AI Biologist Analysis**: Telemetry sensor sync indicates a rising tide converging with an optimal 78.4°F water temperature. The YOLOv8 model reports 8 active targets, including 2 mature Green Sea Turtles grazing on local piling algae. Detections today are ahead of baseline (1,420 logs). The green attraction light remains 94.2% efficient in turbid edge currents, providing a high-yield nocturnal micro-ecosystem."
    ];
    return briefs[seed % briefs.length];
  };

  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setTelemetryBrief(generateTelemetryBrief(telemetrySeed));
      setIsAnalyzing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [telemetrySeed]);

  const commonQAs = {
    "why do snook gather under the green light": "**AI Marine Biologist**: Common Snook (*Centropomus undecimalis*) are nocturnal ambush predators. The 1000W green LED light attracts marine plankton, which draws baitfish (like mullet or pilchards). Snook use the shadow edges of the dock to hide, launching swift ambush attacks when baitfish cross into the illuminated zone.",
    "how does the incoming tide affect ocean visibility at boynton inlet": "**AI Marine Biologist**: The Boynton Beach Inlet is a dynamic tidal channel. During an **incoming tide**, clear water from the Gulf Stream rushes into the Intracoastal Lagoon, resulting in high visibility (up to 65+ feet) and cooler, oxygen-rich water. Conversely, during an outgoing tide, murky water from the lagoon flows out, reducing visibility.",
    "are goliath groupers dangerous to humans": "**AI Marine Biologist**: Goliath Groupers (*Epinephelus itajara*) are massive but generally peaceful and curious giants. They pose no threat to humans and often inspect the underwater camera. However, they are highly territorial and will emit a deep, low-frequency 'booming' sound using their swim bladders to warn off intruders.",
    "why is the green light better than white light underwater": "**AI Marine Biologist**: Green light has a specific wavelength (~520 nm) that cuts through turbid, plankton-rich coastal water with minimal scattering compared to white or red light. Additionally, marine organisms are less startled by green light, which establishes a stable, active feeding ecosystem beneath the dock.",
    "what is the average size of a tarpon seen on the camera": "**AI Marine Biologist**: Atlantic Tarpon (*Megalops atlanticus*) seen on the SaltWaterCam range from **4 to 8 feet** in length and can weigh over 100–150 pounds. They are migratory fish that utilize Boynton Inlet to transition between the Atlantic Ocean and coastal estuaries.",
    "how does water temperature affect the fish active on the livestream": "**AI Marine Biologist**: Water temperature plays a critical role in fish metabolism. In Florida, Snook become sluggish when water temperatures drop below **68°F** and can suffer from cold-shock. The current Bermuda Current temperature of **78.4°F** is optimal for high metabolic activity, prompting snook and tarpon to feed aggressively."
  };

  const handleAskPrompt = (questionText) => {
    if (!questionText.trim()) return;
    setIsPromptLoading(true);
    setAiResponse('');
    
    // Simulate LLM latency
    setTimeout(() => {
      const normalizedQ = questionText.toLowerCase().trim().replace(/[?.]/g, "");
      
      // Match key terms if not exact
      let match = commonQAs[normalizedQ];
      if (!match) {
        // Simple keywords search
        if (normalizedQ.includes("snook")) {
          match = commonQAs["why do snook gather under the green light"];
        } else if (normalizedQ.includes("tide") || normalizedQ.includes("visibility") || normalizedQ.includes("inlet")) {
          match = commonQAs["how does the incoming tide affect ocean visibility at boynton inlet"];
        } else if (normalizedQ.includes("grouper") || normalizedQ.includes("goliath")) {
          match = commonQAs["are goliath groupers dangerous to humans"];
        } else if (normalizedQ.includes("light") || normalizedQ.includes("green")) {
          match = commonQAs["why is the green light better than white light underwater"];
        } else if (normalizedQ.includes("tarpon") || normalizedQ.includes("size")) {
          match = commonQAs["what is the average size of a tarpon seen on the camera"];
        } else if (normalizedQ.includes("temp") || normalizedQ.includes("temperature") || normalizedQ.includes("weather")) {
          match = commonQAs["how does water temperature affect the fish active on the livestream"];
        } else {
          // Dynamic synthesize fallback response
          match = `**AI Marine Biologist**: That's a great question about the Lantana dock ecosystem! Based on our local species directory:
- We track **Snook, Tarpon, Goliath Groupers, Green Sea Turtles, and Southern Stingrays**.
- The green attraction light attracts plankton, baitfish, and predators at night.
- The water temp is currently **78.4°F** and visibility is **65 feet**.

Could you clarify if you'd like details on Snook hunting patterns, Tarpon migration, or local Boynton Beach Inlet currents?`;
        }
      }
      
      setAiResponse(match);
      setIsPromptLoading(false);
    }, 1500);
  };

  return (
    <div className="pageContainer aiFeaturesPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      {/* Keyframe animations styles injection */}
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounceDot {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
      `}</style>

      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 12px', borderRadius: '30px', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <Cpu size={14} /> AI Features
        </p>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: '900', margin: '12px 0 6px 0', letterSpacing: '0.01em' }}>
          AI Computer Vision Dashboard
        </h1>
        <p className="subtitle" style={{ fontSize: '1rem', color: '#b7cad6', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Explore metrics from our simulated YOLOv8-based computer vision model deployed to recognize Florida marine life.
        </p>
      </div>

      {/* Grid: 4 Core Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldCheck size={16} style={{ color: '#39ff88' }} /> Model Accuracy
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', margin: '8px 0 4px 0', fontFamily: 'Outfit, sans-serif' }}>
            {stats.accuracy}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>mAP@0.5 IoU benchmark</span>
        </div>

        <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Clock size={16} style={{ color: '#22d3ee' }} /> Inference Speed
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', margin: '8px 0 4px 0', fontFamily: 'Outfit, sans-serif' }}>
            {stats.inferenceTime}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>NVIDIA Jetson edge latency</span>
        </div>

        <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Target size={16} style={{ color: '#f59e0b' }} /> Active Targets
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', margin: '8px 0 4px 0', fontFamily: 'Outfit, sans-serif' }}>
            {stats.activeTargets} <span style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: '800' }}>FISH</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>Tracking in current frame</span>
        </div>

        <div style={{ padding: '20px', background: 'rgba(6, 32, 49, 0.45)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#b7cad6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Zap size={16} style={{ color: '#e11d48' }} /> Detections Today
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', margin: '8px 0 4px 0', fontFamily: 'Outfit, sans-serif' }}>
            {stats.detectionsToday}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#b7cad6' }}>Logged detections past 24h</span>
        </div>
      </div>

      {/* SVG Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* Detection Distribution Chart */}
        <TiltCard revealRef={revealRef} style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: '#22d3ee' }} /> Sighting Distribution
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: '#b7cad6' }}>Percentage of total detections categorised by species classification today.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.distribution.map((dist, idx) => {
              const colors = ['#22d3ee', '#064c72', '#39ff88', '#f59e0b', '#e11d48'];
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700' }}>
                    <span style={{ color: '#fff' }}>{dist.name}</span>
                    <span style={{ color: colors[idx % colors.length] }}>{dist.value}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${dist.value}%`, height: '100%', background: colors[idx % colors.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </TiltCard>

        {/* Model Training Convergence SVG Graph */}
        <TiltCard revealRef={revealRef} style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: '#39ff88' }} /> Model Loss Convergence
          </h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: '#b7cad6' }}>Visual representation of validation bounding box loss decreasing over training epochs.</p>

          {/* SVG Line Graph */}
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              {/* Loss Curve */}
              <path 
                d="M 40 40 Q 120 150 200 160 T 380 166" 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.4))' }}
              />

              {/* Data points */}
              <circle cx="40" cy="40" r="4" fill="#22d3ee" />
              <circle cx="150" cy="148" r="4" fill="#22d3ee" />
              <circle cx="270" cy="163" r="4" fill="#39ff88" />
              <circle cx="380" cy="166" r="4" fill="#39ff88" />

              {/* Axis labels */}
              <text x="30" y="174" fill="#b7cad6" fontSize="9" textAnchor="end">0.0</text>
              <text x="30" y="124" fill="#b7cad6" fontSize="9" textAnchor="end">0.5</text>
              <text x="30" y="74" fill="#b7cad6" fontSize="9" textAnchor="end">1.0</text>
              <text x="30" y="24" fill="#b7cad6" fontSize="9" textAnchor="end">1.5</text>

              <text x="40" y="190" fill="#b7cad6" fontSize="9" textAnchor="middle">Ep. 1</text>
              <text x="150" y="190" fill="#b7cad6" fontSize="9" textAnchor="middle">Ep. 25</text>
              <text x="270" y="190" fill="#b7cad6" fontSize="9" textAnchor="middle">Ep. 50</text>
              <text x="380" y="190" fill="#b7cad6" fontSize="9" textAnchor="middle">Ep. 80</text>
            </svg>
          </div>
        </TiltCard>
      </div>

      {/* LLM Telemetry & AI Prompt Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
        {/* Left Column: AI Biologist Telemetry Analyzer */}
        <TiltCard revealRef={revealRef} style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#22d3ee' }} /> AI Biologist Daily Briefing
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#b7cad6' }}>Natural language synthesis of real-time telemetry sensors and YOLOv8 classification targets.</p>
            
            {isAnalyzing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px', minHeight: '160px' }}>
                <RefreshCw size={24} style={{ color: '#22d3ee', animation: 'spinSlow 1.5s linear infinite' }} />
                <span style={{ fontSize: '0.82rem', color: '#22d3ee', fontWeight: '800', letterSpacing: '0.05em' }}>AI IS COMPILING SENSOR TELEMETRY...</span>
              </div>
            ) : (
              <div style={{ fontSize: '0.92rem', color: '#e2f1fc', lineHeight: '1.6', minHeight: '160px', background: 'rgba(2, 11, 18, 0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.1)' }}>
                {telemetryBrief.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ margin: 0 }}>
                    {paragraph.startsWith('**AI Biologist Analysis**:') ? (
                      <>
                        <strong style={{ color: '#22d3ee' }}>AI Biologist Analysis: </strong>
                        {paragraph.substring(26)}
                      </>
                    ) : paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setTelemetrySeed(prev => prev + 1)}
            disabled={isAnalyzing}
            style={{
              marginTop: '20px',
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1.5px solid rgba(34, 211, 238, 0.25)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '24px',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontWeight: '800',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { if (!isAnalyzing) e.currentTarget.style.background = 'rgba(34, 211, 238, 0.18)'; }}
            onMouseLeave={(e) => { if (!isAnalyzing) e.currentTarget.style.background = 'rgba(34, 211, 238, 0.08)'; }}
          >
            <RefreshCw size={14} style={{ animation: isAnalyzing ? 'spinSlow 1.5s linear infinite' : 'none' }} /> 
            GENERATE FRESH INSIGHTS
          </button>
        </TiltCard>

        {/* Right Column: LLM Marine Science Prompt Assistant */}
        <TiltCard revealRef={revealRef} style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: '#39ff88' }} /> LLM Marine Science Assistant
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#b7cad6' }}>Ask the AI Marine Biologist questions about species habits, water temp, or light physics.</p>
            
            {/* Quick Questions bubbles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {["Why Snook love green light?", "How tide affects visibility?", "Are Goliath Groupers safe?"].map((q, idx) => {
                const fullQuestions = [
                  "Why do Snook gather under the green light?",
                  "How does the incoming tide affect ocean visibility at Boynton Inlet?",
                  "Are Goliath Groupers dangerous to humans?"
                ];
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(fullQuestions[idx]);
                      handleAskPrompt(fullQuestions[idx]);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#b7cad6',
                      borderRadius: '16px',
                      padding: '5px 12px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: '700',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#39ff88'; e.currentTarget.style.background = 'rgba(57, 255, 136, 0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#b7cad6'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    {q}
                  </button>
                );
              })}
            </div>

            {/* Answer Display */}
            <div style={{ height: '140px', overflowY: 'auto', background: 'rgba(2, 11, 18, 0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(57, 255, 136, 0.1)', marginBottom: '16px', fontSize: '0.86rem', lineHeight: '1.5' }}>
              {isPromptLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#39ff88', borderRadius: '50%', animation: 'bounceDot 0.6s infinite alternate' }} />
                    <span style={{ width: '6px', height: '6px', background: '#39ff88', borderRadius: '50%', animation: 'bounceDot 0.6s infinite alternate 0.2s' }} />
                    <span style={{ width: '6px', height: '6px', background: '#39ff88', borderRadius: '50%', animation: 'bounceDot 0.6s infinite alternate 0.4s' }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#39ff88', fontWeight: '800', letterSpacing: '0.04em' }}>AI IS COMPILING RESPONSE...</span>
                </div>
              ) : aiResponse ? (
                <div style={{ color: '#e2f1fc' }}>
                  {aiResponse.split('\n').map((line, idx) => {
                    if (line.startsWith('**AI Marine Biologist**:')) {
                      return <p key={idx} style={{ margin: 0 }}><strong style={{ color: '#39ff88' }}>AI Marine Biologist: </strong>{line.substring(25)}</p>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} style={{ marginLeft: '10px', marginTop: '4px' }}>{line.substring(2)}</li>;
                    }
                    return <p key={idx} style={{ margin: idx === 0 ? 0 : '8px 0 0 0' }}>{line}</p>;
                  })}
                </div>
              ) : (
                <span style={{ color: '#b7cad6', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  Ask a question above or select a quick question to get started.
                </span>
              )}
            </div>
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskPrompt(promptInput);
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input 
              type="text" 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask anything about Boynton Inlet marine life..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '24px',
                background: 'rgba(3, 17, 28, 0.7)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.85rem',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#39ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button 
              type="submit"
              disabled={isPromptLoading || !promptInput.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #064c72 0%, #39ff88 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: (isPromptLoading || !promptInput.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: promptInput.trim() ? '0 0 10px rgba(57, 255, 136, 0.3)' : 'none'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </TiltCard>
      </div>

      {/* Model Tech details explanation */}
      <section style={{ padding: '28px', background: 'rgba(6, 32, 49, 0.45)', border: '1.5px solid rgba(34, 211, 238, 0.25)', borderRadius: '16px', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: '900', color: '#fff', margin: '0 0 16px 0', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '10px' }}>
          Computer Vision Methodology
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', fontSize: '0.9rem', color: '#b7cad6', lineHeight: '1.6' }}>
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: '#fff', margin: '0 0 8px 0', fontWeight: '800' }}>
              Edge Computing Architecture
            </h4>
            <p style={{ margin: 0 }}>
              The camera feed is processed directly at the Lantana dock edge using an NVIDIA Jetson platform. This eliminates latency and cloud hosting bandwidth costs, analyzing the 4K stream locally at 30 frames per second.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: '#fff', margin: '0 0 8px 0', fontWeight: '800' }}>
              Deep Learning Classification
            </h4>
            <p style={{ margin: 0 }}>
              We trained custom YOLOv8 object detection parameters on a dataset of over 20,000 annotated underwater frames. The network predicts bounding box coordinates and outputs species classifications with high confidence levels.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: '#fff', margin: '0 0 8px 0', fontWeight: '800' }}>
              Telemetry HUD Sync
            </h4>
            <p style={{ margin: 0 }}>
              The detected fish statistics are synced with physical telemetry sensors measuring salinity, current flow, and water temp, enabling research on how changing inlet environments impact fish migration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
