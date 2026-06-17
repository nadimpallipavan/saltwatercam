import { useEffect, useRef, useState } from 'react';

export default function useAmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const lfoRef = useRef(null);
  const gainNodeRef = useRef(null);

  const startAudio = () => {
    try {
      // Initialize AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // 1. Generate White Noise Buffer (represents raw water movement)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      noiseNodeRef.current = noiseSource;

      // 2. Low-pass filter to convert white noise to deep water rumble
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(140, ctx.currentTime); // Deep hum
      lowpass.Q.setValueAtTime(1.5, ctx.currentTime);

      // 3. Main gain node (volume)
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNodeRef.current = mainGain;

      // 4. LFO (Low Frequency Oscillator) to simulate rolling wave swells
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8.3 second swell cycle
      lfo.type = 'sine';
      lfoRef.current = lfo;

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.025, ctx.currentTime); // Max depth of swell

      // Route LFO -> lfoGain -> mainGain.gain parameter
      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);

      // Route Noise -> Lowpass -> MainGain -> Speakers
      noiseSource.connect(lowpass);
      lowpass.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Start nodes
      noiseSource.start();
      lfo.start();
      setIsPlaying(true);
    } catch (e) {
      console.error('Failed to initialize ambient audio:', e);
    }
  };

  const stopAudio = () => {
    try {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      }
      if (lfoRef.current) {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    } catch (e) {
      console.warn('Error stopping ambient audio:', e);
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return { isPlaying, toggleAudio };
}
