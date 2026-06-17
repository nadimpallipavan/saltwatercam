import { useState, useRef, useEffect } from 'react';

export default function TiltCard({ children, className = '', revealRef }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [reflectionStyle, setReflectionStyle] = useState({ opacity: 0 });

  useEffect(() => {
    if (revealRef && cardRef.current) {
      revealRef(cardRef.current);
    }
  }, [revealRef]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (range: -width/2 to width/2)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Normalize coordinates (range: -1 to 1)
    const pctX = mouseX / (width / 2);
    const pctY = mouseY / (height / 2);

    // Max rotation angles (degrees)
    const maxRotate = 10;
    const rotateX = -pctY * maxRotate;
    const rotateY = pctX * maxRotate;

    // Set tilt transform style
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.08s ease-out',
    });

    // Calculate glare position
    const glareX = (e.clientX - rect.left) / width * 100;
    const glareY = (e.clientY - rect.top) / height * 100;

    // Update reflection glare styling
    setReflectionStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 80%)`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    // Reset tilt transform and fade out reflection glare smoothly
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out',
    });
    setReflectionStyle({
      opacity: 0,
      transition: 'opacity 0.4s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        ...tiltStyle,
      }}
      className={className}
    >
      {/* Glare reflection overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 10,
          mixBlendMode: 'overlay',
          ...reflectionStyle,
        }}
      />
      {children}
    </div>
  );
}
