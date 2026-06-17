import { useEffect, useRef } from 'react';

export default function WaterParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = 60;

    // Mouse coordinates tracker
    const mouse = {
      x: null,
      y: null,
      radius: 120, // Interaction radius
    };

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle Class
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        // Start from bottom on reset, or random height on initialization
        this.y = init ? Math.random() * canvas.height : canvas.height + 20;
        this.radius = Math.random() * 3 + 1; // 1px to 4px
        this.speedY = -(Math.random() * 0.8 + 0.3); // Upward velocity
        this.speedX = Math.random() * 0.4 - 0.2; // Minor drift
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        this.wobbleVal = Math.random() * Math.PI * 2;
        this.wobbleRange = Math.random() * 0.6 + 0.2;
        this.opacity = Math.random() * 0.3 + 0.1; // Soft visibility
        // Mostly bioluminescent aquas/teals, with occasional soft white
        const randColor = Math.random();
        if (randColor < 0.6) {
          this.color = `rgba(34, 211, 238, ${this.opacity})`; // Aqua
        } else if (randColor < 0.9) {
          this.color = `rgba(57, 255, 136, ${this.opacity})`; // Green glow
        } else {
          this.color = `rgba(255, 255, 255, ${this.opacity})`; // Soft white
        }
      }

      update() {
        // Apply vertical drift
        this.y += this.speedY;

        // Apply wobble
        this.wobbleVal += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleVal) * this.wobbleRange + this.speedX;

        // Mouse interaction (push away)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Push force diminishes with distance
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            
            // Push away
            this.x += Math.cos(angle) * force * 3;
            this.y += Math.sin(angle) * force * 1.5; // Slight vertical nudge
          }
        }

        // Reset if floats off screen
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 2; // Glowing aura
        ctx.shadowColor = this.color.includes('238') ? '#22D3EE' : '#39FF88';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for efficiency
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
