import { siteContent } from '../data/siteContent.js';
import { Cpu, Target, Clock, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import TiltCard from '../components/TiltCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function AIFeaturesPage() {
  const revealRef = useScrollReveal();
  const stats = siteContent.aiModelStats;

  return (
    <div className="pageContainer aiFeaturesPage" style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
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
